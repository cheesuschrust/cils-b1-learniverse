
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define topic templates for each difficulty level
const topicTemplates = {
  greetings: {
    beginner: "Basic greetings, introductions, asking and telling names",
    intermediate: "Formal introductions, describing yourself and your background",
    advanced: "In-depth cultural differences in greetings, regional variations in Italy"
  },
  family: {
    beginner: "Basic family members, describing your family structure",
    intermediate: "Extended family relationships, family traditions and events",
    advanced: "Modern family dynamics, changing family structures in contemporary society"
  },
  food: {
    beginner: "Basic food items, ordering in a restaurant, expressing preferences",
    intermediate: "Regional Italian cuisines, describing recipes, food traditions",
    advanced: "Food culture, sustainable eating, modern dietary trends in Italy"
  },
  travel: {
    beginner: "Basic transportation, asking for directions, booking accommodations",
    intermediate: "Planning itineraries, describing travel experiences, regional travel in Italy",
    advanced: "Cultural tourism, sustainable travel, comparing transportation systems"
  },
  work: {
    beginner: "Basic job descriptions, workplace vocabulary, daily routines",
    intermediate: "Job interviews, career development, workplace culture",
    advanced: "Remote work trends, work-life balance, professional networking in Italy"
  },
  education: {
    beginner: "School subjects, classroom vocabulary, schedules",
    intermediate: "University education, comparing education systems, learning approaches",
    advanced: "Educational reform, lifelong learning, digital education in Italy"
  },
  health: {
    beginner: "Body parts, common illnesses, doctor's appointments",
    intermediate: "Healthcare system, wellness routines, describing symptoms",
    advanced: "Public health issues, mental health awareness, healthcare innovations"
  },
  culture: {
    beginner: "Basic Italian holidays, famous landmarks, popular traditions",
    intermediate: "Regional festivals, Italian art and music, cultural practices",
    advanced: "Cultural identity, historical influences on Italian culture, cultural preservation"
  },
  current_events: {
    beginner: "Basic news vocabulary, simple current events in Italy",
    intermediate: "Discussing news topics, expressing opinions on current issues",
    advanced: "Critical analysis of news, complex sociopolitical issues in Italy"
  },
  environment: {
    beginner: "Nature vocabulary, weather, basic environmental concerns",
    intermediate: "Climate change effects, recycling practices, sustainability",
    advanced: "Environmental policy, conservation efforts, innovative green solutions in Italy"
  },
  technology: {
    beginner: "Basic tech vocabulary, everyday technology use",
    intermediate: "Digital services, social media impact, tech in education",
    advanced: "Technological innovation, AI ethics, Italy's tech industry development"
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, difficulty, user_id } = await req.json();
    
    if (!topic || !difficulty) {
      throw new Error('Topic and difficulty are required');
    }

    let prompt: string;
    let translation: string;

    // Check if we can use OpenAI API for generating a custom prompt
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (openAIApiKey) {
      const topicInfo = topicTemplates[topic as keyof typeof topicTemplates] || 
                        topicTemplates.greetings;
                        
      const difficultyLevel = topicInfo[difficulty as keyof typeof topicInfo] || 
                              topicInfo.beginner;

      // Generate a custom prompt using OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that generates Italian language speaking prompts for language learners. 
              Create a speaking prompt about ${difficultyLevel} at the ${difficulty} level. 
              First, generate the prompt in Italian. Then, provide an English translation.
              The prompt should be appropriate for a CILS exam preparation and suitable for a ${difficulty} level student.
              Do not include any explanation or introduction - just the Italian prompt as the first line and the English translation as the second line.`
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt from OpenAI');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Split the content into Italian and English parts
      const parts = content.split('\n').filter((line: string) => line.trim());
      if (parts.length >= 2) {
        [prompt, translation] = parts;
      } else {
        // Fallback to hardcoded prompts if the format is unexpected
        throw new Error('Unexpected format from OpenAI');
      }
    } else {
      // Use fallback static prompts
      throw new Error('OpenAI API key not configured');
    }

    // Track the prompt generation in the database if user_id is provided
    if (user_id) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseServiceKey) {
        try {
          await fetch(`${supabaseUrl}/rest/v1/user_activity_logs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey
            },
            body: JSON.stringify({
              user_id,
              activity_type: 'speaking_prompt_generation',
              details: {
                topic,
                difficulty,
                timestamp: new Date().toISOString()
              }
            })
          });
        } catch (error) {
          console.error('Error logging activity:', error);
          // Continue execution even if logging fails
        }
      }
    }

    return new Response(
      JSON.stringify({ prompt, translation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating speaking prompt:', error);
    
    // Return a fallback prompt based on the topic and difficulty
    return new Response(
      JSON.stringify({ 
        error: error.message,
        prompt: "Mi puoi parlare della tua famiglia?", 
        translation: "Can you tell me about your family?" 
      }),
      { 
        status: 200, // Return 200 with fallback content
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
