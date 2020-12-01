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
import React, { useState } from 'react';
import { useApi, Progress } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
} from '@material-ui/core';
import { Incidents } from './Incident';
import { EscalationPolicy } from './Escalation';
import { useAsync } from 'react-use';
import { Alert } from '@material-ui/lab';
import { pagerDutyApiRef, UnauthorizedError } from '../api';
import { IconLinkVertical } from '@backstage/plugin-catalog';
import { PagerDutyIcon } from './PagerDutyIcon';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import { TriggerDialog } from './TriggerDialog';
import { MissingTokenError } from './MissingTokenError';

const useStyles = makeStyles(theme => ({
  links: {
    margin: theme.spacing(2, 0),
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    gridGap: theme.spacing(3),
  },
  triggerAlarm: {
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: 1.2,
    lineHeight: 1.5,
    '&:hover, &:focus, &.focus': {
      backgroundColor: 'transparent',
      textDecoration: 'none',
    },
  },
}));

export const PAGERDUTY_INTEGRATION_KEY = 'pagerduty.com/integration-key';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[PAGERDUTY_INTEGRATION_KEY]);

type Props = {
  entity: Entity;
};

export const PagerDutyCard = ({ entity }: Props) => {
  const classes = useStyles();
  const api = useApi(pagerDutyApiRef);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [refreshIncidents, setRefreshIncidents] = useState<boolean>(false);
  const integrationKey = entity.metadata.annotations![
    PAGERDUTY_INTEGRATION_KEY
  ];

  const { value: service, loading, error } = useAsync(async () => {
    const services = await api.getServiceByIntegrationKey(integrationKey);

    return {
      id: services[0].id,
      name: services[0].name,
      url: services[0].html_url,
      policyId: services[0].escalation_policy.id,
    };
  });

  const handleDialog = () => {
    setShowDialog(!showDialog);
  };

  if (error instanceof UnauthorizedError) {
    return <MissingTokenError />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Error encountered while fetching information. {error.message}
      </Alert>
    );
  }

  if (loading) {
    return <Progress />;
  }

  const pagerdutyLink = {
    title: 'View in PagerDuty',
    href: service!.url,
  };

  const triggerAlarm = {
    title: 'Trigger Alarm',
    action: (
      <Button
        data-testid="trigger-button"
        color="secondary"
        onClick={handleDialog}
        className={classes.triggerAlarm}
      >
        Trigger Alarm
      </Button>
    ),
  };

  const onTriggerRefresh = () => {
    setRefreshIncidents(true);
  };

  return (
    <Card>
      <CardHeader
        title="PagerDuty"
        subheader={
          <nav className={classes.links}>
            <IconLinkVertical
              label={pagerdutyLink.title}
              href={pagerdutyLink.href}
              icon={<PagerDutyIcon viewBox="0 0 100 100" />}
            />
            <IconLinkVertical
              label={triggerAlarm.title}
              icon={<AlarmAddIcon />}
              action={triggerAlarm.action}
            />
          </nav>
        }
      />
      <Divider />
      <CardContent>
        <Incidents
          serviceId={service!.id}
          refreshIncidents={refreshIncidents}
        />
        <EscalationPolicy policyId={service!.policyId} />
        <TriggerDialog
          showDialog={showDialog}
          handleDialog={handleDialog}
          name={entity.metadata.name}
          integrationKey={integrationKey}
          onTriggerRefresh={onTriggerRefresh}
        />
      </CardContent>
    </Card>
  );
};
