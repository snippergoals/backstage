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
import React, { FC } from 'react';
import { Progress, InfoCard, StructuredMetadataTable } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';

type ComponentMetadataCardProps = {
  loading: boolean;
  entity: Entity | undefined;
};
const ComponentMetadataCard: FC<ComponentMetadataCardProps> = ({
  loading,
  entity,
}) => {
  if (loading) {
    return (
      <InfoCard title="Metadata">
        <Progress />
      </InfoCard>
    );
  }
  if (!entity) {
    return null;
  }
  return (
    <InfoCard title="Metadata">
      <StructuredMetadataTable metadata={entity} />
    </InfoCard>
  );
};
export default ComponentMetadataCard;
