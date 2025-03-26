
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, FileText, FlaskConical, BookOpen, BookCopy, Sparkles, Download, Copy, CheckCircle, FileDown } from "lucide-react";
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { ContentType, formatContentType } from '@/types/contentType';

const SmartContentGenerator = () => {
  const { settings, isProcessing, generateContent } = useAIUtils();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<string>("flashcards");
  const [topic, setTopic] = useState<string>("");
  const [count, setCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [includeExamples, setIncludeExamples] = useState<boolean>(true);
  const [includePronunciation, setIncludePronunciation] = useState<boolean>(true);
  const [bilingualContent, setBilingualContent] = useState<boolean>(true);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [contentCopied, setContentCopied] = useState<boolean>(false);
  
  // Handle content generation
  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for content generation",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Here we would call an AI service to generate content
      const content = await generateContent(topic, selectedTab);
      
      // Sample generated content for demonstration
      let sampleContent = "";
      
      switch (selectedTab) {
        case "flashcards":
          sampleContent = `# Italian Flashcards on ${topic}\n\n`;
          for (let i = 1; i <= count; i++) {
            sampleContent += `## Card ${i}\n`;
            sampleContent += `- Italian: esempio${i}\n`;
            sampleContent += `- English: example${i}\n`;
            if (includePronunciation) {
              sampleContent += `- Pronunciation: eh-ZEM-pyo\n`;
            }
            if (includeExamples) {
              sampleContent += `- Example: Questo è un esempio.\n`;
            }
            sampleContent += "\n";
          }
          break;
          
        case "quiz":
          sampleContent = `# Multiple Choice Quiz on ${topic}\n\n`;
          for (let i = 1; i <= count; i++) {
            sampleContent += `## Question ${i}\n`;
            sampleContent += `What is the Italian word for "example"?\n\n`;
            sampleContent += `A) essempio\n`;
            sampleContent += `B) esempio\n`;
            sampleContent += `C) esembio\n`;
            sampleContent += `D) esemplo\n\n`;
            sampleContent += `Answer: B\n\n`;
          }
          break;
          
        case "conversation":
          sampleContent = `# Conversation Practice on ${topic}\n\n`;
          sampleContent += `Person A: Buongiorno! Come stai?\n`;
          sampleContent += `Person B: Sto bene, grazie! E tu?\n`;
          sampleContent += `Person A: Anche io sto bene. Hai sentito parlare di ${topic}?\n`;
          sampleContent += `Person B: Sì, è molto interessante. Mi piacerebbe saperne di più.\n`;
          break;
          
        case "passage":
          sampleContent = `# Reading Passage on ${topic}\n\n`;
          sampleContent += `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac pretium nunc, eget vestibulum risus. Donec eget auctor enim. Pellentesque at dictum nisi. In hac habitasse platea dictumst. Donec a vehicula arcu, vel sagittis odio. Vivamus eget tellus a lorem viverra tincidunt.\n\n`;
          sampleContent += `Praesent id fermentum felis. Sed in aliquet odio. Duis tempus consequat lectus, sit amet facilisis nulla imperdiet at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi hendrerit justo in porttitor blandit.`;
          break;
          
        default:
          sampleContent = `Generated content for ${topic} in ${selectedTab} format.`;
      }
      
      setGeneratedContent(sampleContent);
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating content. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle content copy
  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    setContentCopied(true);
    
    toast({
      title: "Content copied",
      description: "The generated content has been copied to your clipboard.",
      variant: "default"
    });
    
    setTimeout(() => setContentCopied(false), 2000);
  };
  
  // Handle content download
  const handleDownloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTab}_${topic.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Content downloaded",
      description: "The generated content has been downloaded as a text file.",
      variant: "default"
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Create custom learning materials tailored to your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="flashcards" onValueChange={(value) => setSelectedTab(value)}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="flashcards" className="flex items-center gap-1">
                <BookCopy className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">Flashcards</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-1">
                <FileText className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">Quiz</span>
              </TabsTrigger>
              <TabsTrigger value="conversation" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">Conversation</span>
              </TabsTrigger>
              <TabsTrigger value="passage" className="flex items-center gap-1">
                <FileText className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">Passage</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Theme</Label>
                <Input
                  id="topic"
                  placeholder="Enter a topic, theme, or specific subject..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select 
                    value={difficulty} 
                    onValueChange={setDifficulty}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Number of Items ({count})</Label>
                  <Slider
                    value={[count]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) => setCount(value[0])}
                    className="py-4"
                  />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-examples"
                    checked={includeExamples}
                    onCheckedChange={setIncludeExamples}
                  />
                  <Label htmlFor="include-examples">Include Examples</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-pronunciation"
                    checked={includePronunciation}
                    onCheckedChange={setIncludePronunciation}
                  />
                  <Label htmlFor="include-pronunciation">Add Pronunciation</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bilingual-content"
                    checked={bilingualContent}
                    onCheckedChange={setBilingualContent}
                  />
                  <Label htmlFor="bilingual-content">Bilingual Content</Label>
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGenerateContent}
            disabled={isProcessing || !topic.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {generatedContent && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Generated Content
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1"
                  onClick={handleCopyContent}
                >
                  {contentCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1"
                  onClick={handleDownloadContent}
                >
                  <FileDown className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] rounded-md border p-4 bg-muted/30">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {generatedContent}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartContentGenerator;
