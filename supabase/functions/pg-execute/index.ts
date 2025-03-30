
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Admin key, so it may bypass RLS
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API SERVICE ROLE KEY - env var exported by default.
      // WARNING: The service key has admin privileges and should only be used in secure server environments!
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { sql_string } = await req.json()

    if (!sql_string) {
      return new Response(
        JSON.stringify({ error: 'SQL string is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate SQL for safety - block DROP statements, etc.
    const lowerSql = sql_string.toLowerCase()
    if (
      lowerSql.includes('drop table') || 
      lowerSql.includes('drop database') || 
      lowerSql.includes('delete from') || 
      lowerSql.includes('truncate') ||
      lowerSql.includes('alter database')
    ) {
      return new Response(
        JSON.stringify({ error: 'Potentially destructive SQL is not allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Execute the query using the special rpc function for superuser access
    // This requires the execute_sql function to be defined in your database
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
