
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, FileOutput, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContentGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<string>('flashcards');
  const [language, setLanguage] = useState<string>('english');
  const [difficulty, setDifficulty] = useState<string>('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [creativity, setCreativity] = useState(50);
  const [isTestAligned, setIsTestAligned] = useState(true);
  const [format, setFormat] = useState<string>('text');
  const { toast } = useToast();

  // Example content templates
  const contentTemplates = {
    flashcards: [
      "Word - Definition",
      "Term - Explanation",
      "Question - Answer"
    ],
    multipleChoice: [
      "What is the capital of Italy?",
      "A) Rome",
      "B) Milan",
      "C) Venice",
      "D) Florence",
      "Correct Answer: A",
      "",
      "Which of the following is a typical Italian breakfast item?",
      "A) Pancakes",
      "B) Eggs and bacon",
      "C) Croissant",
      "D) Toast with jam",
      "Correct Answer: C"
    ],
    writing: [
      "Topic: Describe your favorite Italian city",
      "Word count: 250-300",
      "Requirements:",
      "- Include at least three historical landmarks",
      "- Describe the local cuisine",
      "- Explain why this city is your favorite"
    ],
    speaking: [
      "Practice Dialogue: At a Restaurant",
      "",
      "Waiter: Buongiorno! Posso aiutarla?",
      "Customer: Buongiorno! Vorrei un tavolo per due persone, per favore.",
      "Waiter: Certamente, seguitemi per favore.",
      "Customer: Grazie. Avete un menu in inglese?",
      "Waiter: Sì, ecco il menu. Cosa vorreste ordinare?",
      "Customer: Vorrei ordinare la pasta al pomodoro, per favore."
    ],
    listening: [
      "Audio Transcript: Weather Forecast",
      "",
      "Buongiorno a tutti! Ecco le previsioni del tempo per oggi. A Milano avremo una temperatura massima di 25 gradi con cielo sereno. A Roma, invece, sono previste piogge nel pomeriggio con una temperatura di 22 gradi. A Napoli il tempo sarà soleggiato con una temperatura di 28 gradi.",
      "",
      "Comprehension Questions:",
      "1. What will the weather be like in Milan?",
      "2. Where is rain expected in the afternoon?",
      "3. Which city will have the highest temperature?"
    ]
  };

  const handleGenerate = () => {
    if (!topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for content generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    // Simulate AI content generation
    setTimeout(() => {
      const template = contentTemplates[contentType as keyof typeof contentTemplates];
      let generatedText = `# ${topic} (${difficulty} level)\n\n`;
      
      if (contentType === 'flashcards') {
        // Generate flashcards
        const words = [
          "Ciao - Hello",
          "Arrivederci - Goodbye",
          "Grazie - Thank you",
          "Per favore - Please",
          "Buongiorno - Good morning",
          "Buonasera - Good evening",
          "Scusi - Excuse me",
          "Mi chiamo - My name is",
          "Come stai? - How are you?",
          "Bene, grazie - Well, thank you"
        ];
        
        generatedText += words.join('\n');
      } else {
        // For other content types, use the template
        generatedText += template.join('\n');
      }
      
      setGeneratedContent(generatedText);
      setIsGenerating(false);
      
      toast({
        title: "Content Generated",
        description: `Generated ${contentType} content for "${topic}"`,
      });
    }, 3000);
  };

  const handleDownload = () => {
    if (!generatedContent) return;
    
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s+/g, '-').toLowerCase()}-${contentType}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Content Downloaded",
      description: "Your generated content has been downloaded as a text file",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate educational content powered by AI for various learning formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Subject</Label>
                <Input 
                  id="topic" 
                  placeholder="e.g., Italian Greetings, Food Vocabulary, etc." 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger id="content-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flashcards">Flashcards</SelectItem>
                      <SelectItem value="multipleChoice">Multiple Choice Questions</SelectItem>
                      <SelectItem value="writing">Writing Exercises</SelectItem>
                      <SelectItem value="speaking">Speaking Exercises</SelectItem>
                      <SelectItem value="listening">Listening Exercises</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="bilingual">Bilingual (Italian-English)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (A1-A2)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (B1-B2)</SelectItem>
                      <SelectItem value="advanced">Advanced (C1-C2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Plain Text</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="creativity">Creativity Level</Label>
                  <span className="text-sm text-muted-foreground">{creativity}%</span>
                </div>
                <Slider
                  id="creativity"
                  min={0}
                  max={100}
                  step={5}
                  defaultValue={[creativity]}
                  onValueChange={(value) => setCreativity(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Higher values create more varied content, lower values create more predictable content
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="test-aligned" className="text-base">Test-Aligned Content</Label>
                  <p className="text-xs text-muted-foreground">
                    Generate content aligned with standardized Italian language tests
                  </p>
                </div>
                <Switch 
                  id="test-aligned" 
                  checked={isTestAligned}
                  onCheckedChange={setIsTestAligned}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template">Custom Instructions (Optional)</Label>
                <Textarea 
                  id="template" 
                  placeholder="Add any specific instructions or template for the generated content"
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Reset</Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>Generate Content</>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileOutput className="mr-2 h-5 w-5 text-primary" />
              Generated Content
            </CardTitle>
            <CardDescription>
              AI-generated {contentType} content for "{topic}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="whitespace-pre-wrap">{generatedContent}</pre>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleDownload} variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ContentGenerator;
