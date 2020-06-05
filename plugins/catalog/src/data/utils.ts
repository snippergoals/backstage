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
import { Component } from './component';
import {
  Entity,
  Location,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';

export const envelopeToComponent = (envelope: Entity): Component => {
  return {
    name: envelope.metadata?.name ?? '',
    kind: envelope.kind ?? 'unknown',
    description: envelope.metadata?.annotations?.description ?? 'placeholder',
  };
};
export const findLocationForEntity = (
  entity: Entity,
  locations: Location[],
): Location | undefined => {
  const entityLocationId = entity.metadata.annotations?.[LOCATION_ANNOTATION];
  return locations.find(location => location.id === entityLocationId);
};
