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

import passport from 'passport';
import express from 'express';
import { makeProvider, defaultRouter } from '.';
import {
  AuthProvider,
  AuthProviderRouteHandlers,
  AuthProviderConfig,
} from './types';
import { ProviderFactories } from './factories';

class MyAuthProvider implements AuthProvider, AuthProviderRouteHandlers {
  private readonly providerConfig: AuthProviderConfig;
  constructor(providerConfig: AuthProviderConfig) {
    this.providerConfig = providerConfig;
  }

  strategy(): passport.Strategy {
    return new passport.Strategy();
  }
  start(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<any> {
    return new Promise(resolve => {
      res.send('start');
      resolve();
    });
  }
  frameHandler(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<any> {
    return new Promise(resolve => {
      res.send('frameHandler');
      resolve();
    });
  }
  logout(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<any> {
    return new Promise(resolve => {
      res.send('logout');
      resolve();
    });
  }
}

class MyAuthProviderWithRefresh extends MyAuthProvider {
  refresh(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<any> {
    return new Promise(resolve => {
      res.send('logout');
      resolve();
    });
  }
}

const providerConfig = {
  provider: 'a',
  options: {
    somekey: 'somevalue',
  },
};

const providerConfigInvalid = {
  provider: 'b',
  options: {
    somekey: 'somevalue',
  },
};

describe('makeProvider', () => {
  it('makes a provider for Myauthprovider', () => {
    jest
      .spyOn(ProviderFactories, 'getProviderFactory')
      .mockReturnValueOnce(MyAuthProvider);
    const provider = makeProvider(providerConfig);
    expect(provider.providerId).toEqual('a');
    expect(provider.strategy).toBeDefined();
    expect(provider.providerRouter).toBeDefined();
  });

  it('throws an error when provider implementation does not exist', () => {
    expect(() => {
      makeProvider(providerConfigInvalid);
    }).toThrow('Provider Implementation missing for : b auth provider');
  });
});

describe('defaultRouter', () => {
  it('make router for auth provider without refresh', () => {
    expect(
      defaultRouter(new MyAuthProvider({ provider: 'a', options: {} })),
    ).toBeDefined();
  });

  it('make router for auth provider with refresh', () => {
    expect(
      defaultRouter(
        new MyAuthProviderWithRefresh({ provider: 'b', options: {} }),
      ),
    ).toBeDefined();
  });
});
