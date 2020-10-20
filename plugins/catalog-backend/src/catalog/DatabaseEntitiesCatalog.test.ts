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

import { getVoidLogger } from '@backstage/backend-common';
import type { Entity } from '@backstage/catalog-model';
import { Database, DatabaseManager } from '../database';
import { DatabaseEntitiesCatalog } from './DatabaseEntitiesCatalog';
import { EntityMutationRequest } from './types';

describe('DatabaseEntitiesCatalog', () => {
  let db: jest.Mocked<Database>;

  beforeAll(() => {
    db = {
      transaction: jest.fn(),
      addEntities: jest.fn(),
      updateEntity: jest.fn(),
      entities: jest.fn(),
      entityByName: jest.fn(),
      entityByUid: jest.fn(),
      removeEntityByUid: jest.fn(),
      setRelations: jest.fn(),
      addLocation: jest.fn(),
      removeLocation: jest.fn(),
      location: jest.fn(),
      locations: jest.fn(),
      locationHistory: jest.fn(),
      addLocationUpdateLogEvent: jest.fn(),
    };
  });

  beforeEach(() => {
    jest.resetAllMocks();
    db.transaction.mockImplementation(async f => f('tx'));
  });

  describe('batchAddOrUpdateEntities', () => {
    it('adds when no given uid and no matching by name', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
      };

      db.entities.mockResolvedValue([]);
      db.addEntities.mockResolvedValue([
        { entity: { ...entity, metadata: { ...entity.metadata, uid: 'u' } } },
      ]);

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.batchAddOrUpdateEntities([
        { entity, relations: [] },
      ]);

      expect(db.entities).toHaveBeenCalledTimes(1);
      expect(db.entities).toHaveBeenCalledWith(expect.anything(), {
        kind: 'b',
        'metadata.namespace': 'd',
        'metadata.name': ['c'],
      });
      expect(db.setRelations).toHaveBeenCalledTimes(1);
      expect(db.setRelations).toHaveBeenCalledWith(expect.anything(), 'u', []);
      expect(db.addEntities).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ entityId: 'u' }]);
    });

    it('updates when given uid', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          uid: 'u',
          name: 'c',
          namespace: 'd',
        },
        spec: {
          x: 'b',
        },
      };
      const existing = {
        entity: {
          apiVersion: 'a',
          kind: 'b',
          metadata: {
            uid: 'u',
            etag: 'e',
            generation: 1,
            name: 'c',
            namespace: 'd',
          },
          spec: {
            x: 'a',
          },
        },
      };

      db.entities.mockResolvedValue([existing]);
      db.entityByUid.mockResolvedValue(existing);
      db.updateEntity.mockResolvedValue({ entity });

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.batchAddOrUpdateEntities([
        { entity, relations: [] },
      ]);

      expect(db.entities).toHaveBeenCalledTimes(1);
      expect(db.entities).toHaveBeenCalledWith(expect.anything(), {
        kind: 'b',
        'metadata.namespace': 'd',
        'metadata.name': ['c'],
      });
      expect(db.entityByName).not.toHaveBeenCalled();
      expect(db.entityByUid).toHaveBeenCalledTimes(1);
      expect(db.entityByUid).toHaveBeenCalledWith(expect.anything(), 'u');
      expect(db.updateEntity).toHaveBeenCalledTimes(1);
      expect(db.updateEntity).toHaveBeenCalledWith(
        expect.anything(),
        {
          entity: {
            apiVersion: 'a',
            kind: 'b',
            metadata: {
              uid: 'u',
              etag: expect.any(String),
              generation: 2,
              name: 'c',
              namespace: 'd',
            },
            spec: {
              x: 'b',
            },
          },
        },
        'e',
        1,
      );
      expect(db.setRelations).toHaveBeenCalledTimes(1);
      expect(db.setRelations).toHaveBeenCalledWith(expect.anything(), 'u', []);
      expect(result).toEqual([{ entityId: 'u' }]);
    });

    it('update when no given uid and matching by name', async () => {
      const added: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
        spec: {
          x: 'b',
        },
      };
      const existing = {
        entity: {
          apiVersion: 'a',
          kind: 'b',
          metadata: {
            uid: 'u',
            etag: 'e',
            generation: 1,
            name: 'c',
            namespace: 'd',
          },
          spec: {
            x: 'a',
          },
        },
      };

      db.entities.mockResolvedValue([existing]);
      db.entityByName.mockResolvedValue(existing);
      db.updateEntity.mockResolvedValue(existing);

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.batchAddOrUpdateEntities([
        { entity: added, relations: [] },
      ]);

      expect(db.entities).toHaveBeenCalledTimes(1);
      expect(db.entities).toHaveBeenCalledWith(expect.anything(), {
        kind: 'b',
        'metadata.namespace': 'd',
        'metadata.name': ['c'],
      });
      expect(db.entityByName).toHaveBeenCalledTimes(1);
      expect(db.entityByName).toHaveBeenCalledWith(expect.anything(), {
        kind: 'b',
        namespace: 'd',
        name: 'c',
      });
      expect(db.updateEntity).toHaveBeenCalledTimes(1);
      expect(db.updateEntity).toHaveBeenCalledWith(
        expect.anything(),
        {
          entity: {
            apiVersion: 'a',
            kind: 'b',
            metadata: {
              uid: 'u',
              etag: expect.any(String),
              generation: 2,
              name: 'c',
              namespace: 'd',
            },
            spec: {
              x: 'b',
            },
          },
        },
        'e',
        1,
      );
      expect(result).toEqual([{ entityId: 'u' }]);
    });

    it('should not update if entity is unchanged', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          uid: 'u',
          name: 'c',
          namespace: 'd',
        },
        spec: {
          x: 'a',
        },
      };

      db.entities.mockResolvedValue([{ entity }]);
      db.entityByUid.mockResolvedValue({ entity });
      db.updateEntity.mockResolvedValue({ entity });

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.batchAddOrUpdateEntities([
        { entity, relations: [] },
      ]);

      expect(db.entities).toHaveBeenCalledTimes(1);
      expect(db.entities).toHaveBeenCalledWith(expect.anything(), {
        kind: 'b',
        'metadata.namespace': 'd',
        'metadata.name': ['c'],
      });
      expect(db.entityByName).not.toHaveBeenCalled();
      expect(db.entityByUid).not.toHaveBeenCalled();
      expect(db.updateEntity).not.toHaveBeenCalled();
      expect(db.setRelations).toHaveBeenCalledTimes(1);
      expect(db.setRelations).toHaveBeenCalledWith(expect.anything(), 'u', []);
      expect(result).toEqual([{ entityId: 'u' }]);
    });

    it('both adds and updates', async () => {
      const catalog = new DatabaseEntitiesCatalog(
        await DatabaseManager.createTestDatabase(),
        getVoidLogger(),
      );
      const entities: EntityMutationRequest[] = [];
      for (let i = 0; i < 500; ++i) {
        entities.push({
          entity: {
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: `n${i}` },
          },
          relations: [],
        });
      }

      await catalog.batchAddOrUpdateEntities(entities);
      const afterFirst = await catalog.entities();
      expect(afterFirst.length).toBe(500);

      entities[40].entity.metadata.op = 'changed';
      entities.push({
        entity: {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: `n500`, op: 'added' },
        },
        relations: [],
      });

      await catalog.batchAddOrUpdateEntities(entities);
      const afterSecond = await catalog.entities();
      expect(afterSecond.length).toBe(501);
      expect(afterSecond.find(e => e.metadata.op === 'changed')).toBeDefined();
      expect(afterSecond.find(e => e.metadata.op === 'added')).toBeDefined();
    });
  });
});
