
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileText,
  AudioWaveform,
  FileImage,
  FileBox,
  Save,
  AlertCircle,
  Loader2,
  Brain,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { extractContentFromFile, generateQuestions, addListeningExercise } from "@/data/listeningExercises";
import { detectContentType } from "@/utils/textAnalysis";

interface FileProcessorProps {
  onExerciseAdded?: () => void;
}

interface ContentCategory {
  type: "listening" | "flashcards" | "multiple-choice" | "writing" | "speaking";
  confidence: number;
}

const FileProcessor = ({ onExerciseAdded }: FileProcessorProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedContent, setExtractedContent] = useState("");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [detectedCategories, setDetectedCategories] = useState<ContentCategory[]>([]);
  const [feedbackLanguage, setFeedbackLanguage] = useState<"english" | "italian" | "both">("both");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setTitle(selectedFile.name.split('.')[0].replace(/_/g, ' '));
    setFileType(selectedFile.type);
    
    // Create object URL for audio files
    if (selectedFile.type.startsWith("audio/")) {
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);
    } else {
      setFileUrl("");
    }
    
    toast({
      title: "File selected",
      description: `${selectedFile.name} (${formatBytes(selectedFile.size)})`,
    });
  };

  const processFile = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to process",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Extract content from the file
      const content = await extractContentFromFile(file);
      setExtractedContent(content);
      
      // Automatically categorize content
      const categories = detectContentCategories(content);
      setDetectedCategories(categories);
      
      // Set the content type to the highest confidence category
      if (categories.length > 0) {
        const primaryCategory = categories.sort((a, b) => b.confidence - a.confidence)[0];
        toast({
          title: "Content categorized",
          description: `Detected as ${primaryCategory.type} content (${primaryCategory.confidence}% confidence)`,
        });
      }
      
      toast({
        title: "File processed successfully",
        description: "Content has been extracted and categorized",
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "There was a problem extracting content from this file",
        variant: "destructive",
      });
      console.error("File processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to detect content categories based on content analysis
  const detectContentCategories = (content: string): ContentCategory[] => {
    const categories: ContentCategory[] = [];
    const contentLower = content.toLowerCase();
    
    // Simple keyword-based detection
    const keywordMapping = {
      "listening": ["listen", "audio", "hear", "sound", "pronunciation", "ascolta", "ascoltare"],
      "flashcards": ["flashcard", "card", "vocabulary", "vocaboli", "vocabulario", "schede"],
      "multiple-choice": ["choice", "choose", "select", "option", "scelta", "multipla", "scegli"],
      "writing": ["write", "essay", "composition", "scrivi", "scrittura", "composizione"],
      "speaking": ["speak", "talk", "conversation", "parla", "parlare", "conversazione", "dialogo"]
    };
    
    // Check for question-like patterns
    const hasQuestions = (content.match(/\?/g) || []).length > 3;
    const hasNumberedItems = (content.match(/\d+\.\s/g) || []).length > 3;
    const hasOptions = (content.match(/[a-d]\)/gi) || []).length > 3;
    
    // Calculate confidence scores for each category
    for (const [category, keywords] of Object.entries(keywordMapping)) {
      let confidence = 0;
      keywords.forEach(keyword => {
        if (contentLower.includes(keyword)) {
          confidence += 15;
        }
      });
      
      // Additional pattern-based heuristics
      if (category === "multiple-choice" && (hasQuestions || hasOptions)) {
        confidence += 40;
      } else if (category === "flashcards" && hasNumberedItems) {
        confidence += 20;
      } else if (category === "listening" && fileType.startsWith("audio/")) {
        confidence += 60;
      } else if (category === "speaking" && 
                 (contentLower.includes("pronunc") || contentLower.includes("speak") || 
                  contentLower.includes("talk") || contentLower.includes("parla"))) {
        confidence += 30;
      }
      
      // Cap at 100%
      confidence = Math.min(confidence, 100);
      
      if (confidence > 0) {
        categories.push({
          type: category as any,
          confidence
        });
      }
    }
    
    // If no categories detected with confidence, add a default
    if (categories.length === 0) {
      categories.push({
        type: "multiple-choice",
        confidence: 50
      });
    }
    
    return categories.sort((a, b) => b.confidence - a.confidence);
  };

  const saveAsListeningExercise = () => {
    if (!file || !extractedContent) {
      toast({
        title: "Missing information",
        description: "Please process a file first",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for this exercise",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Add as a listening exercise
      const audioUrl = file.type.startsWith("audio/") 
        ? fileUrl 
        : "https://static.openaudio.ai/2024/03/placeholder-audio.mp3";
      
      const newExercise = addListeningExercise(
        title,
        audioUrl,
        extractedContent,
        difficulty,
        feedbackLanguage
      );
      
      toast({
        title: "Exercise created",
        description: `"${title}" has been added to the learning exercises with ${feedbackLanguage} feedback`,
      });
      
      // Reset form
      setFile(null);
      setExtractedContent("");
      setTitle("");
      setFileUrl("");
      setFileType("");
      setDetectedCategories([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Notify parent component
      if (onExerciseAdded) onExerciseAdded();
      
    } catch (error) {
      toast({
        title: "Error saving exercise",
        description: "There was a problem creating the exercise",
        variant: "destructive",
      });
      console.error("Save error:", error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="h-8 w-8 text-muted-foreground" />;
    
    if (fileType.startsWith("audio/")) {
      return <AudioWaveform className="h-8 w-8 text-primary" />;
    } else if (fileType.startsWith("image/")) {
      return <FileImage className="h-8 w-8 text-primary" />;
    } else if (fileType.startsWith("text/") || fileType.includes("document")) {
      return <FileText className="h-8 w-8 text-primary" />;
    } else {
      return <FileBox className="h-8 w-8 text-primary" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getFileIcon()}
          <span>Process Learning Material</span>
        </CardTitle>
        <CardDescription>
          Upload files to extract content for learning exercises
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept="audio/*,text/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
            />
            
            <div className="flex flex-col items-center justify-center py-4">
              {getFileIcon()}
              
              <div className="mt-4 text-sm text-muted-foreground">
                {file ? (
                  <div className="font-medium">{file.name} ({formatBytes(file.size)})</div>
                ) : (
                  <div>
                    <span className="font-medium">Click to upload</span> or drag and drop
                    <p className="text-xs mt-1">
                      Supports audio, text, PDF, Word, and image files
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {file && (
            <div className="flex flex-col items-start gap-4">
              <div className="grid w-full gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Exercise Title
                </label>
                <Input 
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this exercise"
                />
              </div>
              
              <div className="grid w-full gap-2">
                <label htmlFor="difficulty" className="text-sm font-medium">
                  Difficulty Level
                </label>
                <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid w-full gap-2">
                <label htmlFor="feedbackLanguage" className="text-sm font-medium">
                  Feedback Language
                </label>
                <Select value={feedbackLanguage} onValueChange={(value: any) => setFeedbackLanguage(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English Only</SelectItem>
                    <SelectItem value="italian">Italian Only</SelectItem>
                    <SelectItem value="both">Both Languages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {fileType.startsWith("audio/") && (
                <div className="w-full mt-2">
                  <label className="text-sm font-medium mb-2 block">
                    Preview Audio
                  </label>
                  <audio src={fileUrl} controls className="w-full" />
                </div>
              )}
              
              <Button 
                onClick={processFile} 
                disabled={isProcessing || !file}
                className="mt-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Extract & Categorize Content</>
                )}
              </Button>
            </div>
          )}
          
          {detectedCategories.length > 0 && (
            <div className="bg-accent/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-primary" />
                AI Content Classification
              </h3>
              <div className="space-y-2">
                {detectedCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{category.type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-secondary rounded-full">
                        <div 
                          className="h-2 bg-primary rounded-full" 
                          style={{ width: `${category.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{category.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {extractedContent && (
            <div className="grid w-full gap-2 mt-4">
              <label htmlFor="content" className="text-sm font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Extracted Content
              </label>
              <Textarea
                id="content"
                value={extractedContent}
                onChange={(e) => setExtractedContent(e.target.value)}
                placeholder="Content will appear here after processing"
                className="min-h-[200px]"
              />
            </div>
          )}
        </div>
      </CardContent>
      
      {extractedContent && (
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="default" 
            onClick={saveAsListeningExercise}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Exercise
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FileProcessor;
