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
  ApiProvider,
  ApiRegistry,
  configApiRef,
  ConfigReader,
  googleAuthApiRef,
} from '@backstage/core';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import * as React from 'react';
import { ConfiguredProviderSettings } from './ConfiguredProviderSettings';

const mockSignInHandler = jest.fn().mockReturnValue('');
const mockGoogleAuth = {
  sessionState$: () => ({
    subscribe: () => ({
      unsubscribe: () => null,
    }),
  }),
  getIdToken: mockSignInHandler,
};

const createConfig = () =>
  ConfigReader.fromConfigs([
    {
      context: '',
      data: {
        auth: {
          providers: {
            google: { development: {} },
          },
        },
      },
    },
  ]);

const config = createConfig();

const apiRegistry = ApiRegistry.from([
  [configApiRef, config],
  [googleAuthApiRef, mockGoogleAuth],
]);

describe('<ConfiguredProviderSettings />', () => {
  it('displays a provider and calls its sign-in handler on click', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <ConfiguredProviderSettings />
        </ApiProvider>,
      ),
    );

    expect(rendered.getByText('Google')).toBeInTheDocument();
    expect(
      rendered.getByText(googleAuthApiRef.description),
    ).toBeInTheDocument();

    const button = rendered.getByTitle('Sign in to Google');
    expect(mockSignInHandler).toHaveBeenCalledTimes(1);
    fireEvent.click(button);
    expect(mockSignInHandler).toHaveBeenCalledTimes(2);
  });
});
