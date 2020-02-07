# Backstage

[![GitHub license](https://img.shields.io/github/license/spotify/backstage.svg)](./LICENSE)

## What is Backstage?

Backstage is an open platform for building developer portals.

## Getting started

### Secrets

To setup secrets, copy the `secrets.env.example` to `secrets.env` as such:

```bash
$ cp secrets.env.example secrets.env
```

### Protobuf Definitions

To generate the Protobuf definitions in Go and TypeScript, run the following command from the root to run [Prototool](https://github.com/uber/prototool):

```bash
$ make build-protocol-definitions
```

See [proto/README.md](proto/README.md) for more information.

## Running Locally

First step is to set up a `secrets.env` file in the root of the repo. Use the following template but fill in your own values (without quotes!):

```bash
# GitHub username
BOSS_GH_USERNAME=<username>
# GitHub Access token with repo scope, created at https://github.com/settings/tokens
BOSS_GH_ACCESS_TOKEN=<access-token>
```

Then run start all backend services using `docker-compose`:

```bash
$ ./docker-compose.yaml up --build
```

And finally install all dependencies and start serving the frontend using `yarn`:

```bash
$ cd frontend

$ yarn install

$ yarn start
```

## Plugins

### Creating a Plugin

Run the following:

```bash
$ make scaffold-new-frontend-plugin
```

This will generate a plugin in the `frontend/packages/plugins` folder. It is important to note you will still need to include the plugin in your `frontend/packages/app` in the `package.json`. You will then be able to import it as follows:

```bash
$ make scaffold-new-frontend-plugin
plugin_name [example-plugin]: github-api

$ vim frontend/packages/app/package.json
# Add the following line to your package.json
# Note all plugins are prefixed with "plugin-" by default with a version number of "0.0.0"
# "@backstage/plugin-github-api": "0.0.0",

$ vim frontend/packages/app/src/App.tsx
# Add the following line to import your generated component
# import { ExampleComponent } from '@backstage/plugin-github-api';
# <ExampleComponent />
```

## Documentation

## License

Copyright 2020 Spotify AB.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
