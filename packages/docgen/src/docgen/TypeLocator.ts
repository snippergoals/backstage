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

import ts from 'typescript';
import { ExportedInstance } from './types';

/**
 * The TypeLocator is used to extract typescrint Type structures from a compiled program,
 * as well as finding locations where types are used in according to a matching pattern.
 *
 * This is used to e.g. find exported APIs that we should generate documentation for.
 */
export default class TypeLocator {
  private readonly checker: ts.TypeChecker;
  private readonly program: ts.Program;

  static fromProgram(program: ts.Program) {
    return new TypeLocator(program.getTypeChecker(), program);
  }

  constructor(checker: ts.TypeChecker, program: ts.Program) {
    this.checker = checker;
    this.program = program;
  }

  getExportedType(path: string, exportedName: string = 'default'): ts.Type {
    const source = this.program.getSourceFile(path);
    if (!source) {
      throw new Error(`Source not found for path '${path}'`);
    }
    const exported = this.checker.getExportsOfModule(
      this.checker.getSymbolAtLocation(source)!,
    );
    const [symbol] = exported.filter(e => e.name === exportedName);
    if (!symbol) {
      throw new Error(`No export '${exportedName}' found in ${path}`);
    }
    const type = this.checker.getTypeOfSymbolAtLocation(symbol, source);
    return type;
  }

  findExportedInstances<T extends string>(
    typeLookupTable: { [key in T]: ts.Type },
  ): { [key in T]: ExportedInstance[] } {
    const docMap = new Map<ts.Type, ExportedInstance[]>();
    for (const type of Object.values<ts.Type>(typeLookupTable)) {
      docMap.set(type, []);
    }

    this.program.getSourceFiles().forEach(source => {
      ts.forEachChild(source, node => {
        const decl = this.getExportedConstructorDeclaration(node);
        if (!decl || !docMap.has(decl.constructorType)) {
          return;
        }

        docMap.get(decl.constructorType)!.push({
          node,
          name: decl.name,
          source,
          args: Array.from(decl.initializer.arguments || []),
          typeArgs: Array.from(decl.initializer.typeArguments || []),
        });
      });
    });

    const result: { [key in T]?: ExportedInstance[] } = {};

    for (const key in typeLookupTable) {
      if (typeLookupTable.hasOwnProperty(key)) {
        const type = typeLookupTable[key];
        result[key] = docMap.get(type)!;
      }
    }

    return result as { [key in T]: ExportedInstance[] };
  }

  private getExportedConstructorDeclaration(
    node: ts.Node,
  ):
    | { constructorType: ts.Type; initializer: ts.NewExpression; name: string }
    | undefined {
    if (!ts.isVariableStatement(node)) {
      return;
    }
    if (
      !node.modifiers ||
      !node.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      return;
    }
    const { declarations } = node.declarationList;
    if (declarations.length !== 1) {
      return;
    }

    const [declaration] = declarations;
    const { initializer, name } = declaration;

    if (!initializer || !name) {
      return;
    }
    if (!ts.isNewExpression(initializer)) {
      return;
    }
    if (!ts.isIdentifier(name)) {
      return;
    }

    const constructorType = this.checker.getTypeAtLocation(
      initializer.expression,
    );
    return { constructorType, initializer, name: name.text };
  }
}
