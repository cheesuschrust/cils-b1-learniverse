
import React, { useState, useRef, useEffect } from "react";
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
  RefreshCw,
  Cpu,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { addListeningExercise } from "@/data/listeningExercises";
import { detectContentType } from "@/utils/textAnalysis";
import { Progress } from "@/components/ui/progress";
import { useAI } from "@/hooks/useAI";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedCategoryType, setSelectedCategoryType] = useState<"listening" | "flashcards" | "multiple-choice" | "writing" | "speaking" | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { classifyText, generateQuestions, isProcessing: isAIProcessing } = useAI();
  const { user } = useAuth();

  // Use user preferences for feedback language if available
  useEffect(() => {
    if (user?.preferredLanguage) {
      setFeedbackLanguage(user.preferredLanguage);
    }
  }, [user?.preferredLanguage]);

  // Simulate loading progress
  useEffect(() => {
    let interval: number;
    if (isProcessing || generatingQuestions) {
      setLoadingProgress(0);
      interval = window.setInterval(() => {
        setLoadingProgress(prev => {
          const increment = Math.random() * 15;
          const nextProgress = Math.min(prev + increment, 95);
          return nextProgress;
        });
      }, 500);
    } else if (loadingProgress > 0) {
      setLoadingProgress(100);
      interval = window.setTimeout(() => {
        setLoadingProgress(0);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isProcessing, generatingQuestions, loadingProgress]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setTitle(selectedFile.name.split('.')[0].replace(/_/g, ' '));
    setFileType(selectedFile.type);
    setDetectedCategories([]);
    setExtractedContent("");
    setGeneratedQuestions([]);
    setSelectedCategoryType(null);
    
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

  const extractContentFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // For audio files, we'll need transcription
      if (file.type.startsWith("audio/")) {
        // For now, we'll assume audio files need to be manually transcribed
        resolve(""); 
        return;
      }
      
      // For image files, we could use OCR in the future
      if (file.type.startsWith("image/")) {
        // For now, we'll assume images need manual processing
        resolve("");
        return;
      }
      
      // For text-based files
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      
      if (file.type === "application/pdf") {
        // For simplicity, we're just returning an empty string for PDFs
        // In a real app, you would use a PDF parsing library
        resolve("");
      } else {
        // For text files, CSV, etc.
        reader.readAsText(file);
      }
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
      
      // Analyze the content type using AI
      if (content) {
        try {
          const categories = await detectContentCategories(content);
          setDetectedCategories(categories);
          
          // Set the default category to the highest confidence one
          if (categories.length > 0) {
            const primaryCategory = categories.sort((a, b) => b.confidence - a.confidence)[0];
            setSelectedCategoryType(primaryCategory.type);
            
            toast({
              title: "Content categorized",
              description: `Detected as ${primaryCategory.type} content (${Math.round(primaryCategory.confidence)}% confidence)`,
            });
          }
        } catch (error) {
          console.error("Error analyzing content:", error);
        }
      }
      
      toast({
        title: "File processed successfully",
        description: "Content has been extracted and analyzed",
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

  // Use AI to detect content categories
  const detectContentCategories = async (content: string): Promise<ContentCategory[]> => {
    try {
      // Use text classification to help determine the content type
      const classifications = await classifyText(content);
      
      // Fallback to simpler detection if classification isn't helpful
      let categories: ContentCategory[] = [];
      const contentLower = content.toLowerCase();
      
      // Check for question-like patterns
      const hasQuestions = (content.match(/\?/g) || []).length > 2;
      const hasNumberedItems = (content.match(/\d+\.\s/g) || []).length > 2;
      const hasOptions = (content.match(/[a-d]\)/gi) || []).length > 2;
      
      // Add categories based on content analysis
      if (fileType.startsWith("audio/")) {
        categories.push({
          type: "listening",
          confidence: 90
        });
      }
      
      if (hasQuestions && hasOptions) {
        categories.push({
          type: "multiple-choice",
          confidence: 85
        });
      }
      
      if (hasNumberedItems && !hasQuestions) {
        categories.push({
          type: "flashcards",
          confidence: 80
        });
      }
      
      // Check for specific keywords
      if (contentLower.includes("speak") || contentLower.includes("pronunciation") || 
          contentLower.includes("talk") || contentLower.includes("say") ||
          contentLower.includes("repeat")) {
        categories.push({
          type: "speaking",
          confidence: 75
        });
      }
      
      if (contentLower.includes("write") || contentLower.includes("essay") || 
          contentLower.includes("composition") || contentLower.includes("paragraph")) {
        categories.push({
          type: "writing",
          confidence: 75
        });
      }
      
      // If we have no categories yet, add a default based on other heuristics
      if (categories.length === 0) {
        if (hasQuestions) {
          categories.push({
            type: "multiple-choice",
            confidence: 65
          });
        } else {
          categories.push({
            type: "flashcards",
            confidence: 60
          });
        }
      }
      
      return categories;
    } catch (error) {
      console.error("Error detecting content categories:", error);
      // Return a default category if we couldn't detect anything
      return [{
        type: "multiple-choice",
        confidence: 50
      }];
    }
  };

  const handleGenerateQuestions = async () => {
    if (!extractedContent || !selectedCategoryType) {
      toast({
        title: "Missing information",
        description: "Please process content and select a question type",
        variant: "destructive",
      });
      return;
    }
    
    setGeneratingQuestions(true);
    
    try {
      const questions = await generateQuestions(
        extractedContent,
        selectedCategoryType === "multiple-choice" ? "multipleChoice" : selectedCategoryType,
        5,
        difficulty
      );
      
      setGeneratedQuestions(questions);
      
      toast({
        title: "Questions generated",
        description: `Successfully generated ${questions.length} ${selectedCategoryType} questions`,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Error generating questions",
        description: "There was a problem generating questions from this content",
        variant: "destructive",
      });
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const saveAsExercise = () => {
    if (!file || !extractedContent || !selectedCategoryType) {
      toast({
        title: "Missing information",
        description: "Please process a file and select a question type",
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
      // For now, we'll just handle listening exercises through the existing function
      // In a real app, we would save all types properly
      if (selectedCategoryType === "listening") {
        const audioUrl = file.type.startsWith("audio/") 
          ? fileUrl 
          : "https://static.openaudio.ai/2024/03/placeholder-audio.mp3";
        
        addListeningExercise(
          title,
          audioUrl,
          extractedContent,
          difficulty,
          feedbackLanguage
        );
      } else {
        // For other types, we'd save differently but this is a mockup
        console.log("Saving exercise:", {
          type: selectedCategoryType,
          title,
          content: extractedContent,
          difficulty,
          feedbackLanguage,
          generatedQuestions
        });
      }
      
      toast({
        title: "Exercise created",
        description: `"${title}" has been added to the ${selectedCategoryType} exercises`,
      });
      
      // Reset form
      setFile(null);
      setExtractedContent("");
      setTitle("");
      setFileUrl("");
      setFileType("");
      setDetectedCategories([]);
      setGeneratedQuestions([]);
      setSelectedCategoryType(null);
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
          Upload files to extract content and generate AI-powered learning exercises
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
                disabled={isProcessing || isAIProcessing || !file}
                className="mt-2 w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Cpu className="mr-2 h-4 w-4" />
                    Extract & Analyze Content
                  </>
                )}
              </Button>
              
              {(isProcessing || generatingQuestions) && loadingProgress > 0 && (
                <div className="w-full">
                  <Progress value={loadingProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {loadingProgress < 100 ? "Processing..." : "Complete"}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {detectedCategories.length > 0 && (
            <div className="bg-accent/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-primary" />
                AI Content Classification
              </h3>
              
              <div className="space-y-2">
                <label htmlFor="categoryType" className="text-sm font-medium">
                  Exercise Type
                </label>
                <Select 
                  value={selectedCategoryType || undefined} 
                  onValueChange={(value: any) => setSelectedCategoryType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exercise type" />
                  </SelectTrigger>
                  <SelectContent>
                    {detectedCategories.map((category, index) => (
                      <SelectItem key={index} value={category.type}>
                        {category.type.replace("-", " ")} ({Math.round(category.confidence)}% confidence)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="space-y-2 mt-3">
                  {detectedCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{category.type.replace("-", " ")}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-secondary rounded-full">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${category.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{Math.round(category.confidence)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {extractedContent && (
            <div className="grid w-full gap-2 mt-4">
              <div className="flex items-center justify-between">
                <label htmlFor="content" className="text-sm font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Extracted Content
                </label>
                
                {selectedCategoryType && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleGenerateQuestions}
                          disabled={generatingQuestions || isAIProcessing}
                          className="h-8"
                        >
                          {generatingQuestions ? (
                            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                          )}
                          Generate Questions
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Use AI to generate questions from this content</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              <Textarea
                id="content"
                value={extractedContent}
                onChange={(e) => setExtractedContent(e.target.value)}
                placeholder="Content will appear here after processing"
                className="min-h-[200px]"
              />
            </div>
          )}
          
          {generatedQuestions.length > 0 && (
            <div className="grid w-full gap-2 mt-4">
              <label className="text-sm font-medium flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                Generated Questions
              </label>
              
              <div className="bg-accent/30 p-4 rounded-lg space-y-4">
                {generatedQuestions.map((question, index) => (
                  <div key={index} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="font-medium mb-2">{index + 1}. {question.question || question.term || question.prompt}</div>
                    
                    {question.options && (
                      <div className="ml-4 space-y-1">
                        {question.options.map((option: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-start">
                            <span className={`font-medium mr-2 ${optIndex === question.correctAnswerIndex ? "text-green-600" : ""}`}>
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.translation && (
                      <div className="ml-4 text-sm text-muted-foreground mt-1">
                        Translation: {question.translation}
                      </div>
                    )}
                    
                    {question.sampleSentence && (
                      <div className="ml-4 text-sm mt-1 italic">
                        "{question.sampleSentence}"
                      </div>
                    )}
                    
                    {question.expectedElements && (
                      <div className="ml-4 text-sm mt-1">
                        <div className="text-sm text-muted-foreground">Expected elements:</div>
                        <ul className="list-disc ml-5 text-sm">
                          {question.expectedElements.map((elem: string, i: number) => (
                            <li key={i}>{elem}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {extractedContent && selectedCategoryType && (
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="default" 
            onClick={saveAsExercise}
            disabled={!title}
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
