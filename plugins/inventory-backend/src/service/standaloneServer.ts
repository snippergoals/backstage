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

import { Server } from 'http';
import { Logger } from 'winston';
import { AggregatorInventory, StaticInventory } from '../inventory';
import { createStandaloneApplication } from './standaloneApplication';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'inventory-backend' });

  const inventory = new AggregatorInventory();
  inventory.enlist(
    new StaticInventory([
      { id: 'component1' },
      { id: 'component2' },
      { id: 'component3' },
      { id: 'component4' },
    ]),
  );

  logger.debug('Creating application...');
  const app = await createStandaloneApplication({
    enableCors: options.enableCors,
    inventory,
    logger,
  });

  logger.debug('Starting application server...');
  return await new Promise((resolve, reject) => {
    const server = app.listen(options.port, (err?: Error) => {
      if (err) {
        reject(err);
        return;
      }

      logger.info(`Listening on port ${options.port}`);
      resolve(server);
    });
  });
}
