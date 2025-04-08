// This fixes the emit issue in tsconfig.node.json
declare module "node:*" {
  const value: any;
  export default value;
}

interface NodeModule {
  hot: {
    accept(dependencies: string[], callback: (updatedDependencies: any[]) => void): void;
    accept(dependency: string, callback: () => void): void;
    accept(callback: () => void): void;
    dispose(callback: (data: any) => void): void;
  };
}
