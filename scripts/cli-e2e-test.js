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

const { resolve: resolvePath } = require('path');
const Browser = require('zombie');

const {
  spawnPiped,
  handleError,
  waitForPageWithText,
  waitForExit,
  print,
} = require('./helpers');

const createTestApp = require('./createTestApp');
const createTestPlugin = require('./createTestPlugin');
const generateTempDir = require('./generateTempDir.js');

Browser.localhost('localhost', 3000);

async function main() {
  process.env.E2E = 'true';

  const rootDir = process.env.CI
    ? resolvePath(process.env.GITHUB_WORKSPACE)
    : resolvePath(__dirname, '..');

  const tempDir = process.env.CI
    ? resolvePath(__dirname)
    : await generateTempDir();

  process.chdir(tempDir);
  await waitForExit(spawnPiped(['yarn', 'init --yes']));

  const createAppCmd = `${rootDir}/packages/cli/bin/backstage-cli create-app`;
  await createTestApp(createAppCmd);

  const appDir = resolvePath(tempDir, 'test-app');
  process.chdir(appDir);

  await createTestPlugin();

  print('Starting the app');
  const startApp = spawnPiped(['yarn', 'start']);

  try {
    const browser = new Browser();

    await waitForPageWithText(browser, '/', 'Welcome to Backstage');
    await waitForPageWithText(
      browser,
      '/test-plugin',
      'Welcome to test-plugin!',
    );

    print('Both App and Plugin loaded correctly');
  } finally {
    startApp.kill();
  }

  await waitForExit(startApp);

  print('All tests done');
  process.exit(0);
}

process.on('unhandledRejection', handleError);
main(process.argv.slice(2)).catch(handleError);
