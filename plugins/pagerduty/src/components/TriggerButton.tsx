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
import { Button } from '@material-ui/core';
import { TriggerDialog } from './TriggerDialog';
import { Entity } from '@backstage/catalog-model';
import { PAGERDUTY_INTEGRATION_KEY } from './PagerDutyServiceCard';

type Props = {
  entity: Entity;
};

export const TriggerButton = ({ entity }: Props) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const handleDialog = () => {
    setShowDialog(!showDialog);
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={handleDialog}
      >
        Trigger alarm
      </Button>
      {showDialog && (
        <TriggerDialog
          name={entity.metadata.name}
          integrationKey={
            entity.metadata.annotations![PAGERDUTY_INTEGRATION_KEY]
          }
          onClose={handleDialog}
        />
      )}
    </>
  );
};
