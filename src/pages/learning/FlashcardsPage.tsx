
import React from 'react';
import FlashcardModule from '@/components/flashcards/FlashcardModule';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FlashcardPronunciation from '@/components/flashcards/FlashcardPronunciation';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FlashcardsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Italian Flashcards</h1>
          <p className="text-muted-foreground">
            Practice with AI-powered flashcards for efficient learning
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
            Client-side AI
          </Badge>
          <Badge variant="outline" className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Models Loaded
          </Badge>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200 text-blue-700">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>AI Model Information</AlertTitle>
        <AlertDescription>
          This page uses the MixedBread AI Embeddings (50MB) and Opus MT Translation (85MB) models that run entirely in your browser.
          These models have been downloaded and cached for offline use.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="flashcards">
        <TabsList>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="pronunciation">Pronunciation</TabsTrigger>
          <TabsTrigger value="ai-details">AI Implementation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flashcards">
          <FlashcardModule />
        </TabsContent>
        
        <TabsContent value="pronunciation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FlashcardPronunciation 
              text="Buongiorno, come stai oggi?" 
              language="italian"
            />
            
            <FlashcardPronunciation 
              text="Mi piacerebbe visitare Roma un giorno." 
              language="italian"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="ai-details">
          <Card>
            <CardHeader>
              <CardTitle>AI Implementation Details</CardTitle>
              <CardDescription>
                How AI is used on this page and what models are involved
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">MixedBread AI Embeddings (Client-side)</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This small but powerful model (50MB) converts text into numerical vectors to measure 
                  semantic similarity between texts. On this page, it's used to:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Compare your pronunciation with the expected text</li>
                  <li>Analyze how close your flashcard answers are to the correct ones</li>
                  <li>Group similar vocabulary items for more effective learning sequences</li>
                </ul>
                <p className="text-sm mt-2">
                  <strong>Implementation:</strong> The model runs entirely in your browser using WebAssembly and 
                  WebGPU (if available). Your data never leaves your device during this processing.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Opus MT Translation Models (Client-side)</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  These models (85MB each) translate between English and Italian. On this page, they're used to:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Generate translations for vocabulary items</li>
                  <li>Provide alternative translations for difficult phrases</li>
                  <li>Support bilingual flashcard mode (showing both languages)</li>
                </ul>
                <p className="text-sm mt-2">
                  <strong>Implementation:</strong> Translation happens locally in your browser. 
                  The models are downloaded once and cached for future use, enabling offline functionality.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Whisper Tiny (Client-side)</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This speech recognition model (75MB) transcribes your spoken Italian. On this page, it's used in the pronunciation tab to:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Convert your spoken Italian into text</li>
                  <li>Enable pronunciation assessment when comparing to expected text</li>
                  <li>Support speaking practice with feedback</li>
                </ul>
                <p className="text-sm mt-2">
                  <strong>Implementation:</strong> Speech recognition runs entirely in your browser.
                  Audio processing happens locally for privacy and offline capability.
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-md mt-4">
                <h4 className="font-medium">Technical Notes:</h4>
                <ul className="text-sm space-y-1 mt-2">
                  <li>All models are loaded only when needed to minimize resource usage</li>
                  <li>Models use WebGPU acceleration on supported devices for up to 3x faster performance</li>
                  <li>Total storage used: ~210MB for all models on this page</li>
                  <li>Models can be used offline after initial download</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlashcardsPage;
