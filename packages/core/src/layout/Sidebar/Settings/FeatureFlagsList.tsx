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
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { useApi, featureFlagsApiRef } from '@backstage/core-api';
import { FlagItem } from './FeatureFlagsItem';
import { Divider } from '@material-ui/core';

export const FeatureFlagsList = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const featureFlags = featureFlagsApi.getRegisteredFlags();

  if (featureFlags.length === 0) {
    return null;
  }

  return (
    <>
      <Divider />
      <List dense subheader={<ListSubheader>Feature Flags</ListSubheader>}>
        {featureFlags.map(featureFlag => (
          <FlagItem
            key={featureFlag.name}
            featureFlag={featureFlag}
            api={featureFlagsApi}
          />
        ))}
      </List>
    </>
  );
};
