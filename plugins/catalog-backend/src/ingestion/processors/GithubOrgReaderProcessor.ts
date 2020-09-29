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

import { LocationSpec } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { graphql } from '@octokit/graphql';
import * as results from './results';
import { LocationProcessor, LocationProcessorEmit } from './types';
import { getOrganizationTeams, getOrganizationUsers } from './util/github';
import { buildOrgHierarchy } from './util/org';

/**
 * Extracts teams and users out of a GitHub org.
 */
export class GithubOrgReaderProcessor implements LocationProcessor {
  static fromConfig(config: Config) {
    return new GithubOrgReaderProcessor(readConfig(config));
  }

  constructor(private readonly providers: ProviderConfig[]) {}

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'github-org') {
      return false;
    }

    const provider = this.providers.find(p =>
      location.target.startsWith(`${p.target}/`),
    );
    if (!provider) {
      throw new Error(
        `There is no GitHub Org provider that matches ${location.target}. Please add a configuration entry for it under catalog.processors.githubOrg.providers.`,
      );
    }

    const { org } = parseUrl(location.target);
    const client = !provider.token
      ? graphql
      : graphql.defaults({
          headers: {
            authorization: `token ${provider.token}`,
          },
        });

    const { users } = await getOrganizationUsers(client, org);
    const { groups, groupMemberUsers } = await getOrganizationTeams(
      client,
      org,
    );
    buildOrgHierarchy(groups, users, groupMemberUsers);

    for (const group of groups) {
      emit(results.entity(location, group));
    }
    for (const user of users) {
      emit(results.entity(location, user));
    }

    return true;
  }
}

/*
 * Helpers
 */

/**
 * The configuration parameters for a single GitHub API provider.
 */
type ProviderConfig = {
  /**
   * The prefix of the target that this matches on, e.g. "https://github.com",
   * with no trailing slash.
   */
  target: string;

  /**
   * The base URL of the API of this provider, e.g. "https://api.github.com",
   * with no trailing slash.
   *
   * May be omitted specifically for GitHub; then it will be deduced.
   */
  apiBaseUrl?: string;

  /**
   * The authorization token to use for requests to this provider.
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;
};

// TODO(freben): Break out common code and config from here and GithubReaderProcessor
export function readConfig(config: Config): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  const providerConfigs =
    config.getOptionalConfigArray('catalog.processors.githubOrg.providers') ??
    [];

  // First read all the explicit providers
  for (const providerConfig of providerConfigs) {
    const target = providerConfig.getString('target').replace(/\/+$/, '');
    let apiBaseUrl = providerConfig.getOptionalString('apiBaseUrl');
    const token = providerConfig.getOptionalString('token');

    if (apiBaseUrl) {
      apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
    } else if (target === 'https://github.com') {
      apiBaseUrl = 'https://api.github.com';
    }

    if (!apiBaseUrl) {
      throw new Error(
        `Provider at ${target} must configure an explicit apiBaseUrl`,
      );
    }

    providers.push({ target, apiBaseUrl, token });
  }

  // If no explicit github.com provider was added, put one in the list as
  // a convenience
  if (!providers.some(p => p.target === 'https://github.com')) {
    providers.push({
      target: 'https://github.com',
      apiBaseUrl: 'https://api.github.com',
    });
  }

  return providers;
}

export function parseUrl(urlString: string): { org: string } {
  const path = new URL(urlString).pathname.substr(1).split('/');

  // /spotify
  if (path.length === 1) {
    return { org: path[0] };
  }

  // /orgs/spotify[/<teams or people>]
  if (
    path.length >= 2 &&
    path.length <= 3 &&
    path[0] === 'orgs' &&
    [undefined, 'teams', 'people'].includes(path[2])
  ) {
    return { org: path[1] };
  }

  throw new Error(`Expected a URL pointing to /<org> or /orgs/<org>`);
}
