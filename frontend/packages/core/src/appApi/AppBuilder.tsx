import React, { ComponentType, FC } from 'react';
import { AppContextProvider } from './AppContext';
import { App, EntityConfig, AppComponentBuilder } from './types';
import { Route, Switch, useParams } from 'react-router-dom';
import EntityKind from './EntityKind';
import { EntityContextProvider } from './EntityContext';

const DefaultHomePage: FC<{}> = () => {
  return <span>Hello! I am default home page</span>;
};

class AppImpl implements App {
  constructor(private readonly entities: Map<string, EntityKind>) {}

  getEntityConfig(kind: string): EntityConfig {
    const entity = this.entities.get(kind);
    if (!entity) {
      throw new Error('EntityKind not found');
    }
    return entity.config;
  }
}

function builtComponent(
  app: App,
  component: ComponentType<any> | AppComponentBuilder,
) {
  if (component instanceof AppComponentBuilder) {
    return component.build(app);
  }
  return component;
}

export default class AppBuilder {
  private readonly entities = new Map<string, EntityKind>();
  private homePage: ComponentType = DefaultHomePage;

  registerEntityKind(...entity: EntityKind[]) {
    for (const e of entity) {
      const { kind } = e.config;
      if (this.entities.has(e.config.kind)) {
        throw new Error(`EntityKind '${kind}' is already registered`);
      }
      this.entities.set(e.config.kind, e);
    }
  }

  setHomePage(page: ComponentType<{}>) {
    this.homePage = page;
  }

  build(): ComponentType<{}> {
    const app = new AppImpl(this.entities);

    const entityRoutes = [];

    for (const { config } of this.entities.values()) {
      const { kind, pages } = config;
      const basePath = `/entity/${kind}`;

      if (pages.list) {
        const ListComponent = builtComponent(app, pages.list);

        const Component: FC<{}> = () => (
          <EntityContextProvider config={config}>
            <ListComponent />
          </EntityContextProvider>
        );

        const path = basePath;
        entityRoutes.push(
          <Route key={path} path={path} component={Component} />,
        );
      }

      if (pages.view) {
        const ViewComponent = builtComponent(app, pages.view);

        const Component: FC<{}> = () => {
          const { entityId } = useParams<{ entityId: string }>();
          return (
            <EntityContextProvider config={config} id={entityId}>
              <ViewComponent />
            </EntityContextProvider>
          );
        };

        const path = `${basePath}/:entityId`;
        entityRoutes.push(
          <Route key={path} path={path} component={Component} />,
        );
      }
    }

    const routes = [...entityRoutes];

    return () => (
      <AppContextProvider app={app}>
        <Switch>
          {routes}
          <Route exact path="/" component={this.homePage} />
          <Route component={() => <span>404 Not Found</span>} />
        </Switch>
      </AppContextProvider>
    );
  }
}
