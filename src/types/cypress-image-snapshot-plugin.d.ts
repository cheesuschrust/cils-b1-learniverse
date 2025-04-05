
declare module 'cypress-image-snapshot/plugin' {
  export function addMatchImageSnapshotPlugin(
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions
  ): void;
}
