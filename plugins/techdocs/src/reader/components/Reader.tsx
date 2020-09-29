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
import { useApi } from '@backstage/core';
import { useShadowDom } from '..';
import { useAsync } from 'react-use';
import { techdocsStorageApiRef } from '../../api';
import { useParams, useNavigate } from 'react-router-dom';
import { ParsedEntityId } from '../../types';
import { useTheme } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import TechDocsProgressBar from './TechDocsProgressBar';

import transformer, {
  addBaseUrl,
  rewriteDocLinks,
  addLinkClickListener,
  removeMkdocsHeader,
  modifyCss,
  onCssReady,
  sanitizeDOM,
  injectCss,
} from '../transformers';
import { TechDocsNotFound } from './TechDocsNotFound';

type Props = {
  entityId: ParsedEntityId;
};

export const Reader = ({ entityId }: Props) => {
  const { kind, namespace, name } = entityId;
  const { '*': path } = useParams();
  const theme = useTheme<BackstageTheme>();

  const techdocsStorageApi = useApi(techdocsStorageApiRef);
  const [shadowDomRef, shadowRoot] = useShadowDom();
  const navigate = useNavigate();

  const { value, loading, error } = useAsync(async () => {
    return techdocsStorageApi.getEntityDocs({ kind, namespace, name }, path);
  }, [techdocsStorageApi, kind, namespace, name, path]);

  React.useEffect(() => {
    if (!shadowRoot || loading || error) {
      return; // Shadow DOM isn't ready / It's not ready / Docs was not found
    }

    // Pre-render
    const transformedElement = transformer(value as string, [
      sanitizeDOM(),
      addBaseUrl({
        techdocsStorageApi,
        entityId: entityId,
        path,
      }),
      rewriteDocLinks(),
      modifyCss({
        cssTransforms: {
          '.md-main__inner': [{ 'margin-top': '0' }],
          '.md-sidebar': [{ top: '0' }, { width: '20rem' }],
          '.md-typeset': [{ 'font-size': '1rem' }],
          '.md-nav': [{ 'font-size': '1rem' }],
          '.md-grid': [{ 'max-width': '80vw' }],
        },
      }),
      removeMkdocsHeader(),
      injectCss({
        css: `
        body {
          font-family: ${theme.typography.fontFamily};
          --md-text-color: ${theme.palette.text.primary};
          --md-text-link-color: ${theme.palette.primary.main};

          --md-code-fg-color: ${theme.palette.text.primary};
          --md-code-bg-color: ${theme.palette.background.paper};
        }
        `,
      }),
    ]);

    if (!transformedElement) {
      return; // An unexpected error occurred
    }

    Array.from(shadowRoot.children).forEach(child =>
      shadowRoot.removeChild(child),
    );
    shadowRoot.appendChild(transformedElement);

    // Post-render
    transformer(shadowRoot.children[0], [
      dom => {
        setTimeout(() => {
          if (window.location.hash) {
            const hash = window.location.hash.slice(1);
            shadowRoot?.getElementById(hash)?.scrollIntoView();
          }
        }, 200);
        return dom;
      },
      addLinkClickListener({
        onClick: (_: MouseEvent, url: string) => {
          const parsedUrl = new URL(url);
          navigate(`${parsedUrl.pathname}${parsedUrl.hash}`);

          shadowRoot?.querySelector(parsedUrl.hash)?.scrollIntoView();
        },
      }),
      onCssReady({
        docStorageUrl: techdocsStorageApi.apiOrigin,
        onLoading: (dom: Element) => {
          (dom as HTMLElement).style.setProperty('opacity', '0');
        },
        onLoaded: (dom: Element) => {
          (dom as HTMLElement).style.removeProperty('opacity');
        },
      }),
    ]);
  }, [
    name,
    path,
    shadowRoot,
    value,
    error,
    loading,
    namespace,
    kind,
    entityId,
    navigate,
    techdocsStorageApi,
    theme,
  ]);

  if (error) {
    return <TechDocsNotFound />;
  }

  return (
    <>
      {loading ? <TechDocsProgressBar /> : null}
      <div ref={shadowDomRef} />
    </>
  );
};
