/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { UrlReader } from '@backstage/backend-common';
import {
  Entity,
  ENTITY_DEFAULT_NAMESPACE,
  LocationSpec,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { CatalogRulesEnforcer } from './CatalogRules';
import * as result from './processors/results';
import {
  LocationProcessor,
  LocationProcessorDataResult,
  LocationProcessorEmit,
  LocationProcessorEntityResult,
  LocationProcessorErrorResult,
  LocationProcessorLocationResult,
  LocationProcessorResult,
} from './processors/types';
import { LocationReader, ReadLocationResult } from './types';

// The max amount of nesting depth of generated work items
const MAX_DEPTH = 10;

type Options = {
  reader: UrlReader;
  logger: Logger;
  config: Config;
  processors: LocationProcessor[];
  rulesEnforcer: CatalogRulesEnforcer;
};

/**
 * Implements the reading of a location through a series of processor tasks.
 */
export class LocationReaders implements LocationReader {
  private readonly options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  async read(location: LocationSpec): Promise<ReadLocationResult> {
    const { rulesEnforcer, logger } = this.options;

    const output: ReadLocationResult = { entities: [], errors: [] };
    let items: LocationProcessorResult[] = [result.location(location, false)];

    for (let depth = 0; depth < MAX_DEPTH; ++depth) {
      const newItems: LocationProcessorResult[] = [];
      const emit: LocationProcessorEmit = i => newItems.push(i);

      for (const item of items) {
        if (item.type === 'location') {
          await this.handleLocation(item, emit);
        } else if (item.type === 'data') {
          await this.handleData(item, emit);
        } else if (item.type === 'entity') {
          if (rulesEnforcer.isAllowed(item.entity, item.location)) {
            const entity = await this.handleEntity(item, emit);
            output.entities.push({
              entity,
              location: item.location,
            });
          } else {
            output.errors.push({
              location: item.location,
              error: new Error(
                `Entity of kind ${item.entity.kind} is not allowed from location ${item.location.target}:${item.location.type}`,
              ),
            });
          }
        } else if (item.type === 'error') {
          await this.handleError(item, emit);
          output.errors.push({
            location: item.location,
            error: item.error,
          });
        }
      }

      if (newItems.length === 0) {
        return output;
      }

      items = newItems;
    }

    const message = `Max recursion depth ${MAX_DEPTH} reached for ${location.type} ${location.target}`;
    logger.warn(message);
    output.errors.push({ location, error: new Error(message) });
    return output;
  }

  private async handleLocation(
    item: LocationProcessorLocationResult,
    emit: LocationProcessorEmit,
  ) {
    const { processors, logger } = this.options;

    for (const processor of processors) {
      if (processor.readLocation) {
        try {
          if (
            await processor.readLocation(item.location, item.optional, emit)
          ) {
            return;
          }
        } catch (e) {
          const message = `Processor ${processor.constructor.name} threw an error while reading location ${item.location.type} ${item.location.target}, ${e}`;
          emit(result.generalError(item.location, message));
          logger.warn(message);
        }
      }
    }

    const message = `No processor was able to read location ${item.location.type} ${item.location.target}`;
    emit(result.inputError(item.location, message));
    logger.warn(message);
  }

  private async handleData(
    item: LocationProcessorDataResult,
    emit: LocationProcessorEmit,
  ) {
    const { processors, logger } = this.options;

    for (const processor of processors) {
      if (processor.parseData) {
        try {
          if (await processor.parseData(item.data, item.location, emit)) {
            return;
          }
        } catch (e) {
          const message = `Processor ${processor.constructor.name} threw an error while parsing ${item.location.type} ${item.location.target}, ${e}`;
          emit(result.generalError(item.location, message));
          logger.warn(message);
        }
      }
    }

    const message = `No processor was able to parse location ${item.location.type} ${item.location.target}`;
    emit(result.inputError(item.location, message));
  }

  private async handleEntity(
    item: LocationProcessorEntityResult,
    emit: LocationProcessorEmit,
  ): Promise<Entity> {
    const { processors, logger } = this.options;

    let current = item.entity;

    for (const processor of processors) {
      if (processor.processEntity) {
        try {
          current = await processor.processEntity(current, item.location, emit);
        } catch (e) {
          // Construct the name carefully, if we got validation errors we do
          // not want to crash here due to missing metadata or so
          const namespace = !current.metadata
            ? ''
            : current.metadata.namespace ?? ENTITY_DEFAULT_NAMESPACE;
          const name = !current.metadata ? '' : current.metadata.name;
          const message = `Processor ${processor.constructor.name} threw an error while processing entity ${current.kind}:${namespace}/${name} at ${item.location.type} ${item.location.target}, ${e}`;
          emit(result.generalError(item.location, message));
          logger.warn(message);
        }
      }
    }

    return current;
  }

  private async handleError(
    item: LocationProcessorErrorResult,
    emit: LocationProcessorEmit,
  ) {
    const { processors, logger } = this.options;

    logger.debug(
      `Encountered error at location ${item.location.type} ${item.location.target}, ${item.error}`,
    );

    for (const processor of processors) {
      if (processor.handleError) {
        try {
          await processor.handleError(item.error, item.location, emit);
        } catch (e) {
          const message = `Processor ${processor.constructor.name} threw an error while handling another error at ${item.location.type} ${item.location.target}, ${e}`;
          emit(result.generalError(item.location, message));
          logger.warn(message);
        }
      }
    }
  }
}
