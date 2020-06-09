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

import GithubIcon from '@material-ui/icons/AcUnit';
import { DefaultAuthConnector } from '../../../../lib/AuthConnector';
import { GithubSession } from './types';
import { OAuthApi, AccessTokenOptions } from '../../../definitions/auth';
import { OAuthRequestApi, AuthProvider } from '../../../definitions';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import { StaticAuthSessionManager } from '../../../../lib/AuthSessionManager';
import { BehaviorSubject } from '../../../../lib';
import { Observable } from '../../../../types';

type CreateOptions = {
  // TODO(Rugvip): These two should be grabbed from global config when available, they're not unique to GithubAuth
  apiOrigin: string;
  basePath: string;

  oauthRequestApi: OAuthRequestApi;

  environment?: string;
  provider?: AuthProvider & { id: string };
};

export type GithubAuthResponse = {
  accessToken: string;
  idToken: string;
  scope: string;
  expiresInSeconds: number;
};

const DEFAULT_PROVIDER = {
  id: 'github',
  title: 'Github',
  icon: GithubIcon,
};

class GithubAuth implements OAuthApi {
  static create({
    apiOrigin,
    basePath,
    environment = 'dev',
    provider = DEFAULT_PROVIDER,
    oauthRequestApi,
  }: CreateOptions) {
    const connector = new DefaultAuthConnector({
      apiOrigin,
      basePath,
      environment,
      provider,
      oauthRequestApi: oauthRequestApi,
      sessionTransform(res: GithubAuthResponse): GithubSession {
        return {
          accessToken: res.accessToken,
          scopes: GithubAuth.normalizeScope(res.scope),
          expiresAt: new Date(Date.now() + res.expiresInSeconds * 1000),
        };
      },
    });

    const sessionManager = new StaticAuthSessionManager({
      connector,
      defaultScopes: new Set(['user']),
      sessionScopes: session => session.scopes,
    });

    return new GithubAuth(sessionManager);
  }

  constructor(private readonly sessionManager: SessionManager<GithubSession>) {}

  private session: GithubSession | undefined;
  private readonly subject = new BehaviorSubject<GithubSession | undefined>(
    undefined,
  );

  session$(): Observable<GithubSession | undefined> {
    return this.subject;
  }

  getSession(): GithubSession | undefined {
    return this.session;
  }

  setSession(session?: GithubSession): void {
    this.session = session;
    this.subject.next(session);
  }

  async getAccessToken(scope?: string, options?: AccessTokenOptions) {
    const normalizedScopes = GithubAuth.normalizeScope(scope);
    const session = await this.sessionManager.getSession({
      ...options,
      scopes: normalizedScopes,
    });
    this.setSession(session);
    if (session) {
      return session.accessToken;
    }
    return '';
  }

  async logout() {
    await this.sessionManager.removeSession();
    this.setSession();
  }

  static normalizeScope(scope?: string): Set<string> {
    if (!scope) {
      return new Set();
    }

    const scopeList = Array.isArray(scope)
      ? scope
      : scope.split(/[\s|,]/).filter(Boolean);

    return new Set(scopeList);
  }
}
export default GithubAuth;
