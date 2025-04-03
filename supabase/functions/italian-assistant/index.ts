
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Types for message history
interface MessageHistory {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history, context, level } = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    // Format chat history for OpenAI
    const formattedHistory = history?.map((msg: MessageHistory) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })) || [];

    // Build the system prompt based on the context and level
    const systemPrompt = `
      You are an Italian language tutor named Lucia, specializing in helping people learn Italian ${context ? `for ${context}` : 'for general purposes'}.
      The student's level is ${level || 'intermediate'}.
      
      Please follow these guidelines:
      1. Always respond in Italian, using simple language appropriate for their level.
      2. If they're struggling, you can insert very brief English clarifications in parentheses.
      3. When teaching grammar or vocabulary, provide clear examples and explanations.
      4. Focus on practical, conversational Italian that would be useful for ${context || 'daily life'}.
      5. Be encouraging and supportive, praising their efforts.
      6. Answer questions about Italian citizenship test topics if asked.
      7. For beginners, use very simple sentences and basic vocabulary.
      8. For intermediate learners, gradually introduce more complex structures.
      9. For advanced learners, have sophisticated conversations while still correcting errors.
      
      Your responses should be concise and helpful, with an emphasis on natural, practical language.
    `;

    // Create messages array for OpenAI API
    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        response: assistantResponse,
        meta: {
          model: "gpt-4o-mini",
          tokens: data.usage
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Italian assistant error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
