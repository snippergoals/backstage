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

export type PluginInfo = {
  id: string;
  name: string;
};

export type TemplateFile = {
  // Relative path within the target directory
  targetPath: string;
  // Contents of the compiled template file
  templateContents: string;
} & (
  | {
      // Whether the template file exists in the target directory
      targetExists: true;
      // Contents of the file in the target directory, if it exists
      targetContents: string;
    }
  | {
      // Whether the template file exists in the target directory
      targetExists: false;
    }
);

export type PromptFunc = (msg: string) => Promise<boolean>;

export type HandlerFunc = (
  file: TemplateFile,
  prompt: PromptFunc,
) => Promise<void>;

export type FileHandler = {
  patterns: Array<string | RegExp>;
  handler: HandlerFunc;
};
