
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language, level } = await req.json();

    if (!text) {
      throw new Error("Text is required");
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    // Default to Italian if not specified
    const selectedLanguage = language || "italian";
    const proficiencyLevel = level || "intermediate";

    // Use OpenAI for grammar analysis
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a ${selectedLanguage} language teacher specializing in grammar analysis. 
            Analyze the following text for a ${proficiencyLevel} level student. 
            Provide a comprehensive analysis including:
            1. Grammar errors and corrections
            2. Vocabulary suggestions
            3. Overall assessment
            4. Score from 0 to 10
            
            Return the response as valid JSON with these fields:
            {
              "corrections": [{"original": "text with error", "suggested": "corrected text", "explanation": "why this is incorrect"}],
              "vocabularySuggestions": [{"original": "word/phrase", "suggested": "better alternative", "reason": "why this is better"}],
              "overallFeedback": "general feedback text",
              "score": number
            }`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Grammar analysis error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
