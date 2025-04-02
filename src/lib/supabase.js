
// This file is now deprecated, import from supabase-client.ts instead
import { supabase } from './supabase-client';

// Re-export the supabase client for backward compatibility
export { supabase };

console.warn(
  'Warning: This file (supabase.js) is deprecated. ' + 
  'Import from "src/lib/supabase-client.ts" instead.'
);
