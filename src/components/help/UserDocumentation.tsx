
import React, { useState } from 'react';
import { 
  Book, 
  ChevronRight, 
  Search, 
  BookOpen, 
  FileText, 
  Lightbulb, 
  HelpCircle, 
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
}

export const UserDocumentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // In a real implementation, this would filter documentation content
  };
  
  const handleBookmark = () => {
    toast({
      title: "Page bookmarked",
      description: "This documentation page has been saved to your bookmarks",
    });
  };

  // Documentation sections
  const sections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Getting Started with the Italian Learning Platform</h2>
          
          <section className="space-y-2">
            <h3 className="text-lg font-medium">Welcome to Your Learning Journey</h3>
            <p>
              This comprehensive platform is designed to help you learn Italian effectively through multiple learning methods.
              Our approach combines flashcards, listening exercises, speaking practice, and writing exercises to give you a well-rounded experience.
            </p>
          </section>
          
          <section className="space-y-2">
            <h3 className="text-lg font-medium">Setting Up Your Account</h3>
            <ol className="list-decimal ml-6 space-y-2">
              <li>Complete your profile with your current Italian proficiency level</li>
              <li>Set your learning goals (daily study time, target fluency date)</li>
              <li>Customize your learning preferences (voice preferences, notification settings)</li>
              <li>Take the optional placement test to personalize your learning path</li>
            </ol>
          </section>
          
          <section className="space-y-2">
            <h3 className="text-lg font-medium">Your First Learning Session</h3>
            <p>
              We recommend starting with the following steps:
            </p>
            <ol className="list-decimal ml-6 space-y-2">
              <li>Browse the flashcard collections and select a beginner set</li>
              <li>Complete a 5-minute study session to learn basic vocabulary</li>
              <li>Try a simple listening exercise to train your ear</li>
              <li>Practice pronouncing a few common phrases</li>
            </ol>
          </section>
          
          <div className="bg-primary/5 p-4 rounded-lg mt-6">
            <h4 className="flex items-center font-medium">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              Pro Tip
            </h4>
            <p className="mt-1 text-sm">
              Consistency is key to language learning. Even 10 minutes of daily practice is more effective than occasional
              longer sessions. Set a regular study schedule to maximize your progress.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'flashcards',
      title: 'Flashcard System',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Flashcard System Guide</h2>
          
          <section className="space-y-2">
            <h3 className="text-lg font-medium">Understanding Spaced Repetition</h3>
            <p>
              Our flashcard system uses spaced repetition science to optimize your learning. Cards you find difficult
              will appear more frequently, while cards you know well will appear less often, maximizing your study efficiency.
            </p>
            
            <div className="mt-2 bg-muted p-4 rounded-lg">
              <h4 className="font-medium">How It Works:</h4>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>After reviewing a card, rate your knowledge from "Again" to "Easy"</li>
                <li>Cards rated "Again" or "Hard" will reappear sooner</li>
                <li>Cards rated "Good" or "Easy" will have longer intervals</li>
                <li>The system tracks your progress and adjusts intervals automatically</li>
              </ul>
            </div>
          </section>
          
          <section className="space-y-2">
            <h3 className="text-lg font-medium">Creating Custom Flashcards</h3>
            <p>
              You can create your own custom flashcards in addition to using our pre-made collections:
            </p>
            <ol className="list-decimal ml-6 space-y-2">
              <li>Navigate to the Flashcards section</li>
              <li>Click "Create New Set" to make a collection</li>
              <li>Add cards with Italian words/phrases and their English translations</li>
              <li>Optionally add explanations, images, or audio recordings</li>
              <li>Organize cards with tags and categories</li>
            </ol>
          </section>
          
          <section className="space-y-2">
            <h3 className="text-lg font-medium">Importing and Exporting</h3>
            <p>
              Our platform supports importing and exporting flashcards in various formats:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>CSV files with columns for Italian, English, and optional fields</li>
              <li>JSON format for more complex data structures</li>
              <li>Plain text files with simple formatting</li>
              <li>Direct import from popular apps like Anki and Quizlet</li>
            </ul>
          </section>
          
          <div className="bg-primary/5 p-4 rounded-lg mt-6">
            <h4 className="flex items-center font-medium">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              Pro Tip
            </h4>
            <p className="mt-1 text-sm">
              Create cards with example sentences, not just word translations. Context helps your brain form stronger memory connections.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'listening',
      title: 'Listening Exercises',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Listening Exercises Guide</h2>
          
          <section className="space-y-2">
            <h3 className="text-lg font-medium">Developing Your Ear for Italian</h3>
            <p>
              Our listening exercises feature authentic Italian audio with various accents and speaking speeds.
              Each exercise is designed to gradually improve your comprehension abilities.
            </p>
          </section>
          
          <section className="space-y-2">
            <h3 className="text-lg font-medium">Types of Listening Exercises</h3>
            <ul className="list-disc ml-6 space-y-3">
              <li>
                <strong>Dictation:</strong> Listen and type what you hear to practice spelling and comprehension
              </li>
              <li>
                <strong>Comprehension Questions:</strong> Answer questions about audio clips to test understanding
              </li>
              <li>
                <strong>Speed Variation:</strong> Adjust playback speed to challenge yourself or ease into difficult content
              </li>
              <li>
                <strong>Gap Filling:</strong> Complete transcripts with missing words based on what you hear
              </li>
            </ul>
          </section>
          
          <section className="space-y-2">
            <h3 className="text-lg font-medium">Listening Practice Tips</h3>
            <ol className="list-decimal ml-6 space-y-2">
              <li>Start with slower, clearer recordings before advancing to natural speech</li>
              <li>Listen to the same clip multiple times to catch more details</li>
              <li>Try listening without reading first, then check the transcript</li>
              <li>Use the playback controls to repeat challenging sections</li>
              <li>Practice with different Italian accents to improve adaptability</li>
            </ol>
          </section>
          
          <div className="bg-primary/5 p-4 rounded-lg mt-6">
            <h4 className="flex items-center font-medium">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              Pro Tip
            </h4>
            <p className="mt-1 text-sm">
              For additional practice, try shadowing: listen to a short segment and repeat it immediately, 
              mimicking the speaker's intonation and rhythm as closely as possible.
            </p>
          </div>
        </div>
      )
    },
  ];
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Book className="h-5 w-5 mr-2 text-primary" />
            User Documentation
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBookmark}>
              <Bookmark className="h-4 w-4 mr-1" />
              <span className="sr-only md:not-sr-only md:inline">Bookmark</span>
            </Button>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="sr-only md:not-sr-only md:inline">Expand</span>
              </Button>
            </a>
          </div>
        </div>
        <CardDescription>
          Comprehensive guides and tutorials for using the Italian learning platform
        </CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documentation..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={sections[0].id}>
          <div className="flex">
            <div className="w-64 shrink-0 pr-4 border-r">
              <h3 className="font-medium mb-3">Documentation Topics</h3>
              <TabsList orientation="vertical" className="flex flex-col items-stretch h-auto">
                {sections.map((section) => (
                  <TabsTrigger 
                    key={section.id} 
                    value={section.id}
                    className="justify-start py-2"
                  >
                    <section.icon className="h-4 w-4 mr-2" />
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Additional Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="#" 
                      className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Video Tutorials
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Downloadable PDFs
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Community Forums
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex-1 pl-6">
              <ScrollArea className="h-[600px] pr-4">
                {sections.map((section) => (
                  <TabsContent key={section.id} value={section.id}>
                    {section.content}
                  </TabsContent>
                ))}
              </ScrollArea>
            </div>
          </div>
        </Tabs>
        
        <div className="mt-8 flex items-center justify-between bg-muted p-4 rounded-lg">
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm">Need more help?</span>
          </div>
          <Button size="sm">Contact Support</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDocumentation;
