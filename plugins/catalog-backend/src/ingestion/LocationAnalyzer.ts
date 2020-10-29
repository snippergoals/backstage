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

import { Logger } from 'winston';
import {
  AnalyzeLocationRequest,
  AnalyzeLocationResponse,
  LocationAnalyzer,
} from './types';

export class LocationAnalyzerClient implements LocationAnalyzer {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }
  async generateConfig(
    request: AnalyzeLocationRequest,
  ): Promise<AnalyzeLocationResponse> {
    const [ownerName, repoName] = request.location.target.split('/').slice(-2);
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: repoName,
        annotations: { 'github.com/project-slug': `${ownerName}/${repoName}` },
      },
      spec: { type: 'service', owner: ownerName, lifecycle: 'experimental' },
    };

    this.logger.silly(`entity created for ${request.location.target}`);
    return {
      existingEntityFiles: [],
      generateEntities: [{ entity, fields: [] }],
    };
  }
}
