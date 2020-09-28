# Cost Insights

Cost Insights is a plugin to help engineers visualize, understand and optimize their cloud costs. The Cost Insights page shows daily cost data for a team, trends over time, and comparisons with the business metrics you care about.

At Spotify, we find that cloud costs are optimized organically when:

- Engineers see cost data in their daily work (that is, in Backstage).
- It's clear when cloud costs need attention.
- The data is shown in software terms familiar to them.
- Alerts and recommendations are targeted and actionable.

Cost Insights shows trends over time, at the granularity of your software deployments - rather than the cloud provider's concepts. It can be used to troubleshoot cost anomalies, and promote cost-saving infrastructure migrations.

## Install

```bash
yarn add @backstage/plugin-cost-insights
```

## Setup

1. Configure `app-config.yaml`. See [Configuration](#configuration).

2. Create a CostInsights client. Clients must implement the CostInsightsApi interface. See the [API file](https://github.com/spotify/backstage/plugins/cost-insights/src/api/CostInsightsApi.ts) for required methods and documentation.

```ts
// path/to/CostInsightsClient.ts
import { CostInsightsApi } from '@backstage/plugin-cost-insights';

export class CostInsightsClient implements CostInsightsApi { ... }
```

3. Import the client and the CostInsights plugin API to your Backstage instance.

```ts
// packages/app/src/api.ts
import { createApiFactory } from '@backstage/core';
import { costInsightsApiRef } from '@backstage/plugin-cost-insights';
import { CostInsightsClient } from './path/to/file';

export const apis = [
  createApiFactory({
    api: costInsightsApiRef,
    deps: {},
    factory: () => new CostInsightsClient(),
  }),
];
```

4. Add cost-insights to your Backstage plugins.

```ts
// packages/app/src/plugins.ts
export { plugin as CostInsights } from '@backstage/plugin-cost-insights';
```

## Configuration

Cost Insights has only two required configuration fields: a map of cloud `products` for showing cost breakdowns and `engineerCost` - the average yearly cost of an engineer including benefits. Products must be defined as keys on the `products` field.

You can optionally supply a product `icon` to display in Cost Insights navigation. See the [type file](https://github.com/spotify/backstage/plugins/cost-insights/types/Icon.ts) for supported types and Material UI icon [mappings](https://github.com/spotify/backstage/plugins/cost-insights/utils/navigation.ts).

**Note:** Product keys should be unique and camelCased. Backstage does not support underscores in configuration keys.

### Basic

```yaml
## ./app-config.yaml
costInsights:
  engineerCost: 200000
  products:
    productA:
      name: Some Cloud Product ## required
      icon: storage
    productB:
      name: Some Other Cloud Product
      icon: data
```

### Metrics (Optional)

In the `Cost Overview` panel, users can choose from a dropdown of business metrics to see costs as they relate to a metric, such as daily active users. Metrics must be defined as keys on the `metrics` field. A user-friendly name is **required**. Metrics will be provided to the `getDailyCost` and `getProjectCosts` API methods via the `metric` parameter.

**Note:** Cost Insights displays daily cost without a metric by default. The dropdown text for this default can be overriden by assigning it a value on the `dailyCost` field.

```yaml
## ./app-config.yaml
costInsights:
  engineerCost: 200000
  products:
    productA:
      name: Some Cloud Product
      icon: storage
    productB:
      name: Some Other Cloud Product
      icon: data
  metrics:
    dailyCost:
      name: Earth Rotation
    metricA:
      name: Metric A ## required
    metricB:
      name: Metric B
    metricC:
      name: Metric C
```
