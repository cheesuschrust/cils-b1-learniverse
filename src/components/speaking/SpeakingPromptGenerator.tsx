
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, Mic, Volume2 } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

interface PromptTopic {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const TOPICS: PromptTopic[] = [
  { id: 'greetings', name: 'Greetings and Introductions', difficulty: 'beginner' },
  { id: 'family', name: 'Family and Friends', difficulty: 'beginner' },
  { id: 'hobbies', name: 'Hobbies and Free Time', difficulty: 'beginner' },
  { id: 'food', name: 'Food and Restaurants', difficulty: 'beginner' },
  { id: 'travel', name: 'Travel and Transportation', difficulty: 'intermediate' },
  { id: 'work', name: 'Work and Career', difficulty: 'intermediate' },
  { id: 'education', name: 'Education and Learning', difficulty: 'intermediate' },
  { id: 'health', name: 'Health and Wellness', difficulty: 'intermediate' },
  { id: 'culture', name: 'Italian Culture and Traditions', difficulty: 'advanced' },
  { id: 'current_events', name: 'Current Events and News', difficulty: 'advanced' },
  { id: 'environment', name: 'Environment and Sustainability', difficulty: 'advanced' },
  { id: 'technology', name: 'Technology and Innovation', difficulty: 'advanced' },
];

interface SpeakingPromptGeneratorProps {
  onPromptSelected?: (prompt: { text: string; translation: string; }) => void;
  isPremium?: boolean;
}

const SpeakingPromptGenerator: React.FC<SpeakingPromptGeneratorProps> = ({ 
  onPromptSelected,
  isPremium = false
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('greetings');
  const [difficulty, setDifficulty] = useState<string>('beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState<{ text: string; translation: string; } | null>(null);
  const { speakText, isSpeaking } = useTTS();
  const { toast } = useToast();
  const { user } = useAuth();

  // Filter topics by difficulty
  const filteredTopics = TOPICS.filter(topic => 
    difficulty === 'all' || topic.difficulty === difficulty
  );

  const generatePrompt = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate speaking prompts.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setPrompt(null);
    
    try {
      // Try to fetch from edge function
      const { data, error } = await supabase.functions.invoke('ai-speaking-prompt', {
        body: {
          topic: selectedTopic,
          difficulty: difficulty,
          user_id: user.id
        }
      });
      
      if (error) throw error;
      
      if (data && data.prompt && data.translation) {
        setPrompt({
          text: data.prompt,
          translation: data.translation
        });
        
        // Call callback if provided
        if (onPromptSelected) {
          onPromptSelected({
            text: data.prompt,
            translation: data.translation
          });
        }
        
        // Track usage
        await trackPromptGeneration(selectedTopic, difficulty);
      } else {
        // Fallback to static prompts
        const staticPrompts = getStaticPrompts(selectedTopic, difficulty);
        const randomPrompt = staticPrompts[Math.floor(Math.random() * staticPrompts.length)];
        
        setPrompt(randomPrompt);
        
        if (onPromptSelected) {
          onPromptSelected(randomPrompt);
        }
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      
      // Fallback to static prompts
      const staticPrompts = getStaticPrompts(selectedTopic, difficulty);
      const randomPrompt = staticPrompts[Math.floor(Math.random() * staticPrompts.length)];
      
      setPrompt(randomPrompt);
      
      if (onPromptSelected) {
        onPromptSelected(randomPrompt);
      }
      
      toast({
        title: "Using Pre-defined Prompts",
        description: "Could not generate a custom prompt. Using pre-defined prompts instead.",
        variant: "default"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const trackPromptGeneration = async (topic: string, difficultyLevel: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          activity_type: 'speaking_prompt_generation',
          details: {
            topic,
            difficulty: difficultyLevel,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Error tracking prompt generation:', error);
    }
  };

  const speakPrompt = async () => {
    if (!prompt) return;
    
    try {
      await speakText(prompt.text, 'it');
    } catch (error) {
      console.error('Error speaking prompt:', error);
      toast({
        title: "Speech Error",
        description: "Could not speak the prompt. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Static prompts as fallback
  const getStaticPrompts = (topic: string, level: string) => {
    const prompts = {
      greetings: {
        beginner: [
          { text: "Come ti chiami? Di dove sei?", translation: "What's your name? Where are you from?" },
          { text: "Buongiorno! Come stai oggi?", translation: "Good morning! How are you today?" }
        ],
        intermediate: [
          { text: "Potresti presentarti e dirmi qualcosa di te?", translation: "Could you introduce yourself and tell me something about yourself?" },
          { text: "Quali lingue parli e perché stai imparando l'italiano?", translation: "What languages do you speak and why are you learning Italian?" }
        ],
        advanced: [
          { text: "Raccontami della tua città natale e delle sue tradizioni.", translation: "Tell me about your hometown and its traditions." },
          { text: "Quali sono le principali differenze culturali che hai notato tra il tuo paese e l'Italia?", translation: "What are the main cultural differences you've noticed between your country and Italy?" }
        ]
      },
      // Add more static prompts for other topics...
      family: {
        beginner: [
          { text: "Quante persone ci sono nella tua famiglia?", translation: "How many people are there in your family?" },
          { text: "Hai fratelli o sorelle?", translation: "Do you have brothers or sisters?" }
        ],
        intermediate: [
          { text: "Descrivi la tua famiglia e le vostre tradizioni.", translation: "Describe your family and your traditions." },
          { text: "Che rapporto hai con i tuoi genitori?", translation: "What kind of relationship do you have with your parents?" }
        ],
        advanced: [
          { text: "Come sono cambiati i rapporti familiari nella società moderna?", translation: "How have family relationships changed in modern society?" },
          { text: "Qual è l'importanza della famiglia nella cultura italiana rispetto alla tua cultura?", translation: "What is the importance of family in Italian culture compared to your culture?" }
        ]
      }
    };
    
    // Default to greetings if topic isn't found
    const topicPrompts = prompts[topic as keyof typeof prompts] || prompts.greetings;
    
    // Default to beginner if level isn't found
    return topicPrompts[level as keyof typeof topicPrompts] || topicPrompts.beginner;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Speaking Prompt Generator</span>
          {!isPremium && (
            <Badge variant="outline" className="ml-2">Limited</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {filteredTopics.map(topic => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="all">All Levels</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {prompt && (
          <div className="p-4 bg-muted rounded-md space-y-2">
            <div className="flex items-start justify-between">
              <p className="text-lg font-medium">{prompt.text}</p>
              <Button variant="ghost" size="sm" onClick={speakPrompt} disabled={isSpeaking}>
                {isSpeaking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{prompt.translation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={generatePrompt} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : prompt ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Prompt
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Generate Prompt
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpeakingPromptGenerator;
