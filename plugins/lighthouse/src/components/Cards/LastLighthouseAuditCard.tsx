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
import { Audit, AuditCompleted, LighthouseCategoryId } from '../../api';
import {
  InfoCard,
  Progress,
  StatusError,
  StatusOK,
  StatusWarning,
  StructuredMetadataTable,
} from '@backstage/core';
import { useWebsiteForEntity } from '../../hooks/useWebsiteForEntity';
import AuditStatusIcon from '../AuditStatusIcon';

const LighthouseCategoryScoreStatus: FC<{ score: number }> = ({ score }) => {
  const scoreAsPercentage = score * 100;
  switch (true) {
    case scoreAsPercentage >= 90:
      return (
        <>
          <StatusOK />
          {scoreAsPercentage}%
        </>
      );
    case scoreAsPercentage >= 50 && scoreAsPercentage < 90:
      return (
        <>
          <StatusWarning />
          {scoreAsPercentage}%
        </>
      );
    case scoreAsPercentage < 50:
      return (
        <>
          <StatusError />
          {scoreAsPercentage}%
        </>
      );
    default:
      return <span>N/A</span>;
  }
};

const LighthouseAuditStatus: FC<{ audit: Audit }> = ({ audit }) => (
  <>
    <AuditStatusIcon audit={audit} />
    {audit.status.toUpperCase()}
  </>
);

const LighthouseAuditSummary: FC<{ audit: Audit; dense?: boolean }> = ({
  audit,
  dense = false,
}) => {
  const { url } = audit;
  const flattenedCategoryData: Record<string, React.ReactNode> = {};
  if (audit.status === 'COMPLETED') {
    const categories = (audit as AuditCompleted).categories;
    const categoryIds = Object.keys(categories) as LighthouseCategoryId[];
    categoryIds.forEach((id: LighthouseCategoryId) => {
      const { title, score } = categories[id];

      flattenedCategoryData[title] = (
        <LighthouseCategoryScoreStatus score={score} />
      );
    });
  }
  const tableData = {
    url,
    status: <LighthouseAuditStatus audit={audit} />,
    ...flattenedCategoryData,
  };

  return <StructuredMetadataTable metadata={tableData} dense={dense} />;
};

export const LastLighthouseAuditCard: FC<{ dense?: boolean }> = ({
  dense = false,
}) => {
  const { value: website, loading, error } = useWebsiteForEntity();

  let content;
  if (loading) {
    content = <Progress />;
  }
  if (error) {
    content = null;
  }
  if (website) {
    content = (
      <LighthouseAuditSummary audit={website.lastAudit} dense={dense} />
    );
  }
  return <InfoCard title="Lighthouse Audit">{content}</InfoCard>;
};
