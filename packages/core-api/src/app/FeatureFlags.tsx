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

import {
  FeatureFlagState,
  FeatureFlagsApi,
  FeatureFlag,
} from '../apis/definitions';

/**
 * Helper method for validating compatibility and flag name.
 */
export function validateBrowserCompat(): void {
  if (!('localStorage' in window)) {
    throw new Error(
      'Feature Flags are not supported on browsers without the Local Storage API',
    );
  }
}

export function validateFlagName(name: string): void {
  if (name.length < 3) {
    throw new Error(
      `The '${name}' feature flag must have a minimum length of three characters.`,
    );
  }

  if (name.length > 150) {
    throw new Error(
      `The '${name}' feature flag must not exceed 150 characters.`,
    );
  }

  if (!name.match(/^[a-z]+[a-z0-9-]+$/)) {
    throw new Error(
      `The '${name}' feature flag must start with a lowercase letter and only contain lowercase letters, numbers and hyphens. ` +
        'Examples: feature-flag-one, alpha, release-2020',
    );
  }
}

/**
 * The UserFlags class.
 *
 * This acts as a data structure for the user's feature flags. You
 * can use this to retrieve, add, edit, delete, clear and save the user's
 * feature flags to the local browser for persisted storage.
 */
export class UserFlags extends Map<string, FeatureFlagState> {
  static load(): UserFlags {
    validateBrowserCompat();

    try {
      const jsonString = window.localStorage.getItem('featureFlags') as string;
      const json = JSON.parse(jsonString);
      return new this(Object.entries(json));
    } catch (err) {
      return new this([]);
    }
  }

  get(name: string): FeatureFlagState {
    return super.get(name) || FeatureFlagState.Off;
  }

  set(name: string, state: FeatureFlagState): this {
    validateFlagName(name);
    const output = super.set(name, state);
    this.save();
    return output;
  }

  toggle(name: string): FeatureFlagState {
    if (super.get(name) === FeatureFlagState.On) {
      super.set(name, FeatureFlagState.Off);
    } else {
      super.set(name, FeatureFlagState.On);
    }
    return super.get(name) || FeatureFlagState.Off;
  }

  delete(name: string): boolean {
    const output = super.delete(name);
    this.save();
    return output;
  }

  clear(): void {
    super.clear();
    this.save();
  }

  save(): void {
    window.localStorage.setItem(
      'featureFlags',
      JSON.stringify(this.toObject()),
    );
  }

  toObject() {
    return Array.from(this.entries()).reduce(
      (obj, [key, value]) => ({ ...obj, [key]: value }),
      {},
    );
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  toString() {
    return this.toJSON();
  }
}

/**
 * Create the FeatureFlags implementation based on the API.
 */
export class FeatureFlags implements FeatureFlagsApi {
  private registeredFeatureFlags: FeatureFlag[] = [];
  private userFlags: UserFlags | undefined;

  registerFlag(flag: FeatureFlag) {
    validateFlagName(flag.name);
    this.registeredFeatureFlags.push(flag);
  }

  getRegisteredFlags(): FeatureFlag[] {
    return this.registeredFeatureFlags.slice();
  }

  getFlags(): UserFlags {
    if (!this.userFlags) this.userFlags = UserFlags.load();
    return this.userFlags;
  }
}
