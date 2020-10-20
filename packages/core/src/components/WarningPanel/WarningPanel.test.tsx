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

import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';

import { WarningPanel } from './WarningPanel';

const minProps = { title: 'Mock title', message: 'Some more info' };

describe('<WarningPanel />', () => {
  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(<WarningPanel {...minProps} />);
    expect(getByText('Mock title')).toBeInTheDocument();
  });

  it('renders message and children', async () => {
    const { getByText } = await renderInTestApp(
      <WarningPanel {...minProps}>children</WarningPanel>,
    );
    expect(getByText('Some more info')).toBeInTheDocument();
    expect(getByText('children')).toBeInTheDocument();
  });
});
