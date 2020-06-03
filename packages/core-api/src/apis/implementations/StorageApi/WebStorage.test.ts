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
import { WebStorage } from './WebStorage';
describe('WebStorage Storage API', () => {
  it('should return undefined for values which are unset', async () => {
    const storage = new WebStorage();

    expect(storage.get('myfakekey')).toBeUndefined();
  });

  it('should allow the setting and getting of the simple data structures', async () => {
    const storage = new WebStorage();

    await storage.set('myfakekey', 'helloimastring');
    await storage.set('mysecondfakekey', 1234);
    await storage.set('mythirdfakekey', true);
    expect(storage.get('myfakekey')).toBe('helloimastring');
    expect(storage.get('mysecondfakekey')).toBe(1234);
    expect(storage.get('mythirdfakekey')).toBe(true);
  });

  it('should allow setting of complex datastructures', async () => {
    const storage = new WebStorage();

    const mockData = {
      something: 'here',
      is: [{ super: { complex: [{ but: 'something', why: true }] } }],
    };

    await storage.set('myfakekey', mockData);

    expect(storage.get('myfakekey')).toEqual(mockData);
  });

  it('should subscribe to key changes when setting a new value', async () => {
    const storage = new WebStorage();

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();
    const mockData = { hello: 'im a great new value' };

    await new Promise(resolve => {
      storage.observe$('correctKey').subscribe({
        next: (...args) => {
          selectedKeyNextHandler(...args);
          resolve();
        },
      });

      storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

      storage.set('correctKey', mockData);
    });

    expect(wrongKeyNextHandler).not.toHaveBeenCalled();
    expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'correctKey',
      newValue: mockData,
    });
  });

  it('should subscribe to key changes when deleting a value', async () => {
    const storage = new WebStorage();

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();
    const mockData = { hello: 'im a great new value' };

    storage.set('correctKey', mockData);

    await new Promise(resolve => {
      storage.observe$('correctKey').subscribe({
        next: (...args) => {
          selectedKeyNextHandler(...args);
          resolve();
        },
      });

      storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

      storage.remove('correctKey');
    });

    expect(wrongKeyNextHandler).not.toHaveBeenCalled();
    expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'correctKey',
      newValue: undefined,
    });
  });

  it('should be able to create different buckets for different uses', async () => {
    const rootStorage = new WebStorage();

    const firstStorage = rootStorage.forBucket('userSettings');
    const secondStorage = rootStorage.forBucket('profileSettings');
    const keyName = 'blobby';

    await firstStorage.set(keyName, 'boop');
    await secondStorage.set(keyName, 'deerp');

    expect(firstStorage.get(keyName)).not.toBe(secondStorage.get(keyName));
    expect(firstStorage.get(keyName)).toBe('boop');
    expect(secondStorage.get(keyName)).toBe('deerp');
  });
});
