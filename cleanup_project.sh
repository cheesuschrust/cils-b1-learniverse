#!/bin/bash  
# cleanup_project.sh  

# Remove node_modules and reinstall  
rm -rf node_modules  
rm package-lock.json  
npm cache clean --force  
npm install  

# Update TypeScript and type definitions  
npm install --save-dev typescript @types/react @types/node  

# Generate fresh tsconfig.json  
npx tsc --init  
