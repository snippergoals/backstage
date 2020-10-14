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

import {
  createApiFactory,
  createPlugin,
  createRouteRef,
  discoveryApiRef,
} from '@backstage/core';
import { NewRelicApi, newRelicApiRef } from './api';
import NewRelicComponent from './components/NewRelicComponent';

export const rootRouteRef = createRouteRef({
  path: '/newrelic',
  title: 'newrelic',
});

export const plugin = createPlugin({
  id: 'newrelic',
  apis: [
    createApiFactory({
      api: newRelicApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new NewRelicApi({ discoveryApi }),
    }),
  ],
  register({ router }) {
    router.addRoute(rootRouteRef, NewRelicComponent);
  },
});
