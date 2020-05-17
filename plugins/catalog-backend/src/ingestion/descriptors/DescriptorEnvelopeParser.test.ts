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

import yaml from 'yaml';
import { unindent } from '../../util';
import { makeValidator } from '../../validation';
import { DescriptorEnvelopeParser } from './DescriptorEnvelopeParser';

describe('DescriptorEnvelopeParser', () => {
  let data: any;
  let parser: DescriptorEnvelopeParser;

  beforeEach(() => {
    data = yaml.parse(unindent`
      apiVersion: backstage.io/v1beta1
      kind: Component
      metadata:
        name: my-component-yay
        namespace: the-namespace
        labels:
          backstage.io/custom: ValueStuff
        annotations:
          example.com/bindings: are-secret
      spec:
        custom: stuff
    `);
    parser = new DescriptorEnvelopeParser(makeValidator());
  });

  it('works for the happy path', async () => {
    await expect(parser.parse(data)).resolves.toBe(data);
  });

  it('rejects bad apiVersion', async () => {
    data.apiVersion = 'a#b';
    await expect(parser.parse(data)).rejects.toThrow(/apiVersion/);
  });

  it('rejects bad kind', async () => {
    data.kind = 'a#b';
    await expect(parser.parse(data)).rejects.toThrow(/kind/);
  });

  it('accepts missing metadata', async () => {
    delete data.medatata;
    await expect(parser.parse(data)).resolves.toBe(data);
  });

  it('rejects non-object metadata', async () => {
    data.metadata = 7;
    await expect(parser.parse(data)).rejects.toThrow(/metadata/);
  });

  it('accepts missing spec', async () => {
    delete data.spec;
    await expect(parser.parse(data)).resolves.toBe(data);
  });

  it('rejects non-object spec', async () => {
    data.spec = 7;
    await expect(parser.parse(data)).rejects.toThrow(/spec/);
  });

  it('rejects bad name', async () => {
    data.metadata.name = 7;
    await expect(parser.parse(data)).rejects.toThrow(/name/);
  });

  it('rejects bad namespace', async () => {
    data.metadata.namespace = 7;
    await expect(parser.parse(data)).rejects.toThrow(/namespace/);
  });

  it('rejects bad label key', async () => {
    data.metadata.labels['a#b'] = 'value';
    await expect(parser.parse(data)).rejects.toThrow(/label.*key/i);
  });

  it('rejects bad label value', async () => {
    data.metadata.labels.a = 'a#b';
    await expect(parser.parse(data)).rejects.toThrow(/label.*value/i);
  });

  it('rejects bad annotation key', async () => {
    data.metadata.annotations['a#b'] = 'value';
    await expect(parser.parse(data)).rejects.toThrow(/annotation.*key/i);
  });

  it('rejects bad annotation value', async () => {
    data.metadata.annotations.a = [];
    await expect(parser.parse(data)).rejects.toThrow(/annotation.*value/i);
  });
});
