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
import { Entity } from '../ingestion';

//
// Entities
//

export type EntityFilter = {
  key: string;
  values: (string | null)[];
};
export type EntityFilters = EntityFilter[];

export type EntitiesCatalog = {
  entities(filters?: EntityFilters): Promise<Entity[]>;
  entityByUid(uid: string): Promise<Entity | undefined>;
  entityByName(
    kind: string,
    namespace: string | undefined,
    name: string,
  ): Promise<Entity | undefined>;
};

//
// Locations
//

export type Location = {
  id: string;
  type: string;
  target: string;
};

export type AddLocation = {
  type: string;
  target: string;
};

export const addLocationSchema: yup.Schema<AddLocation> = yup
  .object({
    type: yup.string().required(),
    target: yup.string().required(),
  })
  .noUnknown();

export type LocationsCatalog = {
  addLocation(location: AddLocation): Promise<Location>;
  removeLocation(id: string): Promise<void>;
  locations(): Promise<Location[]>;
  location(id: string): Promise<Location>;
};
