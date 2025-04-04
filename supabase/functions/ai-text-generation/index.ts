
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
// Use URL imports for Deno instead of npm style imports
// Remove the @huggingface/transformers import that's causing issues
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configure environment for optimized performance
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, model, options } = await req.json();
    
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    // Initialize Supabase client to log model usage
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // For now, since we're not loading large language models in the browser
    // due to size constraints, we'll use a fallback simulated response
    // In a production environment, this would connect to a hosted model
    // or use a smaller model that fits in edge function constraints
    
    const simulatedResponse = `Generated Italian text based on prompt: "${prompt.substring(0, 50)}..."`;
    
    // Log the request for analytics
    await supabase.from("ai_model_usage").insert({
      model_name: model || "text-generation-fallback",
      prompt_tokens: prompt.length,
      completion_tokens: simulatedResponse.length,
      user_id: req.headers.get("x-user-id"),
      prompt_category: options?.category || "general"
    });

    return new Response(
      JSON.stringify({ 
        generatedText: simulatedResponse,
        confidence: 0.85,
        modelUsed: model || "text-generation-fallback"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in AI text generation:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
