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
import {
  ComponentDescriptor,
  DescriptorParser,
  LocationReader,
  ParserError,
} from '../ingestion';
import { Database } from './Database';
import { DatabaseManager } from './DatabaseManager';
import { DatabaseLocationUpdateLogStatus, DbLocationsRow } from './types';
import Knex from 'knex';

describe('DatabaseManager', () => {
  describe('refreshLocations', () => {
    it('works with no locations added', async () => {
      const db = ({
        locations: jest.fn().mockResolvedValue([]),
      } as unknown) as Database;
      const reader: LocationReader = {
        read: jest.fn(),
      };
      const parser: DescriptorParser = {
        parse: jest.fn(),
      };

      await expect(
        DatabaseManager.refreshLocations(db, reader, parser, getVoidLogger()),
      ).resolves.toBeUndefined();
      expect(reader.read).not.toHaveBeenCalled();
      expect(parser.parse).not.toHaveBeenCalled();
    });

    it('can update a single location', async () => {
      const location: DbLocationsRow = {
        id: '123',
        type: 'some',
        target: 'thing',
      };
      const desc: ComponentDescriptor = {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: { name: 'c1' },
        spec: { type: 'service' },
      };
      const tx = (undefined as unknown) as Knex.Transaction<any, any>;

      const db = ({
        transaction: jest.fn(f => f(tx)),
        entity: jest.fn(() => Promise.resolve(undefined)),
        addEntity: jest.fn(),
        locations: jest.fn(() => Promise.resolve([location])),
        addLocationUpdateLogEvent: jest.fn(),
      } as Partial<Database>) as Database;

      const reader: LocationReader = {
        read: jest.fn(() => Promise.resolve([{ type: 'data', data: desc }])),
      };
      const parser: DescriptorParser = {
        parse: jest.fn(() => Promise.resolve(desc)),
      };

      await expect(
        DatabaseManager.refreshLocations(db, reader, parser, getVoidLogger()),
      ).resolves.toBeUndefined();
      expect(reader.read).toHaveBeenCalledTimes(1);
      expect(reader.read).toHaveBeenNthCalledWith(1, 'some', 'thing');
      expect(db.addEntity).toHaveBeenCalledTimes(1);
      expect(db.addEntity).toHaveBeenNthCalledWith(1, undefined, {
        locationId: '123',
        entity: expect.objectContaining({
          metadata: expect.objectContaining({ name: 'c1' }),
        }),
      });
    });

    it('logs successful updates', async () => {
      const tx = (undefined as unknown) as Knex.Transaction<any, any>;

      const db = ({
        transaction: jest.fn(f => f(tx)),
        addEntity: jest.fn(),
        entity: jest.fn(() => Promise.resolve(undefined)),
        locations: jest.fn(() =>
          Promise.resolve([
            {
              id: '123',
              type: 'some',
              target: 'thing',
            } as DbLocationsRow,
          ]),
        ),
        addLocationUpdateLogEvent: jest.fn(),
      } as unknown) as Database;

      const desc: ComponentDescriptor = {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: { name: 'c1' },
        spec: { type: 'service' },
      };
      const reader: LocationReader = {
        read: jest.fn(() => Promise.resolve([{ type: 'data', data: desc }])),
      };
      const parser: DescriptorParser = {
        parse: jest.fn(() => Promise.resolve(desc)),
      };

      await expect(
        DatabaseManager.refreshLocations(db, reader, parser, getVoidLogger()),
      ).resolves.toBeUndefined();

      expect(db.addLocationUpdateLogEvent).toHaveBeenNthCalledWith(
        1,
        '123',
        DatabaseLocationUpdateLogStatus.SUCCESS,
        'c1',
      );

      expect(db.addLocationUpdateLogEvent).toHaveBeenNthCalledWith(
        2,
        '123',
        DatabaseLocationUpdateLogStatus.SUCCESS,
        undefined,
      );
    });

    it('logs unsuccessful updates when parser fails', async () => {
      const tx = (undefined as unknown) as Knex.Transaction<any, any>;

      const db = ({
        transaction: jest.fn(f => f(tx)),
        addEntity: jest.fn(),
        locations: jest.fn(() =>
          Promise.resolve([
            {
              id: '123',
              type: 'some',
              target: 'thing',
            } as DbLocationsRow,
          ]),
        ),
        addLocationUpdateLogEvent: jest.fn(),
      } as unknown) as Database;

      const desc: ComponentDescriptor = {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: { name: 'c1' },
        spec: { type: 'service' },
      };
      const reader: LocationReader = {
        read: jest.fn(() => Promise.resolve([{ type: 'data', data: desc }])),
      };
      const parser: DescriptorParser = {
        parse: jest.fn(() =>
          Promise.reject(new ParserError('parser error message', 'c1')),
        ),
      };

      await expect(
        DatabaseManager.refreshLocations(db, reader, parser, getVoidLogger()),
      ).resolves.toBeUndefined();

      expect(db.addLocationUpdateLogEvent).toHaveBeenNthCalledWith(
        1,
        '123',
        DatabaseLocationUpdateLogStatus.FAIL,
        'c1',
        'parser error message',
      );

      expect(db.addLocationUpdateLogEvent).toHaveBeenNthCalledWith(
        2,
        '123',
        DatabaseLocationUpdateLogStatus.SUCCESS,
        undefined,
      );
    });

    it('logs unsuccessful updates when reader fails', async () => {
      const tx = (undefined as unknown) as Knex.Transaction<any, any>;

      const db = ({
        transaction: jest.fn(f => f(tx)),
        addEntity: jest.fn(),
        locations: jest.fn(() =>
          Promise.resolve([
            {
              id: '123',
              type: 'some',
              target: 'thing',
            } as DbLocationsRow,
          ]),
        ),
        addLocationUpdateLogEvent: jest.fn(),
      } as unknown) as Database;

      const reader: LocationReader = {
        read: jest.fn(() =>
          Promise.reject([{ type: 'error', error: new Error('test message') }]),
        ),
      };
      const parser: DescriptorParser = {
        parse: jest.fn(() =>
          Promise.reject(new ParserError('parser error message', 'c1')),
        ),
      };

      await expect(
        DatabaseManager.refreshLocations(db, reader, parser, getVoidLogger()),
      ).resolves.toBeUndefined();

      expect(db.addLocationUpdateLogEvent).toHaveBeenNthCalledWith(
        1,
        '123',
        DatabaseLocationUpdateLogStatus.FAIL,
        undefined,
        undefined,
      );
    });
  });
});
