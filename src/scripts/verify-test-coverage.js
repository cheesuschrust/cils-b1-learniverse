
#!/usr/bin/env node

/**
 * Test Coverage Verification Script
 * 
 * This script analyzes the codebase to ensure all components have corresponding test files.
 * It also generates a detailed report of test coverage.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

// Configuration
const SRC_DIR = path.resolve(__dirname, '../src');
const TEST_REPORT_PATH = path.resolve(__dirname, '../coverage-report.json');
const TEST_REPORT_HTML_PATH = path.resolve(__dirname, '../coverage-report.html');

// Component patterns to look for
const COMPONENT_PATTERNS = [
  '**/*.tsx',
  '!**/*.test.tsx',
  '!**/*.spec.tsx',
  '!**/*.d.tsx',
  '!**/node_modules/**'
];

// Test file patterns
const TEST_PATTERNS = [
  '**/*.test.tsx',
  '**/*.spec.tsx',
  '**/*.cy.tsx',
  '!**/node_modules/**'
];

// Utility functions
function findFiles(patterns, baseDir = SRC_DIR) {
  return patterns.reduce((files, pattern) => {
    const isNegated = pattern.startsWith('!');
    const actualPattern = isNegated ? pattern.slice(1) : pattern;
    
    const matches = glob.sync(actualPattern, { cwd: baseDir, absolute: true });
    
    if (isNegated) {
      return files.filter(file => !matches.includes(file));
    } else {
      return [...files, ...matches];
    }
  }, []);
}

function getComponentName(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  return basename;
}

function getExpectedTestPath(componentPath) {
  const dirname = path.dirname(componentPath);
  const basename = path.basename(componentPath, path.extname(componentPath));
  return path.join(dirname, `${basename}.test.tsx`);
}

function hasCorrespondingTest(componentPath, allTestPaths) {
  const expectedTestPath = getExpectedTestPath(componentPath);
  return allTestPaths.some(testPath => {
    return path.normalize(testPath) === path.normalize(expectedTestPath);
  });
}

function extractComponentInfo(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Determine if it's a React component
    const isReactComponent = /import React|from 'react'|from "react"|React\.FC/.test(content);
    
    // Check if it's a page component
    const isPage = filePath.includes('/pages/');
    
    // Extract props interface
    const propsMatch = content.match(/interface (\w+Props)/);
    const hasProps = !!propsMatch;
    
    // Check for hooks
    const hooksUsed = (content.match(/use[A-Z]\w+/g) || [])
      .filter(hook => hook !== 'useState' && hook !== 'useEffect')
      .filter((value, index, self) => self.indexOf(value) === index);
    
    // Check if it has state
    const hasState = content.includes('useState') || content.includes('useReducer');
    
    return {
      isReactComponent,
      isPage,
      hasProps,
      propsInterface: propsMatch ? propsMatch[1] : null,
      hooksUsed,
      hasState,
      complexity: calculateComplexity(content)
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error);
    return {
      isReactComponent: false,
      isPage: false,
      hasProps: false,
      propsInterface: null,
      hooksUsed: [],
      hasState: false,
      complexity: 0
    };
  }
}

