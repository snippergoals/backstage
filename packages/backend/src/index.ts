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
import { router as inventoryRouter } from '@backstage/plugin-inventory-backend';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { testRouter } from './test';
import { createScaffolder } from '@backstage/plugin-scaffolder-backend';

const DEFAULT_PORT = 7000;

const PORT = parseInt(process.env.PORT ?? '', 10) || DEFAULT_PORT;
const app = express();

const scaffolder = createScaffolder();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(requestLoggingHandler());
app.use('/test', testRouter);
app.use('/inventory', inventoryRouter);
app.use('/scaffolder', scaffolder);
app.use(errorHandler());
app.use(notFoundHandler());

app.listen(PORT, () => {
  getRootLogger().info(`Listening on port ${PORT}`);
});
