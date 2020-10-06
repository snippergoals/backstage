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

import knex from 'knex';

/**
 * The PluginDatabaseManager manages access to databases that Plugins get.
 */
export interface PluginDatabaseManager {
  /**
   * getClient provides backend plugins database connections for itself.
   *
   * The purpose of this method is to allow plugins to get isolated data
   * stores so that plugins are discouraged from database integration.
   *
   * @param database This parameter can be omitted to get the default plugin
   * database, or provide an identifier that will be used to identify a
   * separate database from the default to connect to. This can be used for
   * application-level sharding.
   */
  getClient(database?: string): Promise<knex>;
}
