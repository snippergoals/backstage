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

import { NotFoundError } from '@backstage/backend-common';
import lodash from 'lodash';
import { DescriptorEnvelope } from '../ingestion';
import { EntitiesCatalog } from './types';

export class StaticEntitiesCatalog implements EntitiesCatalog {
  private _entities: DescriptorEnvelope[];

  constructor(entities: DescriptorEnvelope[]) {
    this._entities = entities;
  }

  async entities(): Promise<DescriptorEnvelope[]> {
    return lodash.cloneDeep(this._entities);
  }

  async entity(
    kind: string,
    name: string,
    namespace: string | undefined,
  ): Promise<DescriptorEnvelope | undefined> {
    const item = this._entities.find(
      e =>
        kind === e.kind &&
        name === e.metadata?.name &&
        namespace === e.metadata?.namespace,
    );
    if (!item) {
      throw new NotFoundError('Entity cannot be found');
    }
    return lodash.cloneDeep(item);
  }
}
