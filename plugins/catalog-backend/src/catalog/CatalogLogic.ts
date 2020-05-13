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

import { Logger } from 'winston';
import { LocationReader } from '../ingestion/types';
import { Catalog } from './types';

export class CatalogLogic {
  public static startRefreshLoop(
    catalog: Catalog,
    reader: LocationReader,
    logger: Logger,
  ): () => void {
    let cancelled = false;

    const startRefresh = async () => {
      while (!cancelled) {
        await CatalogLogic.refreshLocations(catalog, reader, logger);
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    };
    startRefresh();

    return () => {
      cancelled = true;
    };
  }

  public static async refreshLocations(
    catalog: Catalog,
    reader: LocationReader,
    logger: Logger,
  ): Promise<void> {
    const locations = await catalog.locations();
    for (const location of locations) {
      try {
        logger.debug(`Attempting refresh of location: ${location.id}`);
        const components = await reader(location);
        for (const component of components) {
          await catalog.addOrUpdateComponent(component);
        }
      } catch (e) {
        logger.debug(`Failed to update location "${location.id}", ${e}`);
      }
    }
  }
}
