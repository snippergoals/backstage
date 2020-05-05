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

import globby from 'globby';
import fs from 'fs-extra';
import { Template, StorageBase as Base } from '.';
import { Logger } from 'winston';

interface DiskIndexEntry {
  contents: Template;
  location: string;
}

export class DiskStorage implements Base {
  private repository: Template[] = [];
  private localIndex: DiskIndexEntry[] = [];

  private repoDir: string;
  private logger?: Logger;
  constructor({
    directory = `${__dirname}/../../../sample-templates`,
    logger,
  }: {
    directory?: string;
    logger?: Logger;
  }) {
    this.repoDir = directory;
    this.logger = logger;
  }

  public async list(): Promise<Template[]> {
    if (this.repository.length === 0) {
      await this.reindex();
    }

    return this.repository;
  }

  public async reindex(): Promise<void> {
    this.localIndex = await this.index();
    this.repository = this.localIndex.map(({ contents }) => contents);
  }

  public async prepare(templateId: string): Promise<string> {
    const template = this.localIndex.find(
      ({ contents }) => contents.id === templateId,
    );

    if (!template) {
      throw new Error('Template no found');
    }

    const tempDir = await fs.promises.mkdtemp(templateId);
    await fs.copy(template.location, tempDir);
    return tempDir;
  }

  private async index(): Promise<DiskIndexEntry[]> {
    const matches = await globby(`${this.repoDir}/**/template-info.json`);

    const fileContents: Array<{
      location: string;
      contents: string;
    }> = await Promise.all(
      matches.map(async (location: string) => ({
        location,
        contents: await fs.readFile(location, 'utf-8'),
      })),
    );

    const validFiles: DiskIndexEntry[] = [];

    for (const file of fileContents) {
      try {
        const contents: Template = JSON.parse(file.contents);
        validFiles.push({ location: file.location, contents });
      } catch (ex) {
        this.logger?.error('Failure parsing JSON for template', {
          path: file.location,
        });
      }
    }

    return validFiles;
  }
}
