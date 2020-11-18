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
import {
  makeStyles,
  Typography,
  Divider,
  Card,
  CardHeader,
  Button,
  CardContent,
  Select,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  MenuItem,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  filters: {
    background: 'transparent',
    boxShadow: '0px 0px 0px 0px',
  },
  checkbox: {
    padding: theme.spacing(0, 1, 0, 1),
  },
  dropdown: {
    width: '100%',
  },
}));

export type FiltersState = {
  selected: string;
  checked: Array<string>;
};

type FiltersProps = {
  filters: FiltersState;
  resetFilters: () => void;
  updateSelected: (filter: string) => void;
  updateChecked: (filter: string) => void;
};

export const Filters = ({
  filters,
  resetFilters,
  updateSelected,
  updateChecked,
}: FiltersProps) => {
  const classes = useStyles();

  // TODO: move mocked filters out of filters component to make it more generic
  const filter1 = ['All', 'API', 'Component', 'Location', 'Template'];
  const filter2 = ['deprecated', 'recommended', 'experimental', 'production'];

  return (
    <Card className={classes.filters}>
      <CardHeader
        title={<Typography variant="h6">Filters</Typography>}
        action={
          <Button color="primary" onClick={() => resetFilters()}>
            CLEAR ALL
          </Button>
        }
      />
      <Divider />
      <CardContent>
        <Typography variant="subtitle2">Kind</Typography>
        <Select
          id="outlined-select"
          onChange={(e: React.ChangeEvent<any>) =>
            updateSelected(e?.target?.value)
          }
          variant="outlined"
          className={classes.dropdown}
          value={filters.selected}
        >
          {filter1.map(filter => (
            <MenuItem
              selected={filter === 'All'}
              dense
              key={filter}
              value={filter}
            >
              {filter}
            </MenuItem>
          ))}
        </Select>
      </CardContent>
      <CardContent>
        <Typography variant="subtitle2">Lifecycle</Typography>
        <List disablePadding dense>
          {filter2.map(filter => (
            <ListItem
              key={filter}
              dense
              button
              onClick={() => updateChecked(filter)}
            >
              <Checkbox
                edge="start"
                disableRipple
                className={classes.checkbox}
                color="primary"
                checked={filters.checked.includes(filter)}
                tabIndex={-1}
                value={filter}
                name={filter}
              />
              <ListItemText id={filter} primary={filter} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
