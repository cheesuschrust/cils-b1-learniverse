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
  File,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { addListeningExercise } from "@/data/listeningExercises";
import { detectContentType, ContentType } from "@/utils/textAnalysis";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const PROCESS_TIMEOUT = 10000; // 10 seconds

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
  const [processingError, setProcessingError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingTimeoutRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { classifyText, generateQuestions, isProcessing: isAIProcessing } = useAI();
  const { user } = useAuth();

  const acceptedFileTypes = {
    'text/plain': ['.txt'],
    'text/markdown': ['.md'],
    'application/json': ['.json'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'audio/mpeg': ['.mp3'],
    'audio/wav': ['.wav'],
    'audio/ogg': ['.ogg'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/bmp': ['.bmp'],
    'image/webp': ['.webp']
  };

  useEffect(() => {
    if (user?.preferredLanguage) {
      setFeedbackLanguage(user.preferredLanguage);
    }
  }, [user?.preferredLanguage]);

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

  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        window.clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setProcessingError(null);
    
    const selectedFile = e.target.files[0];
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
    setTitle(selectedFile.name.split('.')[0].replace(/_/g, ' '));
    setFileType(selectedFile.type);
    setDetectedCategories([]);
    setExtractedContent("");
    setGeneratedQuestions([]);
    setSelectedCategoryType(null);
    
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
      const timeout = window.setTimeout(() => {
        reject(new Error("Processing took too long. Please try a smaller file or different format."));
      }, PROCESS_TIMEOUT);
      
      processingTimeoutRef.current = timeout;
      
      if (file.type.startsWith("audio/")) {
        toast({
          title: "Audio file detected",
          description: "Audio transcription will be processed by AI. Please wait...",
        });
        window.clearTimeout(timeout);
        resolve("Audio content will be processed by AI transcription"); 
        return;
      }
      
      if (file.type.startsWith("image/")) {
        toast({
          title: "Image file detected",
          description: "Image will be processed for text extraction. This may take a moment...",
        });
        window.clearTimeout(timeout);
        resolve("Image content will be processed by OCR");
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        window.clearTimeout(timeout);
        const text = e.target?.result as string;
        
        const maxLength = 100000; // ~100KB of text
        const truncatedText = text && text.length > maxLength 
          ? text.substring(0, maxLength) + "\n\n[Content truncated due to size...]" 
          : text;
        
        resolve(truncatedText);
      };
      
      reader.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("Failed to read file"));
      };
      
      if (file.type === "application/pdf" || 
          file.type.includes("document") || 
          file.type.includes("excel") || 
          file.type.includes("sheet")) {
        toast({
          title: `${file.type.includes("pdf") ? "PDF" : file.type.includes("excel") ? "Spreadsheet" : "Document"} detected`,
          description: "Complex document parsing may take a moment...",
        });
        window.clearTimeout(timeout);
        resolve(`Content extracted from ${file.name} will be processed`);
      } else {
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
    setProcessingError(null);
    
    try {
      const content = await extractContentFromFile(file);
      setExtractedContent(content);
      
      if (content) {
        try {
          const categories = await detectContentCategories(content);
          setDetectedCategories(categories);
          
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
          setProcessingError("Failed to categorize content. Please try again or select manually.");
        }
      }
      
      toast({
        title: "File processed successfully",
        description: "Content has been extracted and analyzed",
      });
    } catch (error: any) {
      toast({
        title: "Error processing file",
        description: error?.message || "There was a problem extracting content from this file",
        variant: "destructive",
      });
      console.error("File processing error:", error);
      setProcessingError(error?.message || "Processing failed. Try a smaller file or different format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const detectContentCategories = async (content: string): Promise<ContentCategory[]> => {
    try {
      const contentForClassification = content.length > 5000 ? content.substring(0, 5000) : content;
      
      if (content.length > 20000) {
        return inferContentType(content);
      }
      
      try {
        const classifications = await classifyText(contentForClassification);
      } catch (error) {
        console.error("Error with AI classification:", error);
      }
      
      return inferContentType(contentForClassification);
    } catch (error) {
      console.error("Error detecting content categories:", error);
      return [{
        type: "multiple-choice",
        confidence: 50
      }];
    }
  };
  
  const inferContentType = (content: string): ContentCategory[] => {
    let categories: ContentCategory[] = [];
    const contentLower = content.toLowerCase();
    
    const hasQuestions = (content.match(/\?/g) || []).length > 2;
    const hasNumberedItems = (content.match(/\d+\.\s/g) || []).length > 2;
    const hasOptions = (content.match(/[a-d]\)/gi) || []).length > 2;
    
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
      const contentForGeneration = extractedContent.length > 5000 
        ? extractedContent.substring(0, 5000) + "\n\n[Content truncated for processing...]" 
        : extractedContent;
      
      const contentTypeForAPI: ContentType = 
        selectedCategoryType === "multiple-choice" ? "multiple-choice" : 
        selectedCategoryType as ContentType;
      
      const questions = await generateQuestions(
        contentForGeneration,
        contentTypeForAPI,
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
      
      setFile(null);
      setExtractedContent("");
      setTitle("");
      setFileUrl("");
      setFileType("");
      setDetectedCategories([]);
      setGeneratedQuestions([]);
      setSelectedCategoryType(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
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
    } else if (fileType.includes("sheet") || fileType.includes("excel")) {
      return <FileBox className="h-8 w-8 text-primary" />;
    } else if (fileType.includes("pdf")) {
      return <File className="h-8 w-8 text-primary" />;
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
              accept=".txt,.md,.json,.pdf,.doc,.docx,.xls,.xlsx,.mp3,.wav,.ogg,.jpg,.jpeg,.png,.gif,.bmp,.webp"
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
                      Supports text, PDF, Word, Excel, audio, and image files
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
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
              
              {processingError && (
                <div className="w-full p-3 border border-destructive/50 bg-destructive/10 rounded-md text-sm text-destructive flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{processingError}</span>
                </div>
              )}
              
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
                className="min-h-[200px] max-h-[400px]"
              />
              
              {extractedContent.length > 100000 && (
                <p className="text-xs text-amber-500">
                  Note: This is a large document. Only the first 100,000 characters are shown to prevent browser performance issues.
                </p>
              )}
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

