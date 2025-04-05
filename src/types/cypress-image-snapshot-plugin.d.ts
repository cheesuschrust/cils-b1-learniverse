
declare module 'cypress-image-snapshot/plugin' {
  export function addMatchImageSnapshotPlugin(
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions
  ): void;
}

// Add declaration for the command
declare namespace Cypress {
  interface Chainable {
    matchImageSnapshot(name?: string, options?: object): Chainable<Element>;
  }
}
