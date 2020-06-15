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

import * as yup from 'yup';
import type { Entity } from '../entity/Entity';
import type { EntityPolicy } from '../types';

const API_VERSION = 'backstage.io/v1beta1';
const KIND = 'Component';

export interface ComponentEntityV1beta1 extends Entity {
  apiVersion: typeof API_VERSION;
  kind: typeof KIND;
  spec: {
    type: string;
  };
}

export class ComponentEntityV1beta1Policy implements EntityPolicy {
  private schema: yup.Schema<any>;

  constructor() {
    this.schema = yup.object<Partial<ComponentEntityV1beta1>>({
      spec: yup
        .object({
          type: yup.string().required(),
        })
        .required(),
    });
  }

  async enforce(envelope: Entity): Promise<Entity> {
    if (envelope.apiVersion !== API_VERSION || envelope.kind !== KIND) {
      throw new Error('Unsupported apiVersion / kind');
    }

    return await this.schema.validate(envelope, { strict: true });
  }
}
