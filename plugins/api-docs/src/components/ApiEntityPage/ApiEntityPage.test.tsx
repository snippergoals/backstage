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
import { ApiProvider, ApiRegistry, errorApiRef } from '@backstage/core';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog';
import { wrapInTestApp } from '@backstage/test-utils';
import { render, waitFor } from '@testing-library/react';
import * as React from 'react';
import { ApiEntityPage } from './ApiEntityPage';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  const mockNavigate = jest.fn();
  return {
    ...actual,
    useNavigate: jest.fn(() => mockNavigate),
    useParams: jest.fn(),
  };
});

const {
  useParams,
  useNavigate,
}: { useParams: jest.Mock; useNavigate: () => jest.Mock } = jest.requireMock(
  'react-router-dom',
);

const errorApi = { post: () => {} };

describe('ApiEntityPage', () => {
  it('should redirect to catalog page when name is not provided', async () => {
    useParams.mockReturnValue({
      kind: 'Component',
      optionalNamespaceAndName: '',
    });

    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [errorApiRef, errorApi],
            [
              catalogApiRef,
              ({
                async getEntityByName() {},
              } as Partial<CatalogApi>) as CatalogApi,
            ],
          ])}
        >
          <ApiEntityPage />
        </ApiProvider>,
      ),
    );

    await waitFor(() =>
      expect(useNavigate()).toHaveBeenCalledWith('/api-docs'),
    );
  });
});
