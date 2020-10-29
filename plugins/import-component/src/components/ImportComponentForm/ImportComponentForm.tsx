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

import { Entity } from '@backstage/catalog-model';
import { errorApiRef, useApi } from '@backstage/core';
import { BackstageTheme } from '@backstage/theme';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMountedState } from 'react-use';
import { RecursivePartial } from '../../util/types';
import { ComponentIdValidators } from '../../util/validate';
import { useGithubRepos } from '../ImportComponentPage/useGithubRepos';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  form: {
    alignItems: 'flex-start',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  submit: {
    marginTop: theme.spacing(1),
  },
  select: {
    minWidth: 120,
  },
}));

type Props = {
  nextStep: () => void;
  saveConfig: (configFile: {
    repo: string;
    config: RecursivePartial<Entity>[];
  }) => void;
};

export const RegisterComponentForm = ({ nextStep, saveConfig }: Props) => {
  const { control, register, handleSubmit, errors, formState } = useForm({
    mode: 'onChange',
  });
  const classes = useStyles();
  const hasErrors = !!errors.componentLocation;
  const dirty = formState?.isDirty;

  const isMounted = useMountedState();
  const errorApi = useApi(errorApiRef);
  const { generateEntityDefinitions } = useGithubRepos();

  const onSubmit = async (formData: Record<string, string>) => {
    const { componentLocation: target } = formData;
    try {
      // const typeMapping = [
      //   { url: /^https:\/\/gitlab\.com\/.*/, type: 'gitlab/api' },
      //   { url: /^https:\/\/bitbucket\.org\/.*/, type: 'bitbucket/api' },
      //   { url: /^https:\/\/dev\.azure\.com\/.*/, type: 'azure/api' },
      //   { url: /.*/, type: 'github' },
      // ];

      // const type =
      //   scmType === 'AUTO'
      //     ? typeMapping.filter(item => item.url.test(target))[0].type
      //     : scmType;

      if (!isMounted()) return;

      const repo = target
        .split('/')
        .slice(-2)
        .join('/');

      const config = await generateEntityDefinitions(repo);
      saveConfig({
        repo,
        config,
      });
      nextStep();
    } catch (e) {
      errorApi.post(e);
    }
  };

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className={classes.form}
      data-testid="register-form"
    >
      <FormControl>
        <TextField
          id="registerComponentInput"
          variant="outlined"
          label="Repository URL"
          data-testid="componentLocationInput"
          error={hasErrors}
          placeholder="https://github.com/spotify/backstage"
          name="componentLocation"
          required
          margin="normal"
          helperText="Enter the full path to the repository in GitHub, GitLab, Bitbucket or Azure to start tracking your component."
          inputRef={register({
            required: true,
            validate: ComponentIdValidators,
          })}
        />

        {errors.componentLocation && (
          <FormHelperText error={hasErrors} id="register-component-helper-text">
            {errors.componentLocation.message}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl variant="outlined" className={classes.select}>
        <InputLabel id="scmLabel">Host type</InputLabel>
        <Controller
          control={control}
          name="scmType"
          defaultValue="AUTO"
          render={({ onChange, onBlur, value }) => (
            <Select
              labelId="scmLabel"
              id="scmSelect"
              label="scmLabel"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            >
              <MenuItem value="AUTO">Auto-detect</MenuItem>
              <MenuItem value="gitlab">GitLab</MenuItem>
              <MenuItem value="bitbucket/api">Bitbucket</MenuItem>
              <MenuItem value="azure/api">Azure</MenuItem>
            </Select>
          )}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={!dirty || hasErrors}
        className={classes.submit}
      >
        Submit
      </Button>
    </form>
  );
};
