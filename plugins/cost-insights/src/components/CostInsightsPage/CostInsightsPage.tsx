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

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Container, Divider, Grid } from '@material-ui/core';
import { Progress, useApi, featureFlagsApiRef } from '@backstage/core';
import { default as MaterialAlert } from '@material-ui/lab/Alert';
import { costInsightsApiRef } from '../../api';
import AlertActionCardList from '../AlertActionCardList';
import AlertInsights from '../AlertInsights';
import CostInsightsLayout from '../CostInsightsLayout';
import CopyUrlToClipboard from '../CopyUrlToClipboard';
import CurrencySelect from '../CurrencySelect';
import WhyCostsMatter from '../WhyCostsMatter';
import CostInsightsHeader, {
  CostInsightsHeaderNoGroups,
} from '../CostInsightsHeader';
import CostInsightsNavigation from '../CostInsightsNavigation';
import CostOverviewCard from '../CostOverviewCard';
import ProductInsights from '../ProductInsights';
import CostInsightsSupportButton from '../CostInsightsSupportButton';
import {
  useLoading,
  useFilters,
  useGroups,
  useCurrency,
  useConfig,
} from '../../hooks';
import { Alert, Cost, intervalsOf, Maybe, Project } from '../../types';
import { mapLoadingToProps } from './selector';

const CostInsightsPage = () => {
  const flags = useApi(featureFlagsApiRef).getFlags();
  // There is not currently a UI to set feature flags
  // flags.set('cost-insights-currencies', FeatureFlagState.On);
  const client = useApi(costInsightsApiRef);
  const { currencies } = useConfig();
  const groups = useGroups();
  const [currency, setCurrency] = useCurrency();
  const [projects, setProjects] = useState<Maybe<Project[]>>(null);
  const [dailyCost, setDailyCost] = useState<Maybe<Cost>>(null);
  const [alerts, setAlerts] = useState<Maybe<Alert[]>>(null);
  const [error, setError] = useState<Maybe<Error>>(null);

  const { pageFilters } = useFilters(p => p);
  const {
    loadingActions,
    loadingGroups,
    loadingInitial,
    dispatchInitial,
    dispatchInsights,
    dispatchNone,
  } = useLoading(mapLoadingToProps);

  /* eslint-disable react-hooks/exhaustive-deps */
  // The dispatchLoading functions are derived from loading state using mapLoadingToProps, to
  // provide nicer props for the component. These are re-derived whenever loading state changes,
  // which causes an infinite loop as product panels load and re-trigger the useEffect below.
  // Since the functions don't change, we can memoize - but we trigger the same loop if we satisfy
  // exhaustive-deps by including the function itself in dependencies.

  const dispatchLoadingInitial = useCallback(dispatchInitial, []);
  const dispatchLoadingInsights = useCallback(dispatchInsights, []);
  const dispatchLoadingNone = useCallback(dispatchNone, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    async function getInsights() {
      setError(null);
      try {
        if (pageFilters.group) {
          dispatchLoadingInsights(true);
          const [
            fetchedProjects,
            fetchedCosts,
            fetchedAlerts,
          ] = await Promise.all([
            client.getGroupProjects(pageFilters.group),
            pageFilters.project
              ? client.getProjectDailyCost(
                  pageFilters.project,
                  pageFilters.metric,
                  intervalsOf(pageFilters.duration),
                )
              : client.getGroupDailyCost(
                  pageFilters.group,
                  pageFilters.metric,
                  intervalsOf(pageFilters.duration),
                ),
            client.getAlerts(pageFilters.group),
          ]);
          setProjects(fetchedProjects);
          setDailyCost(fetchedCosts);
          setAlerts(fetchedAlerts);
        } else {
          dispatchLoadingNone(loadingActions);
        }
      } catch (e) {
        setError(e);
        dispatchLoadingNone(loadingActions);
      } finally {
        dispatchLoadingInitial(false);
        dispatchLoadingInsights(false);
      }
    }

    // Wait for user groups to finish loading
    if (!loadingGroups) {
      getInsights();
    }
  }, [
    client,
    pageFilters,
    loadingGroups,
    dispatchLoadingInsights,
    dispatchLoadingInitial,
    dispatchLoadingNone,
    loadingActions,
  ]);

  if (loadingInitial) {
    return <Progress />;
  }

  if (error) {
    return <MaterialAlert severity="error">{error.message}</MaterialAlert>;
  }

  // Loaded but no groups found for the user
  if (!pageFilters.group) {
    return (
      <CostInsightsLayout groups={groups}>
        <Box textAlign="right">
          <CopyUrlToClipboard />
          <CostInsightsSupportButton />
        </Box>
        <Container maxWidth="lg">
          <CostInsightsHeaderNoGroups />
        </Container>
        <Divider />
        <Container maxWidth="lg">
          <WhyCostsMatter />
        </Container>
      </CostInsightsLayout>
    );
  }

  // These should be defined, alerts can be an empty array but that's truthy
  if (!dailyCost || !alerts) {
    return (
      <MaterialAlert severity="error">{`Error: Could not fetch cost insights data for team ${pageFilters.group}`}</MaterialAlert>
    );
  }

  return (
    <CostInsightsLayout groups={groups}>
      <Grid container wrap="nowrap">
        <Grid item>
          <Box position="sticky" top={20}>
            <CostInsightsNavigation alerts={alerts.length} />
          </Box>
        </Grid>
        <Grid item xs>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            mb={2}
          >
            {!!flags.get('cost-insights-currencies') && (
              <Box mr={1}>
                <CurrencySelect
                  currency={currency}
                  currencies={currencies}
                  onSelect={setCurrency}
                />
              </Box>
            )}
            <CopyUrlToClipboard />
            <CostInsightsSupportButton />
          </Box>
          <Container maxWidth="lg" disableGutters>
            <Grid container direction="column">
              <Grid item xs>
                <CostInsightsHeader
                  owner={pageFilters.group}
                  groups={groups}
                  hasCostData={!!dailyCost.aggregation.length}
                  alerts={alerts.length}
                />
              </Grid>
              {!!alerts.length && (
                <>
                  <Grid item xs>
                    <Box px={3} py={6}>
                      <AlertActionCardList alerts={alerts} />
                    </Box>
                  </Grid>
                  <Divider />
                </>
              )}
              <Grid item xs>
                <Box px={3} py={6}>
                  {!!dailyCost.aggregation.length && (
                    <CostOverviewCard
                      change={dailyCost.change}
                      aggregation={dailyCost.aggregation}
                      trendline={dailyCost.trendline}
                      projects={projects || []}
                    />
                  )}
                  <WhyCostsMatter />
                </Box>
              </Grid>
              <Grid item xs>
                {!!alerts?.length && (
                  <Box px={6} py={6} mx={-3} bgcolor="alertBackground">
                    <AlertInsights alerts={alerts} />
                  </Box>
                )}
              </Grid>
              {!alerts.length && <Divider />}
              <Grid item xs>
                <Box px={3} py={6}>
                  <ProductInsights />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </CostInsightsLayout>
  );
};

export default CostInsightsPage;
