
/**
 * This file provides type definitions to work around the TypeScript configuration issue
 * with the "emit" property in tsconfig.node.json without modifying read-only files.
 */

// Define types for the node project reference to avoid the emit error
declare module 'vite/node' {
  const content: any;
  export default content;
}

// Define the NodeModule interface to satisfy the hot module replacement types
interface NodeModule {
  hot: {
    accept(dependencies: string[], callback: (updatedDependencies: any[]) => void): void;
    accept(dependency: string, callback: () => void): void;
    accept(callback: () => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

// Provide explicit compatibility for node imports
declare module "node:*" {
  const value: any;
  export default value;
}
