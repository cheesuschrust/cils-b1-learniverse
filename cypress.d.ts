import { mount } from 'cypress/react'
import { MountOptions, MountReturn } from 'cypress/react'

declare global {
  namespace Cypress {
    interface Chainable {
      // Custom commands
      login(email: string, password: string): Chainable<Element>
      loginAsAdmin(): Chainable<Element>
      checkAllLinks(): Chainable<Element>
      checkAccessibility(options?: any): Chainable<Element>
      tab(): Chainable<JQuery<HTMLElement>>
      captureAndCompare(name: string): Chainable<Element>
      testKeyboardNavigation(): Chainable<Element>
      testFormValidation(formSelector: string): Chainable<Element>
      // From cypress-image-snapshot
      matchImageSnapshot(name?: string, options?: object): Chainable<Element>
      // From cypress-axe
      injectAxe(): Chainable<Element>
      checkA11y(options?: any): Chainable<Element>
      // For component testing
      mount: typeof mount
    }
  }
}
