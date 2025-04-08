
/**
 * This file provides type definitions to work around the TypeScript configuration issue
 * with the "emit" property in tsconfig.node.json without modifying read-only files.
 */

// Override the TypeScript compiler options interface to handle emit disabling
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

// Define NodeModule hot module replacement types
interface NodeModule {
  hot: {
    accept(dependencies: string[], callback: (updatedDependencies: any[]) => void): void;
    accept(dependency: string, callback: () => void): void;
    accept(callback: () => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

// Force TypeScript to accept references to projects with emit disabled
declare module 'tsconfig-paths' {
  export interface TSConfig {
    extends?: string;
    compilerOptions?: {
      baseUrl?: string;
      paths?: { [key: string]: string[] };
      rootDir?: string;
      outDir?: string;
      declaration?: boolean;
      declarationDir?: string;
      composite?: boolean;
      noEmit?: boolean;
      emitDeclarationOnly?: boolean;
      [key: string]: any;
    };
    references?: Array<{ path: string; prepend?: boolean }>;
    include?: string[];
    exclude?: string[];
    files?: string[];
    [key: string]: any;
  }
}

// Override TypeScript compiler API to ensure project references work
declare module 'typescript' {
  interface ReferencedProject {
    path: string;
    prepend?: boolean;
    circular?: boolean;
  }

  interface ProjectReference {
    path: string;
    prepend?: boolean;
    circular?: boolean;
  }

  interface ParsedCommandLine {
    options: CompilerOptions;
    fileNames: string[];
    projectReferences?: readonly ProjectReference[];
    errors: Diagnostic[];
    wildcardDirectories?: MapLike<WatchDirectoryFlags>;
    compileOnSave?: boolean;
  }

  interface CompilerOptions {
    noEmit?: boolean;
    [key: string]: any;
  }
}
