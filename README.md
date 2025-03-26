
# Italian Language Learning App - Testing Suite

This project contains a comprehensive testing suite for an Italian language learning application built with React. The testing suite is designed to ensure 100% functional coverage of the application, including all components, features, and user interactions.

## Technology Stack

- Framework: React
- Testing Libraries:
  - Jest and React Testing Library for component testing
  - Cypress for end-to-end testing
  - axe-core for accessibility testing
  - Cypress Image Snapshot for visual regression testing

## Test Types

### Unit Tests

Unit tests are located in files with the `.test.tsx` or `.test.ts` suffix and focus on testing individual components, hooks, and utility functions in isolation.

### Component Tests

Component tests use React Testing Library to test the rendering and behavior of UI components in a simulated DOM environment.

### Integration Tests

Integration tests verify that multiple components work together correctly and that data flows properly between them.

### End-to-End Tests

Cypress end-to-end tests simulate real user interactions with the application and test complete user flows. These tests are located in the `cypress/e2e` directory.

## Running Tests

### Unit and Component Tests

To run Jest tests:

```bash
npm test
```

To run tests with coverage:

```bash
npm test -- --coverage
```

### End-to-End Tests

To open Cypress test runner:

```bash
npm run cypress:open
```

To run Cypress tests in headless mode:

```bash
npm run cypress:run
```

## Test Coverage

The testing suite aims for 100% functional coverage, testing:

1. All application routes and pages
2. All interactive elements (buttons, forms, links, etc.)
3. All features (authentication, exercises, settings, etc.)
4. Data management (loading states, error states, persistence)
5. Edge cases and error handling
6. Accessibility compliance

## Test Documentation

### Coverage Map

The test coverage map is generated automatically when running tests with the coverage flag. The HTML report can be found in the `coverage` directory after running:

```bash
npm test -- --coverage
```

### Test Reports

Cypress generates test reports after each run, including:
- Test execution results
- Screenshots for failed tests
- Videos of test runs (when enabled)
- Performance metrics

## Continuous Integration

The testing suite is integrated with CI/CD workflows:

1. Pre-commit hooks run linting and unit tests
2. Pull requests trigger full test suites
3. Scheduled full regression tests run daily

## Accessibility Testing

Accessibility tests verify:
- Keyboard navigation
- ARIA attributes
- Screen reader compatibility
- Color contrast compliance
- Focus management

## Visual Regression Testing

Visual regression tests use Cypress Image Snapshot to capture and compare screenshots, ensuring UI consistency across releases.

## Contributing

When adding new features or modifying existing ones, please include appropriate tests. The goal is to maintain 100% test coverage.

1. For new components, add unit tests with `.test.tsx` suffix
2. For new pages or features, add Cypress E2E tests in the `cypress/e2e` directory
3. For UI changes, update visual regression tests if needed

## License

This testing suite is part of the Italian Language Learning App and is subject to the same license as the main application.
