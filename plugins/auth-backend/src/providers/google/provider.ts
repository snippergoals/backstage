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
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {
  AuthProvider,
  AuthProviderRouteHandlers,
  AuthProviderConfig,
} from './../types';
import { postMessageResponse } from './../utils';
import { InputError } from '@backstage/backend-common';

export class GoogleAuthProvider
  implements AuthProvider, AuthProviderRouteHandlers {
  private readonly providerConfig: AuthProviderConfig;
  constructor(providerConfig: AuthProviderConfig) {
    this.providerConfig = providerConfig;
  }

  start(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const scope = req.query.scope?.toString() ?? '';
    if (!scope) {
      throw new InputError('missing scope parameter');
    }
    return passport.authenticate('google', {
      scope,
      accessType: 'offline',
      prompt: 'consent',
    })(req, res, next);
  }

  frameHandler(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    return passport.authenticate('google', (_, user) => {
      postMessageResponse(res, {
        type: 'auth-result',
        payload: user,
      });
    })(req, res, next);
  }

  logout(_req: express.Request, res: express.Response) {
    return new Promise((resolve) => {
      res.send('logout!');
      resolve();
    });
  }

  strategy(): passport.Strategy {
    return new GoogleStrategy(
      { ...this.providerConfig.options },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        profile: any,
        cb: any,
      ) => {
        cb(undefined, {
          profile,
          idToken: params.id_token,
          accessToken,
          refreshToken,
        });
      },
    );
  }
}
