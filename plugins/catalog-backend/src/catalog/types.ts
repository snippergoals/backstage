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

export type Component = {
  name: string;
};

export type Location = {
  id: string;
  type: string;
  target: string;
};

export type AddLocationRequest = {
  type: string;
  target: string;
};

export const addLocationRequestShape: yup.Schema<AddLocationRequest> = yup
  .object({
    type: yup.string().required(),
    target: yup.string().required(),
  })
  .noUnknown();

export type Catalog = {
  addOrUpdateComponent(component: Component): Promise<Component>;
  components(): Promise<Component[]>;
  component(id: string): Promise<Component>;
  addLocation(location: AddLocationRequest): Promise<Location>;
  removeLocation(id: string): Promise<void>;
  locations(): Promise<Location[]>;
  location(id: string): Promise<Location>;
};
