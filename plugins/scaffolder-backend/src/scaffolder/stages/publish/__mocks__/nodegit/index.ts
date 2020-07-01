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

const mockIndex = {
  addAll: jest.fn(),
  write: jest.fn(),
  writeTree: jest.fn().mockResolvedValue('mockoid'),
};

const mockRepo = {
  refreshIndex: jest.fn().mockResolvedValue(mockIndex),
  createCommit: jest.fn(),
};

const mockRemote = {
  push: jest.fn(),
};

const Repository = { init: jest.fn().mockResolvedValue(mockRepo) };
const Remote = { create: jest.fn().mockResolvedValue(mockRemote) };
const Signature = { now: jest.fn() };
const Cred = {
  userpassPlaintextNew: jest.fn(),
};

export { Repository, Remote, Signature, Cred };
