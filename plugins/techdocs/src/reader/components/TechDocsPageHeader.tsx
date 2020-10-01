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
import GitHubIcon from '@material-ui/icons/GitHub';
import { Header, HeaderLabel, Link } from '@backstage/core';
import { CircularProgress } from '@material-ui/core';
import { ParsedEntityId } from '../../types';
import { AsyncState } from 'react-use/lib/useAsync';

type TechDocsPageHeaderProps = {
  entityId: ParsedEntityId;
  metadataRequest: {
    entity: AsyncState<any>;
    mkdocs: AsyncState<any>;
  };
};

export const TechDocsPageHeader = ({
  entityId,
  metadataRequest,
}: TechDocsPageHeaderProps) => {
  const { mkdocs: mkdocsMetadata, entity: entityMetadata } = metadataRequest;

  const { value: mkDocsMetadataValues } = mkdocsMetadata;
  const { value: entityMetadataValues } = entityMetadata;

  const { kind, name } = entityId;

  const { site_name: siteName, site_description: siteDescription } =
    mkDocsMetadataValues || {};

  const {
    locationMetadata,
    spec: { owner, lifecycle },
  } = entityMetadataValues || { spec: {} };

  const labels = (
    <>
      <HeaderLabel
        label="Component"
        value={
          <Link style={{ color: '#fff' }} to={`/catalog/${kind}/${name}`}>
            {name}
          </Link>
        }
      />
      {owner ? <HeaderLabel label="Site Owner" value={owner} /> : null}
      {lifecycle ? <HeaderLabel label="Lifecycle" value={lifecycle} /> : null}
      {locationMetadata &&
      locationMetadata.type !== 'dir' &&
      locationMetadata.type !== 'file' ? (
        <HeaderLabel
          label=""
          value={
            <a href={locationMetadata.target} target="_blank">
              <GitHubIcon style={{ marginTop: '-25px', fill: '#fff' }} />
            </a>
          }
        />
      ) : null}
    </>
  );

  return (
    <Header
      title={siteName ? siteName : <CircularProgress />}
      subtitle={
        siteDescription && siteDescription !== 'None' ? siteDescription : ''
      }
    >
      {labels}
    </Header>
  );
};
