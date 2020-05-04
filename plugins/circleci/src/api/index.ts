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

import { CircleCI, GitType, CircleCIOptions } from 'circleci-api';
import { ApiRef } from '@backstage/core';

const defaultOptions: Partial<CircleCIOptions> = {
  circleHost: 'http://backstage.localhost:7000/circleci/api',
  vcs: {
    type: GitType.GITHUB,
    owner: 'CircleCITest3',
    repo: 'circleci-test',
  },
};
export const circleCIApiRef = new ApiRef<CircleCIApi>({
  id: 'plugin.circleci.service',
  description: 'Used by the CircleCI plugin to make requests',
});

export class CircleCIApi {
  private token: string = '';
  options: Partial<CircleCIOptions>;

  authed: boolean = false;
  constructor(options?: Partial<CircleCIOptions>) {
    this.options = Object.assign(Object.create(null), defaultOptions, options);
  }

  setToken(token: string) {
    this.token = token;
    this.persistToken();
  }

  setVCSOptions(vcs: CircleCIOptions['vcs']) {
    this.options.vcs = vcs;
    this.persistVCSOptions();
  }

  async persistVCSOptions() {
    const key = circleCIApiRef.id;
    sessionStorage.setItem(key + '_options', JSON.stringify(this.options.vcs));
  }

  async restorePersistedSettings() {
    if (this.authed) return Promise.resolve();
    const key = circleCIApiRef.id;
    const persistedToken = sessionStorage.getItem(key);
    let persistedVCSOptions: {} | undefined;
    try {
      persistedVCSOptions = JSON.parse(
        sessionStorage.getItem(key + '_options') as string,
      );
    } catch (e) {}
    if (persistedToken && persistedVCSOptions) {
      this.token = persistedToken;
      this.options.vcs = persistedVCSOptions;
      return Promise.resolve();
    }
    return Promise.reject();
  }

  async persistToken() {
    if (this.authed) return;
    const key = circleCIApiRef.id;
    sessionStorage.setItem(key, this.token);
  }

  async validateToken() {
    if (!this.token || this.token === '') {
      return Promise.reject('Wrong token');
    }

    // TODO: switch towards using personal token
    await this.api.builds();
    this.authed = true;
    return Promise.resolve();
  }

  private get api() {
    return new CircleCI({ ...this.options, token: this.token });
  }

  async retry(buildId: string) {
    return this.api.retry(Number(buildId));
  }

  async getBuilds() {
    return this.api.builds();
  }

  async getUser() {
    return this.api.me();
  }
}
