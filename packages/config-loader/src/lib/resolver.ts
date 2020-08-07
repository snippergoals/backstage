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

import { resolve as resolvePath } from 'path';
import { pathExists } from 'fs-extra';

type ResolveOptions = {
  // Root paths to search for config files. Config from earlier paths has higher priority.
  rootPaths: string[];
};

/**
 * Resolves all configuration files that should be loaded in the given environment.
 */
export async function resolveStaticConfig(
  options: ResolveOptions,
): Promise<string[]> {
  // TODO: We'll want this to be a bit more elaborate, probably adding configs for
  //       specific env, and maybe local config for plugins.
  const resolvedPaths = [];

  for (const rootPath of options.rootPaths) {
    const path = resolvePath(rootPath, 'app-config.yaml');
    if (await pathExists(path)) {
      resolvedPaths.push(path);
    }
  }

  return resolvedPaths;
}
