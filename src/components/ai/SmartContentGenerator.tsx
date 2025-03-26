
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, BookOpen, FileText, Lightbulb, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Flashcard {
  id: string;
  term: string;
  definition: string;
}

interface RelatedConcept {
  title: string;
  description: string;
  relation: string;
}

const SmartContentGenerator = () => {
  const [content, setContent] = useState('');
  const [userLevel, setUserLevel] = useState('intermediate');
  const [activeTab, setActiveTab] = useState('flashcards');
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [simplifiedExplanation, setSimplifiedExplanation] = useState('');
  const [analogy, setAnalogy] = useState('');
  const [relatedConcepts, setRelatedConcepts] = useState<RelatedConcept[]>([]);
  const [conceptTitle, setConceptTitle] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { generateText } = useAI();
  const { toast } = useToast();
  
  const generateContent = async () => {
    if (!content.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some content to generate from.",
        variant: "destructive"
      });
      return;
    }
    
    if (!conceptTitle.trim() && activeTab !== 'flashcards') {
      toast({
        title: "Concept name required",
        description: "Please enter a title for the concept.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      if (activeTab === 'flashcards') {
        // Generate flashcards
        const prompt = `Create 5 flashcards from the following content. Format as JSON array with term and definition properties: ${content}`;
        const response = await generateText(prompt);
        
        try {
          // Extract JSON from the response
          const jsonString = response.substring(
            response.indexOf('['),
            response.lastIndexOf(']') + 1
          );
          const parsedFlashcards = JSON.parse(jsonString);
          
          // Add IDs to the flashcards
          const flashcardsWithIds = parsedFlashcards.map((card: any, index: number) => ({
            ...card,
            id: `fc-${index + 1}`
          }));
          
          setFlashcards(flashcardsWithIds);
        } catch (error) {
          // Fallback if JSON parsing fails
          const fallbackCards = [];
          const lines = response.split('\n');
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.includes(':') || line.includes('-')) {
              const [term, definition] = line.split(/[:|-]/);
              if (term && definition) {
                fallbackCards.push({
                  id: `fc-${i + 1}`,
                  term: term.trim(),
                  definition: definition.trim()
                });
              }
            }
          }
          
          if (fallbackCards.length > 0) {
            setFlashcards(fallbackCards);
          } else {
            throw new Error("Could not parse flashcards");
          }
        }
      } else if (activeTab === 'simplify') {
        // Generate simplified explanation
        const prompt = `Simplify this concept for a ${userLevel} level student: ${conceptTitle}. 
                       Original content: ${content}
                       Make it easy to understand while preserving the core information.`;
        
        const response = await generateText(prompt);
        setSimplifiedExplanation(response);
      } else if (activeTab === 'analogy') {
        // Generate analogy
        const prompt = `Create a helpful analogy to explain this concept: ${conceptTitle}. 
                       The original explanation is: ${content}
                       The learner's level is: ${userLevel}
                       Your analogy should make this concept more intuitive and memorable.`;
        
        const response = await generateText(prompt);
        setAnalogy(response);
      } else if (activeTab === 'related') {
        // Generate related concepts
        const prompt = `Identify 3-5 related concepts to "${conceptTitle}" that would help a language learner understand the broader context.
                       For each concept, provide:
                       1. The concept name
                       2. A brief description
                       3. How it relates to ${conceptTitle}
                       Format as JSON array with title, description, and relation properties.`;
        
        const response = await generateText(prompt);
        
        try {
          // Extract JSON from the response
          const jsonString = response.substring(
            response.indexOf('['),
            response.lastIndexOf(']') + 1
          );
          const parsedConcepts = JSON.parse(jsonString);
          setRelatedConcepts(parsedConcepts);
        } catch (error) {
          // Fallback parsing
          const concepts = [];
          const sections = response.split(/\d+\./);
          
          for (let i = 1; i < sections.length; i++) {
            const section = sections[i].trim();
            const lines = section.split('\n').filter(line => line.trim());
            
            if (lines.length >= 3) {
              concepts.push({
                title: lines[0].replace(/^[^a-zA-Z0-9]*/, '').trim(),
                description: lines[1].replace(/^[^a-zA-Z0-9]*/, '').trim(),
                relation: lines[2].replace(/^[^a-zA-Z0-9]*/, '').trim()
              });
            }
          }
          
          if (concepts.length > 0) {
            setRelatedConcepts(concepts);
          } else {
            throw new Error("Could not parse related concepts");
          }
        }
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard"
    });
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Smart Content Generator</CardTitle>
        <CardDescription>
          Transform your content into flashcards, explanations, and more.
        </CardDescription>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="flashcards">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Flashcards</span>
            </TabsTrigger>
            <TabsTrigger value="simplify">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Simplify</span>
            </TabsTrigger>
            <TabsTrigger value="analogy">
              <Lightbulb className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Analogy</span>
            </TabsTrigger>
            <TabsTrigger value="related">
              <ExternalLink className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Related</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activeTab !== 'flashcards' && (
            <div className="space-y-2">
              <Label htmlFor="concept-title">Concept Name</Label>
              <Input 
                id="concept-title"
                placeholder="Enter the name of the concept" 
                value={conceptTitle}
                onChange={(e) => setConceptTitle(e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="content-input">Content</Label>
            <Textarea 
              id="content-input"
              placeholder="Paste your content here" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user-level">Learning Level</Label>
            <Select value={userLevel} onValueChange={setUserLevel}>
              <SelectTrigger id="user-level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={generateContent} 
            disabled={isGenerating || !content.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Generate {
                  activeTab === 'flashcards' ? 'Flashcards' : 
                  activeTab === 'simplify' ? 'Simplified Explanation' :
                  activeTab === 'analogy' ? 'Analogy' : 'Related Concepts'
                }</span>
              </>
            )}
          </Button>
          
          <TabsContent value="flashcards" className="space-y-4 mt-4 border-t pt-4">
            {flashcards.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Generated Flashcards</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(
                      flashcards.map(card => `${card.term}: ${card.definition}`).join('\n\n')
                    )}
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    <span>Copy All</span>
                  </Button>
                </div>
                
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-4">
                    {flashcards.map((card) => (
                      <Card key={card.id} className="p-4">
                        <div className="font-medium">Term: {card.term}</div>
                        <div className="text-sm mt-2">Definition: {card.definition}</div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Enter your content and click Generate to create flashcards
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="simplify" className="space-y-4 mt-4 border-t pt-4">
            {simplifiedExplanation ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Simplified Explanation</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(simplifiedExplanation)}
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    <span>Copy</span>
                  </Button>
                </div>
                
                <Card className="p-4">
                  <div className="whitespace-pre-wrap">{simplifiedExplanation}</div>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Enter a concept and content to generate a simplified explanation
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analogy" className="space-y-4 mt-4 border-t pt-4">
            {analogy ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Analogy for {conceptTitle}</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(analogy)}
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    <span>Copy</span>
                  </Button>
                </div>
                
                <Card className="p-4">
                  <div className="whitespace-pre-wrap">{analogy}</div>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Enter a concept and content to generate a helpful analogy
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="related" className="space-y-4 mt-4 border-t pt-4">
            {relatedConcepts.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Related to {conceptTitle}</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(
                      relatedConcepts.map(concept => 
                        `${concept.title}:\n${concept.description}\nRelation: ${concept.relation}`
                      ).join('\n\n')
                    )}
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    <span>Copy All</span>
                  </Button>
                </div>
                
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-4">
                    {relatedConcepts.map((concept, index) => (
                      <Card key={index} className="p-4">
                        <div className="font-medium">{concept.title}</div>
                        <div className="text-sm mt-2">{concept.description}</div>
                        <div className="text-xs text-muted-foreground mt-3">
                          <Badge variant="outline" className="font-normal">Relation</Badge> {concept.relation}
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Enter a concept to discover related concepts
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartContentGenerator;
