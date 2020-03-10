# Backstage

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![](https://github.com/spotify/backstage/workflows/Frontend%20CI/badge.svg)

## What is Backstage?

Backstage is an open platform for building developer portals.

The philosophy behind Backstage is simple: Don't expose your engineers to the full complexity of your infrastructure tooling. Engineers should be shipping code — not figuring out a whole new toolset every time they want to implement the basics.

![headline](headline.png)

At Spotify we [strongly believe](https://backstage.io/the-spotify-story) that a better developer experience leads to happier and more productive engineers.

## Overview

The Backstage platform consists of a number of different components:

- **frontend** - Main web application that users interact with. It's built up by a number of different _Plugins_.
- **plugins** - Each plugin is treated as a self-contained web app and can include almost any type of content. Plugins all use a common set of platform API's and reusable UI components. Plugins can fetch data either from the _backend_ or through any RESTful API exposed through the _proxy_.
- **backend** \* - GraphQL aggregation service that holds the model of your software ecosystem, including organisational information and what team owns what software. The backend also has a Plugin model for extending its graph.
- **proxy** \* - Terminates HTTPS and exposes any RESTful API to Plugins.
- **identity** \* - A backend service that holds your organisation's metadata.

_\* not yet released_

![overview](backstage_overview.png)

## Getting started

### Install Dependencies

To run the frontend, you will need to have the following installed:

* [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [NodeJS](https://nodejs.org/en/download/)
* [yarn](https://classic.yarnpkg.com/en/docs/install)

## Running the frontend locally

Open a terminal window and start the web app using the following commands from the project root:

```bash
$ yarn # may take a while

$ yarn start
```

The final `yarn start` command should open a local instance of Backstage in your browser, otherwise open one of the URLs printed in the terminal.

## Plugins

### Creating a Plugin

To create a new plugin, make sure you're run `yarn` to install dependencies, then run the following:

```bash
$ yarn create-plugin
```

For more information see [Developing a Backstage Plugin](plugins/README.md)

## Documentation

_TODO: Add links to docs on backstage.io_

## License

Copyright 2020 Spotify AB.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
