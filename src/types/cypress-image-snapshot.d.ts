
declare module 'cypress-image-snapshot/command' {
  export function addMatchImageSnapshotCommand(options?: any): void;
}

declare module 'cypress-image-snapshot/plugin' {
  export function addMatchImageSnapshotPlugin(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): void;
}
