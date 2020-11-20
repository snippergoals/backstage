---
id: getting-started
title: Getting Started
description: Getting Started Guidelines
---

TechDocs functions as a plugin to Backstage, so you will need to use Backstage
to use TechDocs.

If you haven't setup Backstage already, start
[here](../../getting-started/index.md).

## Installing TechDocs

TechDocs is provided with the Backstage application by default. If you want to
set up TechDocs manually, keep following the instructions below.

### Adding the package

The first step is to add the TechDocs plugin to your Backstage application.
Navigate to your new Backstage application folder:

```bash
cd hello-world/
```

Then navigate to your `packages/app` folder to install TechDocs:

```bash
cd packages/app
yarn add @backstage/plugin-techdocs
```

After a short while, the TechDocs plugin should be successfully installed.

Next, you need to set up some basic configuration. Enter the following command:

```bash
yarn install
```

Add this to `packages/app/src/plugins.ts`:

```typescript
export { plugin as TechDocs } from '@backstage/plugin-techdocs';
```

### Setting the configuration

TechDocs allows for configuration of the docs storage URL through your
`app-config.yaml` file. We provide two different values to be configured,
`requestUrl` and `storageUrl`. The `requestUrl` is what the reader will request
its data from, and `storageUrl` is where the backend can find the stored
documentation.

The default storage and request URLs:

```yaml
techdocs:
  storageUrl: http://localhost:7000/api/techdocs/static/docs
  requestUrl: http://localhost:7000/api/techdocs/
```

If you want `techdocs-backend` to manage building and publishing, you want
`requestUrl` to point to the default value (or wherever `techdocs-backend` is
hosted). `storageUrl` should be where your publisher publishes your docs. Using
the default `LocalPublish` that is the default value.

If you have a setup where you are not using `techdocs-backend` for managing
building and publishing of your documentation, you want to change the
`requestUrl` to point to your storage. In this case `storageUrl` is not
required.

### Disable Docker in Docker situation (Optional)

The TechDocs backend plugin runs a docker container with mkdocs installed to
generate the frontend of the docs from source files (Markdown). If you are
deploying Backstage using Docker, this will mean that your Backstage Docker
container will try to run another Docker container for TechDocs backend.

To avoid this problem, we have a configuration available. You can set a value in
your `app-config.yaml` that tells the techdocs generator if it should run the
`local` mkdocs or run it from `docker`. This defaults to running as `docker` if
no config is provided.

```yaml
techdocs:
  generators:
    techdocs: local
```

Setting `generators.techdocs` to `local` means you will have to make sure your
environment is compatible with techdocs.

You will have to install the `mkdocs` and `mkdocs-techdocs-core` package from
pip, as well as `graphviz` and `plantuml` from your OS package manager (e.g.
apt). See our
[Dockerfile](https://github.com/backstage/techdocs-container/blob/main/Dockerfile)
for the latest requirements. You should be trying to match your Dockerfile with
this one.

Note: We recommend Python version 3.7 or higher.

Caveat: Please install the `mkdocs-techdocs-core` package after all other Python
packages. The order is important to make sure we get correct version of some of
the dependencies. For example, we want `Markdown` version to be
[3.2.2](https://github.com/backstage/backstage/blob/f9f70c225548017b6a14daea75b00fbd399c11eb/packages/techdocs-container/techdocs-core/requirements.txt#L11).
You can also explicitly install `Markdown==3.2.2` after installing all other
Python packages.

## Run Backstage locally

Change folder to `<backstage-project-root>/packages/backend` and run the
following command:

```bash
yarn start
```

Open a new command line window. Change directory to your Backstage application
root and run the following command:

```bash
yarn start
```

Open your browser at [http://localhost:3000/docs/](http://localhost:3000/docs/).

## Additional reading

- [Creating and publishing your docs](creating-and-publishing.md)
- [Back to README](README.md)
