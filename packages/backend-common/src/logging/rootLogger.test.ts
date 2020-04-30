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

import { PassThrough } from 'stream';
import winston from 'winston';
import { getRootLogger, setRootLogger } from './rootLogger';

describe('rootLogger', () => {
  it('can replace the default logger', () => {
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Stream({ stream: new PassThrough() }),
      ],
    });
    jest.spyOn(logger, 'info');

    setRootLogger(logger);
    getRootLogger().info('testing');

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('testing'),
    );
  });
});
