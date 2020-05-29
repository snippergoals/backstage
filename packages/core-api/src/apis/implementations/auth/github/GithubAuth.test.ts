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

import GithubAuth from './GithubAuth';

const theFuture = new Date(Date.now() + 3600000);

describe('GithubAuth', () => {
  it('should get refreshed access token', async () => {
    const getSession = jest
      .fn()
      .mockResolvedValue({ accessToken: 'access-token', expiresAt: theFuture });
    const githubAuth = new GithubAuth({ getSession } as any);

    expect(await githubAuth.getAccessToken()).toBe('access-token');
    expect(getSession).toBeCalledTimes(1);
  });
});
