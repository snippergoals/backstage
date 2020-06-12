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

import fs from 'fs-extra';
import { resolve as resolvePath, dirname } from 'path';
import { AppConfig } from '@backstage/config';
import { findRootPath, readConfigFile, readEnv } from './lib';

export type LoadConfigOptions = {
  // Config path, defaults to app-config.yaml in project root
  configPath?: string;

  // Whether to read secrets or omit them, defaults to false.
  shouldReadSecrets?: boolean;
};

export async function loadStaticConfig(
  options: LoadConfigOptions,
): Promise<AppConfig[]> {
  const { shouldReadSecrets = false } = options;

  // TODO: We'll want this to be a bit more elaborate, probably adding configs for
  //       specific env, and maybe local config for plugins.
  let { configPath } = options;
  if (!configPath) {
    configPath = resolvePath(
      findRootPath(fs.realpathSync(process.cwd())),
      'app-config.yaml',
    );
  }

  try {
    const rootPath = dirname(configPath);
    const config = await readConfigFile(configPath, {
      env: process.env,
      shouldReadSecrets,
      readFile: (path: string) => {
        return fs.readFile(resolvePath(rootPath, path), 'utf8');
      },
    });
    return [config];
  } catch (error) {
    throw new Error(
      `Failed to read static configuration file: ${error.message}`,
    );
  }
}

export async function loadConfig(
  options: LoadConfigOptions = {},
): Promise<AppConfig[]> {
  const configs = [];

  configs.push(...readEnv(process.env));
  configs.push(...(await loadStaticConfig(options)));

  return configs;
}
