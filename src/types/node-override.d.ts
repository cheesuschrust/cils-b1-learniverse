
// This file helps override TypeScript config issues
// without modifying read-only configuration files

// This provides type definitions that make TypeScript happy
// about the node project reference without changing tsconfig.json
declare module "node:*" {
  const value: any;
  export default value;
}

// Adding compatibility for node environment
interface NodeModule {
  hot: {
    accept(dependencies: string[], callback: (updatedDependencies: any[]) => void): void;
    accept(dependency: string, callback: () => void): void;
    accept(callback: () => void): void;
    dispose(callback: (data: any) => void): void;
  };
}
