
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// supabase/functions/pg-execute/index.ts  
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';  
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { sql_string } = await req.json()
    
    if (!sql_string || typeof sql_string !== 'string') {
      return new Response(
        JSON.stringify({ error: 'SQL string is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Basic security check (prevent potentially dangerous operations)
    const dangerousOperations = /^\s*(DROP|TRUNCATE|DELETE\s+FROM|ALTER\s+TABLE|CREATE\s+TABLE|INSERT\s+INTO|UPDATE\s+.*?SET)/i;
    if (dangerousOperations.test(sql_string)) {
      return new Response(
        JSON.stringify({ error: 'Operation not permitted through this endpoint' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Create Supabase client with the Admin key, so it may bypass RLS
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API SERVICE ROLE KEY - env var exported by default.
      // WARNING: The service key has admin privileges and should only be used in secure server environments!
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Execute the query using the execute_sql function for secure execution
    // CRITICAL: Pass sql_query parameter (not sql_string) to match the DB function parameter name
    const { data, error } = await supabaseClient.rpc('execute_sql', {
      sql_query: sql_string
    })

    if (error) throw error

    return new Response(
      JSON.stringify({ result: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
