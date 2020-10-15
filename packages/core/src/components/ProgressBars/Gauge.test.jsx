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
import { render } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
<<<<<<< HEAD:packages/core/src/components/ProgressBars/Gauge.test.jsx
import { Gauge, getProgressColor } from './Gauge';
=======
import { GaugeProgress, getProgressColor } from './GaugeProgress';
import * as theme from '@backstage/theme';
>>>>>>> change test file to tsx:packages/core/src/components/ProgressBars/GaugeProgress.test.tsx

describe('<Gauge />', () => {
  it('renders without exploding', () => {
    const { getByText } = render(
      wrapInTestApp(<Gauge value={10} fractional={false} />),
    );
    getByText('10%');
  });
  it('handles fractional prop', () => {
    const { getByText } = render(
      wrapInTestApp(<Gauge value={0.1} fractional />),
    );
    getByText('10%');
  });

  it('handles max prop', () => {
    const { getByText } = render(
      wrapInTestApp(<Gauge value={1} max={10} fractional={false} />),
    );
    getByText('1%');
  });

  it('handles unit prop', () => {
    const { getByText } = render(
      wrapInTestApp(<Gauge value={10} fractional={false} unit="m" />),
    );
    getByText('10m');
  });

  const ok = '#111';
  const warning = '#222';
  const error = '#333';
  const palette = {
    ...theme.lightTheme.palette,
    status: { ...theme.lightTheme.palette.status, ok, warning, error },
  };

  it('colors the progress correctly', () => {
    expect(getProgressColor(palette, 'Not a Number')).toBe('#ddd');
    expect(getProgressColor(palette, 10)).toBe(error);
    expect(getProgressColor(palette, 50)).toBe(warning);
    expect(getProgressColor(palette, 90)).toBe(ok);
  });

  it('colors the inverse progress correctly', () => {
    expect(getProgressColor(palette, 'Not a Number')).toBe('#ddd');
    expect(getProgressColor(palette, 10, true)).toBe(ok);
    expect(getProgressColor(palette, 50, true)).toBe(warning);
    expect(getProgressColor(palette, 90, true)).toBe(error);
  });
});
