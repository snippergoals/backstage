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

import { Duration, inclusiveEndDateOf, inclusiveStartDateOf } from './Duration';

Date.now = jest.fn(() => new Date(Date.parse('2020-06-05')).valueOf());

describe.each`
  duration         | startDate       | endDate
  ${Duration.P30D} | ${'2020-04-06'} | ${'2020-06-05'}
  ${Duration.P90D} | ${'2019-12-08'} | ${'2020-06-05'}
  ${Duration.P1M}  | ${'2020-04-01'} | ${'2020-05-31'}
  ${Duration.P3M}  | ${'2019-10-01'} | ${'2020-03-31'}
`('Calculates interval dates correctly', ({ duration, startDate, endDate }) => {
  it(`Calculates dates correctly for ${duration}`, () => {
    expect(inclusiveStartDateOf(duration)).toBe(startDate);
    expect(inclusiveEndDateOf(duration)).toBe(endDate);
  });
});
