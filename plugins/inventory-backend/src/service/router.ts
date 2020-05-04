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

import express from 'express';
import { Logger } from 'winston';
import Router from 'express-promise-router';
import { Inventory } from '../inventory';

export interface RouterOptions {
  inventory: Inventory;
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const inventory = options.inventory;
  const logger = options.logger.child({ plugin: 'inventory' });

  const router = Router();
  router
    .get('/', async (req, res) => {
      const components = await inventory.list();
      res.status(200).send(components);
    })
    .get('/:id', async (req, res) => {
      const { id } = req.params;
      const component = await inventory.item(id);
      res.status(200).send(component);
    });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}
