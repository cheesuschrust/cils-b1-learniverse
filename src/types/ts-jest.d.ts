
declare module 'ts-jest' {
  export function pathsToModuleNameMapper(
    paths: Record<string, string[]>,
    options: { prefix: string }
  ): Record<string, string>;
  
  export interface InitialOptionsTsJest {
    tsconfig?: string;
    isolatedModules?: boolean;
  }
}
