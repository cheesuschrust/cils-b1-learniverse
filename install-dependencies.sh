#!/bin/bash
# Clean install
rm -rf node_modules
rm -f package-lock.json
# Install core dependencies
npm install
# Install essential packages
npm install react-router-dom@6.22.3 lucide-react @radix-ui/react-slot class-variance-authority tailwind-merge clsx
# Install UI components
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-label
npm install @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-popover
npm install @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-tabs
npm install @radix-ui/react-tooltip @hookform/resolvers zod react-hook-form
# Install other essentials
npm install date-fns uuid @supabase/supabase-js
# Development dependencies
npm install --save-dev typescript @types/react @types/react-dom @types/node
