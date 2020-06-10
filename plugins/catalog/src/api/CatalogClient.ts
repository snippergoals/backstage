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

import { CatalogApi } from './types';
import { DescriptorEnvelope } from '../types';
import {
  Entity,
  Location,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';

export class CatalogClient implements CatalogApi {
  private apiOrigin: string;
  private basePath: string;
  constructor({
    apiOrigin,
    basePath,
  }: {
    apiOrigin: string;
    basePath: string;
  }) {
    this.apiOrigin = apiOrigin;
    this.basePath = basePath;
  }
  async getLocationById(id: String): Promise<Location | undefined> {
    const response = await fetch(
      `${this.apiOrigin}${this.basePath}/locations/${id}`,
    );
    if (response.ok) {
      const location = await response.json();
      if (location) return location.data;
    }
    return undefined;
  }
  async removeEntityByUid(uid: string): Promise<void> {
    const response = await fetch(
      `${this.apiOrigin}${this.basePath}/entities/by-uid/${uid}`,
      {
        method: 'DELETE',
      },
    );
    if (!response.ok) {
      const payload = await response.text();
      throw new Error(
        `Request failed with ${response.status} ${response.statusText}, ${payload}`,
      );
    }
    return undefined;
  }
  async removeLocationById(id: string): Promise<void> {
    const response = await fetch(
      `${this.apiOrigin}${this.basePath}/locations/${id}`,
      {
        method: 'DELETE',
      },
    );
    if (!response.ok) {
      const payload = await response.text();
      throw new Error(
        `Request failed with ${response.status} ${response.statusText}, ${payload}`,
      );
    }
    return undefined;
  }
  async getEntities(
    filter?: Record<string, string>,
  ): Promise<DescriptorEnvelope[]> {
    let url = `${this.apiOrigin}${this.basePath}/entities`;
    if (filter) {
      url += '?';
      url += Object.entries(filter)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join('&');
    }
    const response = await fetch(url);
    if (!response.ok) {
      const payload = await response.text();
      throw new Error(
        `Request failed with ${response.status} ${response.statusText}, ${payload}`,
      );
    }

    return await response.json();
  }

  async getEntity({
    name,
    namespace,
    kind,
  }: {
    name: string;
    namespace?: string;
    kind: string;
  }): Promise<DescriptorEnvelope> {
    const response = await fetch(
      `${this.apiOrigin}${this.basePath}/entities/by-name/${kind}/${
        namespace ?? 'default'
      }/${name}`,
    );
    const entity = await response.json();
    if (entity) return entity;
    throw new Error(`'Entity not found: ${name}`);
  }

  async addLocation(type: string, target: string) {
    const response = await fetch(
      `${this.apiOrigin}${this.basePath}/locations`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ type, target }),
      },
    );

    if (response.status !== 201) {
      throw new Error(await response.text());
    }

    const { location, entities } = await response.json();

    if (!location || entities.length === 0)
      throw new Error(`Location wasn't added: ${target}`);

    return {
      location,
      entities,
    };
  }

  async getLocationByEntity(entity: Entity): Promise<Location | undefined> {
    const locationId = entity.metadata.annotations?.[LOCATION_ANNOTATION];
    if (!locationId) return undefined;

    const location = this.getLocationById(locationId);

    return location;
  }
}
