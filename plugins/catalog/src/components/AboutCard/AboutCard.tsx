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
  Entity,
  ENTITY_DEFAULT_NAMESPACE,
  RELATION_OWNED_BY,
  RELATION_PROVIDES_API,
  serializeEntityRef,
} from '@backstage/catalog-model';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ExtensionIcon from '@material-ui/icons/Extension';
import DocsIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import GitHubIcon from '@material-ui/icons/GitHub';
import React from 'react';
import { IconLinkVertical } from './IconLinkVertical';
import { findLocationForEntityMeta } from '../../data/utils';
import { createEditLink, determineUrlType } from '../createEditLink';

const useStyles = makeStyles(theme => ({
  links: {
    margin: theme.spacing(2, 0),
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    gridGap: theme.spacing(3),
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  value: {
    fontWeight: 'bold',
    overflow: 'hidden',
    lineHeight: '24px',
    wordBreak: 'break-word',
  },
  description: {
    wordBreak: 'break-word',
  },
  gridItemCard: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 10px)', // for pages without content header
    marginBottom: '10px',
  },
  gridItemCardContent: {
    flex: 1,
  },
}));

const iconMap: Record<string, React.ReactNode> = {
  github: <GitHubIcon />,
};

type CodeLinkInfo = {
  icon?: React.ReactNode;
  edithref?: string;
  href?: string;
};

function getCodeLinkInfo(entity: Entity): CodeLinkInfo {
  const location = findLocationForEntityMeta(entity?.metadata);
  if (location) {
    const type =
      location.type === 'url'
        ? determineUrlType(location.target)
        : location.type;
    return {
      icon: iconMap[type],
      edithref: createEditLink(location),
      href: location.target,
    };
  }
  return {};
}

type AboutCardProps = {
  entity: Entity;
  variant?: string;
};

export function AboutCard({ entity, variant }: AboutCardProps) {
  const classes = useStyles();
  const codeLink = getCodeLinkInfo(entity);
  // TODO: Also support RELATION_CONSUMES_API here
  const hasApis = entity.relations?.some(r => r.type === RELATION_PROVIDES_API);

  return (
    <Card className={variant === 'gridItem' ? classes.gridItemCard : ''}>
      <CardHeader
        title="About"
        action={
          <IconButton
            aria-label="Edit"
            title="Edit Metadata"
            onClick={() => {
              window.open(codeLink.edithref || '#', '_blank');
            }}
          >
            <EditIcon />
          </IconButton>
        }
        subheader={
          <nav className={classes.links}>
            <IconLinkVertical label="View Source" {...codeLink} />
            <IconLinkVertical
              disabled={
                !entity.metadata.annotations?.['backstage.io/techdocs-ref']
              }
              label="View TechDocs"
              title={
                !entity.metadata.annotations?.['backstage.io/techdocs-ref']
                  ? 'No TechDocs available'
                  : ''
              }
              icon={<DocsIcon />}
              href={`/docs/${
                entity.metadata.namespace || ENTITY_DEFAULT_NAMESPACE
              }/${entity.kind}/${entity.metadata.name}`}
            />
            <IconLinkVertical
              disabled={!hasApis}
              label="View API"
              title={hasApis ? '' : 'No APIs available'}
              icon={<ExtensionIcon />}
              href="api"
            />
          </nav>
        }
      />
      <Divider />
      <CardContent
        className={variant === 'gridItem' ? classes.gridItemCardContent : ''}
      >
        <Grid container>
          <AboutField label="Description" gridSizes={{ xs: 12 }}>
            <Typography
              variant="body2"
              paragraph
              className={classes.description}
            >
              {entity?.metadata?.description || 'No description'}
            </Typography>
          </AboutField>
          <AboutField
            label="Owner"
            value={entity?.relations
              ?.filter(r => r.type === RELATION_OWNED_BY)
              .map(({ target: { kind, name, namespace } }) =>
                // TODO(Rugvip): we want to provide some utils for this
                serializeEntityRef({
                  kind,
                  name,
                  namespace:
                    namespace === ENTITY_DEFAULT_NAMESPACE
                      ? undefined
                      : namespace,
                }),
              )
              .join(', ')}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
          <AboutField
            label="Type"
            value={entity?.spec?.type as string}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
          <AboutField
            label="Lifecycle"
            value={entity?.spec?.lifecycle as string}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
          <AboutField
            label="Tags"
            value="No Tags"
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          >
            {(entity?.metadata?.tags || []).map(t => (
              <Chip key={t} size="small" label={t} />
            ))}
          </AboutField>
        </Grid>
      </CardContent>
    </Card>
  );
}

function AboutField({
  label,
  value,
  gridSizes,
  children,
}: {
  label: string;
  value?: string;
  gridSizes?: Record<string, number>;
  children?: React.ReactNode;
}) {
  const classes = useStyles();

  // Content is either children or a string prop `value`
  const content = React.Children.count(children) ? (
    children
  ) : (
    <Typography variant="body2" className={classes.value}>
      {value || `unknown`}
    </Typography>
  );
  return (
    <Grid item {...gridSizes}>
      <Typography variant="subtitle2" className={classes.label}>
        {label}
      </Typography>
      {content}
    </Grid>
  );
}
