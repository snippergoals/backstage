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
  ApiRegistry,
  alertApiRef,
  errorApiRef,
  AlertApiForwarder,
  ConfigApi,
  ErrorApiForwarder,
  ErrorAlerter,
  featureFlagsApiRef,
  FeatureFlags,
  GoogleAuth,
  GithubAuth,
  OAuth2,
  OktaAuth,
  GitlabAuth,
  Auth0Auth,
  oauthRequestApiRef,
  OAuthRequestManager,
  googleAuthApiRef,
  githubAuthApiRef,
  oauth2ApiRef,
  oktaAuthApiRef,
  gitlabAuthApiRef,
  auth0AuthApiRef,
  storageApiRef,
  WebStorage,
} from '@backstage/core';

import {
  lighthouseApiRef,
  LighthouseRestApi,
} from '@backstage/plugin-lighthouse';

import { techRadarApiRef, TechRadar } from '@backstage/plugin-tech-radar';

import { CircleCIApi, circleCIApiRef } from '@backstage/plugin-circleci';
import { catalogApiRef, CatalogClient } from '@backstage/plugin-catalog';

import { gitOpsApiRef, GitOpsRestApi } from '@backstage/plugin-gitops-profiles';
import {
  graphQlBrowseApiRef,
  GraphQLEndpoints,
} from '@backstage/plugin-graphiql';
import { scaffolderApiRef, ScaffolderApi } from '@backstage/plugin-scaffolder';
import {
  techdocsStorageApiRef,
  TechDocsStorageApi,
} from '@backstage/plugin-techdocs';

import { rollbarApiRef, RollbarClient } from '@backstage/plugin-rollbar';
import {
  GithubActionsClient,
  githubActionsApiRef,
} from '@backstage/plugin-github-actions';
import { jenkinsApiRef, JenkinsApi } from '@backstage/plugin-jenkins';

import {
  TravisCIApi,
  travisCIApiRef,
} from '@roadiehq/backstage-plugin-travis-ci';
import { GithubPullRequestsClient, githubPullRequestsApiRef } from '@roadiehq/backstage-plugin-github-pull-requests';

export const apis = (config: ConfigApi) => {
  // eslint-disable-next-line no-console
  console.log(`Creating APIs for ${config.getString('app.title')}`);

  const backendUrl = config.getString('backend.baseUrl');
  const techdocsUrl = config.getString('techdocs.storageUrl');

  const builder = ApiRegistry.builder();

  const alertApi = builder.add(alertApiRef, new AlertApiForwarder());
  const errorApi = builder.add(
    errorApiRef,
    new ErrorAlerter(alertApi, new ErrorApiForwarder()),
  );

  builder.add(storageApiRef, WebStorage.create({ errorApi }));
  builder.add(
    circleCIApiRef,
    new CircleCIApi(`${backendUrl}/proxy/circleci/api`),
  );

  builder.add(jenkinsApiRef, new JenkinsApi(`${backendUrl}/proxy/jenkins/api`));

  builder.add(githubActionsApiRef, new GithubActionsClient());

  builder.add(featureFlagsApiRef, new FeatureFlags());

  builder.add(lighthouseApiRef, new LighthouseRestApi('http://localhost:3003'));

  builder.add(travisCIApiRef, new TravisCIApi());
  builder.add(githubPullRequestsApiRef, new GithubPullRequestsClient());

  const oauthRequestApi = builder.add(
    oauthRequestApiRef,
    new OAuthRequestManager(),
  );

  builder.add(
    googleAuthApiRef,
    GoogleAuth.create({
      backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  const githubAuthApi = builder.add(
    githubAuthApiRef,
    GithubAuth.create({
      backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(
    oktaAuthApiRef,
    OktaAuth.create({
      backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(
    gitlabAuthApiRef,
    GitlabAuth.create({
      backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(
    auth0AuthApiRef,
    Auth0Auth.create({
      backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(
    oauth2ApiRef,
    OAuth2.create({
      backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(
    techRadarApiRef,
    new TechRadar({
      width: 1500,
      height: 800,
    }),
  );

  builder.add(
    catalogApiRef,
    new CatalogClient({
      apiOrigin: backendUrl,
      basePath: '/catalog',
    }),
  );

  builder.add(
    scaffolderApiRef,
    new ScaffolderApi({
      apiOrigin: backendUrl,
      basePath: '/scaffolder/v1',
    }),
  );

  builder.add(gitOpsApiRef, new GitOpsRestApi('http://localhost:3008'));

  builder.add(
    graphQlBrowseApiRef,
    GraphQLEndpoints.from([
      GraphQLEndpoints.create({
        id: 'gitlab',
        title: 'GitLab',
        url: 'https://gitlab.com/api/graphql',
      }),
      GraphQLEndpoints.github({
        id: 'github',
        title: 'GitHub',
        errorApi,
        githubAuthApi,
      }),
    ]),
  );

  builder.add(
    rollbarApiRef,
    new RollbarClient({
      apiOrigin: backendUrl,
      basePath: '/rollbar',
    }),
  );

  builder.add(
    techdocsStorageApiRef,
    new TechDocsStorageApi({
      apiOrigin: techdocsUrl,
    }),
  );

  return builder.build();
};
