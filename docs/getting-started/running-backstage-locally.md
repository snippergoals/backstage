---
id: running-backstage-locally
title: Running Backstage Locally
---

First make sure you are using NodeJS with an Active LTS Release, currently v12.
This is made easy with a version manager such as nvm which allows for version
switching.

```bash
# Checking your version
node --version
> v14.7.0

# Adding a second node version
nvm install 12
> Downloading and installing node v12.18.3...
> Now using node v12.18.3 (npm v6.14.6)
```

To get up and running with a local Backstage to evaluate it, let's clone it off
of GitHub and run an initial build.

```bash
# Start from your local development folder
git clone git@github.com:spotify/backstage.git
cd backstage

# Fetch our dependencies and run an initial build
yarn install
yarn tsc
yarn build
```

Phew! Now you have a local repository that's ready to run and to add any open
source contributions into.

We are now going to launch two things: an example Backstage frontend app, and an
example Backstage backend that the frontend talks to. You are going to need two
terminal windows, both starting from the Backstage project root.

In the first window, run

```bash
cd packages/backend
yarn start
```

That starts up a backend instance on port 7000.

In the other window, we will then launch the frontend. This command is run from
the project root, not inside the backend directory.

```bash
yarn start
```

That starts up the frontend on port 3000, and should automatically open a
browser window showing it.

Congratulations! That should be it. Let us know how it went
[on discord](https://discord.gg/EBHEGzX), file issues for any
[feature](https://github.com/spotify/backstage/issues/new?labels=help+wanted&template=feature_template.md)
or
[plugin suggestions](https://github.com/spotify/backstage/issues/new?labels=plugin&template=plugin_template.md&title=%5BPlugin%5D+THE+PLUGIN+NAME),
or
[bugs](https://github.com/spotify/backstage/issues/new?labels=bug&template=bug_template.md)
you have, and feel free to
[contribute](https://github.com/spotify/backstage/blob/master/CONTRIBUTING.md)!

## Creating a Plugin

The value of Backstage grows with every new plugin that gets added. Here is a
collection of tutorials that will guide you through setting up and extending an
instance of Backstage with your own plugins.

- [Development Environment](development-environment.md)
- [Create a Backstage Plugin](../plugins/create-a-plugin.md)
- [Structure of a Plugin](../plugins/structure-of-a-plugin.md)
- [Utility APIs](../api/utility-apis.md)

[Back to Docs](../README.md)
