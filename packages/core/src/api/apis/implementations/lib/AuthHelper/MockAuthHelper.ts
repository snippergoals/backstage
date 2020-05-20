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

import { GenericAuthHelper } from './types';

export const mockAccessToken = 'mock-access-token';

type MockSession = {
  accessToken: string;
  expiresAt: Date;
  scopes: string;
};

const defaultMockSession: MockSession = {
  accessToken: mockAccessToken,
  expiresAt: new Date(),
  scopes: 'profile email',
};

export default class MockAuthHelper implements GenericAuthHelper<MockSession> {
  constructor(private readonly mockSession: MockSession = defaultMockSession) {}

  async refreshSession() {
    return this.mockSession;
  }

  async removeSession() {}

  async createSession() {
    return this.mockSession;
  }
}
