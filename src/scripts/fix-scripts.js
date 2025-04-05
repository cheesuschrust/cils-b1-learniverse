
#!/usr/bin/env node

/**
 * Script to ensure package.json has the correct scripts
 */
const fs = require('fs');
const path = require('path');

// Path to package.json
const packageJsonPath = path.resolve(__dirname, '../../package.json');

try {
  // Read the package.json file
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Update the scripts section
  packageJson.scripts = {
    ...packageJson.scripts,
    dev: 'vite',
    build: 'vite build',
    preview: 'vite preview',
    test: 'jest',
    lint: 'eslint src --ext ts,tsx',
    "type-check": "tsc --noEmit"
  };

  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log('✅ Successfully updated scripts in package.json');
} catch (error) {
  console.error('Error updating package.json:', error);
  process.exit(1);
}
