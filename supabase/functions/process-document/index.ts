
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentContent, documentType, userId, includeInTraining } = await req.json();

    if (!documentContent) {
      throw new Error("Document content is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Analyze content type using OpenAI
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    // First, analyze the content type if not provided
    let contentType = documentType;
    if (!contentType) {
      const analysisResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
              content: `You are an AI system that categorizes Italian language learning content.
              Analyze the provided text and determine its type from these options:
              - "flashcards" (vocabulary terms with definitions)
              - "multiple-choice" (questions with options)
              - "writing" (essay or writing prompt)
              - "speaking" (pronunciation or conversation practice)
              - "listening" (audio transcript or listening exercise)
              - "reading" (reading comprehension passage)
              - "grammar" (grammar rules or exercises)
              - "citizenship" (content related to Italian citizenship)
              
              Also determine the difficulty level: "beginner", "intermediate", or "advanced".
              
              Return the response as valid JSON with these fields:
              {
                "contentType": string (one of the options above),
                "difficultyLevel": string (beginner/intermediate/advanced),
                "confidence": number (0-1),
                "topicsDetected": array of strings,
                "languageDetected": string (italian/english/mixed)
              }`
            },
            {
              role: "user",
              content: documentContent
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error(`Content analysis failed: ${analysisResponse.statusText}`);
      }

      const analysisData = await analysisResponse.json();
      const analysis = JSON.parse(analysisData.choices[0].message.content);
      contentType = analysis.contentType;

      // Store the document metadata
      const { data: metaData, error: metaError } = await supabase
        .from("learning_content")
        .insert({
          title: `Uploaded ${contentType} content`,
          content_type: contentType,
          difficulty: analysis.difficultyLevel,
          tags: analysis.topicsDetected,
          created_by: userId,
          content: {
            raw: documentContent,
            analysis: analysis,
            processed: true
          }
        })
        .select()
        .single();

      if (metaError) {
        throw new Error(`Failed to store document metadata: ${metaError.message}`);
      }

      // If user requested to include this in training data
      if (includeInTraining) {
        const { error: trainingError } = await supabase
          .from("ai_training_data")
          .insert({
            input_text: documentContent,
            expected_output: "", // Will be filled by AI team or admin
            content_type: contentType,
            difficulty: analysis.difficultyLevel,
            language: analysis.languageDetected,
            created_by: userId
          });

        if (trainingError) {
          console.error("Failed to store training data:", trainingError);
        }
      }

      // Generate questions from the content
      const questionsResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
              content: `You are an Italian language education expert. 
              Based on the following ${contentType} content at ${analysis.difficultyLevel} level,
              generate 5 appropriate questions to test understanding.
              
              If the content is:
              - flashcards: Create vocabulary recall questions
              - multiple-choice: Create additional multiple choice questions
              - writing/speaking: Create prompt questions
              - reading/listening: Create comprehension questions
              - grammar: Create grammar practice questions
              - citizenship: Create citizenship test questions
              
              Return the response as valid JSON with this structure:
              {
                "questions": [
                  {
                    "text": "question text",
                    "type": "multiple-choice|open-ended|true-false",
                    "options": ["option1", "option2", "option3", "option4"], (if multiple-choice)
                    "correctAnswer": "correct answer",
                    "explanation": "explanation of the answer"
                  }
                ]
              }`
            },
            {
              role: "user",
              content: documentContent
            }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        }),
      });

      if (!questionsResponse.ok) {
        throw new Error(`Question generation failed: ${questionsResponse.statusText}`);
      }

      const questionsData = await questionsResponse.json();
      const generatedQuestions = JSON.parse(questionsData.choices[0].message.content);

      // Update the learning content with generated questions
      const { error: updateError } = await supabase
        .from("learning_content")
        .update({
          content: {
            ...metaData.content,
            generatedQuestions: generatedQuestions.questions
          }
        })
        .eq("id", metaData.id);

      if (updateError) {
        console.error("Failed to update content with questions:", updateError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          contentId: metaData.id,
          contentType: contentType,
          analysis: analysis,
          questions: generatedQuestions.questions
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Document processing error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
