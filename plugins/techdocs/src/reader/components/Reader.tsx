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
import { useApi, configApiRef } from '@backstage/core';
import { useShadowDom } from '..';
import { useAsync } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsync';

import { useLocation, useParams, useNavigate } from 'react-router-dom';

import transformer, {
  addBaseUrl,
  rewriteDocLinks,
  addLinkClickListener,
  removeMkdocsHeader,
  modifyCss,
  onCssReady,
  sanitizeDOM,
} from '../transformers';
import URLFormatter from '../urlFormatter';
import { TechDocsNotFound } from './TechDocsNotFound';
import { TechDocsPageWrapper } from './TechDocsPageWrapper';

const useFetch = (url: string): AsyncState<string | Error> => {
  const state = useAsync(async () => {
    const request = await fetch(url);
    if (request.status === 404) {
      return [request.url, new Error('Page not found')];
    }
    const response = await request.text();
    return [request.url, response];
  }, [url]);

  const [fetchedUrl, fetchedValue] = state.value ?? [];

  if (url !== fetchedUrl) {
    // Fixes a race condition between two pages
    return { loading: true };
  }

  return Object.assign(state, fetchedValue ? { value: fetchedValue } : {});
};

const useEnforcedTrailingSlash = (): void => {
  React.useEffect(() => {
    const actualUrl = window.location.href;
    const expectedUrl = new URLFormatter(window.location.href).formatBaseURL();

    if (actualUrl !== expectedUrl) {
      window.history.replaceState({}, document.title, expectedUrl);
    }
  }, []);
};

export const Reader = () => {
  useEnforcedTrailingSlash();

  const docStorageUrl =
    useApi(configApiRef).getOptionalString('techdocs.storageUrl') ??
    'https://techdocs-mock-sites.storage.googleapis.com';

  const location = useLocation();
  const { componentId, '*': path } = useParams();
  const [shadowDomRef, shadowRoot] = useShadowDom();
  const navigate = useNavigate();
  const normalizedUrl = new URLFormatter(
    `${docStorageUrl}${location.pathname.replace('/docs', '')}`,
  ).formatBaseURL();
  const state = useFetch(`${normalizedUrl}index.html`);

  React.useEffect(() => {
    if (!shadowRoot) {
      return; // Shadow DOM isn't ready
    }

    if (state.loading) {
      return; // Page isn't ready
    }

    if (state.value instanceof Error) {
      return; // Docs not found
    }

    // Pre-render
    const transformedElement = transformer(state.value as string, [
      sanitizeDOM(),
      addBaseUrl({
        docStorageUrl,
        componentId,
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
        docStorageUrl,
        onLoading: (dom: Element) => {
          (dom as HTMLElement).style.setProperty('opacity', '0');
        },
        onLoaded: (dom: Element) => {
          (dom as HTMLElement).style.removeProperty('opacity');
        },
      }),
    ]);
  }, [componentId, path, shadowRoot, state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state.value instanceof Error) {
    return <TechDocsNotFound />;
  }

  return (
    <TechDocsPageWrapper title={componentId} subtitle={componentId}>
      <div ref={shadowDomRef} />
    </TechDocsPageWrapper>
  );
};