function calculateComplexity(content) {
  // Simple complexity measure based on:
  // - Number of hooks
  // - Number of JSX elements
  // - Number of conditional renders
  // - Number of loop renders
  
  const hookCount = (content.match(/use[A-Z]\w+\(/g) || []).length;
  const jsxCount = (content.match(/<[A-Z][^>]*>/g) || []).length;
  const conditionalCount = (content.match(/\{.*\?.*:.*\}/g) || []).length;
  const mapCount = (content.match(/\.map\(/g) || []).length;
  
  return hookCount + jsxCount + conditionalCount * 2 + mapCount * 2;
}

// Main execution
function main() {
  console.log(chalk.bold('Analyzing component test coverage...'));
  
  // Find all component files
  const componentPaths = findFiles(COMPONENT_PATTERNS);
  console.log(`Found ${componentPaths.length} component files`);
  
  // Find all test files
  const testPaths = findFiles(TEST_PATTERNS);
  console.log(`Found ${testPaths.length} test files`);
  
  // Analyze coverage
  const results = componentPaths.map(componentPath => {
    const componentName = getComponentName(componentPath);
    const hasTest = hasCorrespondingTest(componentPath, testPaths);
    const info = extractComponentInfo(componentPath);
    const relativePath = path.relative(SRC_DIR, componentPath);
    
    return {
      name: componentName,
      path: relativePath,
      hasTest,
      ...info
    };
  });
  
  // Filter to just React components
  const reactComponents = results.filter(result => result.isReactComponent);
  
  // Calculate overall coverage
  const testedComponents = reactComponents.filter(comp => comp.hasTest);
  const coveragePercentage = (testedComponents.length / reactComponents.length) * 100;
  
  // Find untested components
  const untestedComponents = reactComponents.filter(comp => !comp.hasTest);
  
  // Sort by complexity (highest first)
  untestedComponents.sort((a, b) => b.complexity - a.complexity);
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalComponents: reactComponents.length,
      testedComponents: testedComponents.length,
      untestedComponents: untestedComponents.length,
      coveragePercentage: coveragePercentage.toFixed(2)
    },
    components: reactComponents,
    untestedComponentsByComplexity: untestedComponents
  };
  
  // Save report as JSON
  fs.writeFileSync(
    TEST_REPORT_PATH,
    JSON.stringify(report, null, 2)
  );
  
  // Generate HTML report
  const htmlReport = generateHtmlReport(report);
  fs.writeFileSync(TEST_REPORT_HTML_PATH, htmlReport);
  
  // Print summary
  console.log(chalk.bold('\nTest Coverage Summary:'));
  console.log(`Total Components: ${chalk.bold(reactComponents.length)}`);
  console.log(`Tested Components: ${chalk.bold(testedComponents.length)}`);
  console.log(`Untested Components: ${chalk.bold(untestedComponents.length)}`);
  console.log(`Coverage: ${chalk.bold(coveragePercentage.toFixed(2))}%`);
  
  if (untestedComponents.length > 0) {
    console.log(chalk.yellow('\nUntested Components (by complexity):'));
    untestedComponents.slice(0, 10).forEach(comp => {
      console.log(`- ${chalk.red(comp.name)} (${comp.path}) - Complexity: ${comp.complexity}`);
    });
    
    if (untestedComponents.length > 10) {
      console.log(chalk.yellow(`...and ${untestedComponents.length - 10} more`));
    }
    
    console.log(chalk.bold(`\nReports saved to:`));
    console.log(chalk.blue(`- JSON: ${TEST_REPORT_PATH}`));
    console.log(chalk.blue(`- HTML: ${TEST_REPORT_HTML_PATH}`));
    
    process.exit(1); // Exit with error if there are untested components
  } else {
    console.log(chalk.green('\n✅ All components have corresponding tests!'));
    process.exit(0);
  }
}

function generateHtmlReport(report) {
  const { summary, components, untestedComponentsByComplexity } = report;
  
  // Create HTML table of components
  const componentRows = components.map(comp => `
    <tr>
      <td>${comp.name}</td>
      <td>${comp.path}</td>
      <td>${comp.hasTest ? '✅' : '❌'}</td>
      <td>${comp.isPage ? 'Page' : 'Component'}</td>
      <td>${comp.hasState ? 'Yes' : 'No'}</td>
      <td>${comp.complexity}</td>
      <td>${comp.hooksUsed.join(', ') || '-'}</td>
    </tr>
  `).join('');
  
  // Create priority list of untested components
  const priorityRows = untestedComponentsByComplexity.map(comp => `
    <tr>
      <td>${comp.name}</td>
      <td>${comp.path}</td>
      <td>${comp.complexity}</td>
      <td>${comp.isPage ? 'High' : 'Medium'}</td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Component Test Coverage Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .summary {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
          text-align: center;
        }
        .summary-item {
          padding: 20px;
          background: #f5f5f5;
          border-radius: 5px;
          min-width: 150px;
        }
        .number {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .coverage-good { color: #2ecc71; }
        .coverage-warning { color: #f39c12; }
        .coverage-bad { color: #e74c3c; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .section {
          margin-bottom: 40px;
        }
        .section h2 {
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        .timestamp {
          text-align: center;
          color: #777;
          font-size: 0.9em;
          margin-top: 50px;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Component Test Coverage Report</h1>
      </header>
      
      <div class="summary">
        <div class="summary-item">
          <div class="number">${summary.totalComponents}</div>
          <div>Total Components</div>
        </div>
        <div class="summary-item">
          <div class="number">${summary.testedComponents}</div>
          <div>Tested Components</div>
        </div>
        <div class="summary-item">
          <div class="number">${summary.untestedComponents}</div>
          <div>Untested Components</div>
        </div>
        <div class="summary-item">
          <div class="number ${
            summary.coveragePercentage >= 90 ? 'coverage-good' : 
            summary.coveragePercentage >= 70 ? 'coverage-warning' : 
            'coverage-bad'
          }">${summary.coveragePercentage}%</div>
          <div>Test Coverage</div>
        </div>
      </div>
      
      ${untestedComponentsByComplexity.length > 0 ? `
        <div class="section">
          <h2>Priority Components to Test</h2>
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Path</th>
                <th>Complexity</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              ${priorityRows}
            </tbody>
          </table>
        </div>
      ` : ''}
      
      <div class="section">
        <h2>All Components</h2>
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Path</th>
              <th>Has Test</th>
              <th>Type</th>
              <th>Has State</th>
              <th>Complexity</th>
              <th>Custom Hooks</th>
            </tr>
          </thead>
          <tbody>
            ${componentRows}
          </tbody>
        </table>
      </div>
      
      <div class="timestamp">
        Report generated on: ${new Date().toLocaleString()}
      </div>
    </body>
    </html>
  `;
}

main();
