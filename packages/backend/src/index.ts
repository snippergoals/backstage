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

/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import {
  errorHandler,
  getRootLogger,
  notFoundHandler,
  requestLoggingHandler,
} from '@backstage/backend-common';
import {
  AggregatorInventory,
  createRouter as inventoryRouter,
  StaticInventory,
} from '@backstage/plugin-inventory-backend';
import {
  createRouter as scaffolderRouter,
  DiskStorage,
  CookieCutter,
} from '@backstage/plugin-scaffolder-backend';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

const DEFAULT_PORT = 7000;
const PORT = parseInt(process.env.PORT ?? '', 10) || DEFAULT_PORT;
const logger = getRootLogger().child({ type: 'plugin' });

async function main() {
  const inventory = new AggregatorInventory();
  inventory.enlist(
    new StaticInventory([
      { id: 'component1' },
      { id: 'component2' },
      { id: 'component3' },
      { id: 'component4' },
    ]),
  );

  const storage = new DiskStorage({ logger });
  const templater = new CookieCutter();

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(requestLoggingHandler());
  app.use('/inventory', await inventoryRouter({ inventory, logger }));
  app.use('/scaffolder', await scaffolderRouter({ storage, templater, logger }));
  app.use(notFoundHandler());
  app.use(errorHandler());

  app.listen(PORT, () => {
    getRootLogger().info(`Listening on port ${PORT}`);
  });
}

main();
