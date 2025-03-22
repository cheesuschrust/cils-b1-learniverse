
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileUp,
  FileText,
  Upload,
  File,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  Headphones,
  Pen,
  Mic,
  CheckSquare,
  Languages,
  Brain,
  Info,
  Newspaper
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FileProcessor from "@/components/learning/FileProcessor";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Import natural for NLP capabilities
import * as natural from "natural";

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

type ContentType = "listening" | "flashcards" | "multiple-choice" | "writing" | "speaking";

interface UploadedFile {
  id: string;
  file: File;
  contentType: ContentType;
  name: string;
  size: string;
  content: string;
  status: "pending" | "processing" | "success" | "error";
  aiGenerated: boolean;
  questions: any[];
  language: "english" | "italian" | "both";
  confidence: number;
  processedContent?: {
    text: string;
    keywords: string[];
    entities: string[];
    summary: string;
  };
}

interface AIAnalysisResult {
  fileType: string;
  contentType: ContentType;
  confidence: number;
  suggestedQuestions: any[];
  entities: string[];
  keywords: string[];
  summary: string;
}

// Function to get file extension icon
const getFileIcon = (file: File) => {
  const type = file.type;
  
  if (type.startsWith("audio/")) {
    return <Headphones className="h-5 w-5 text-orange-500" />;
  } else if (type.startsWith("image/")) {
    return <FileText className="h-5 w-5 text-blue-500" />;
  } else if (type.startsWith("text/") || 
            type === "application/pdf" || 
            type.includes("document")) {
    return <FileText className="h-5 w-5 text-green-500" />;
  } else {
    return <File className="h-5 w-5 text-gray-500" />;
  }
};

// Function to format bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Function to get content type icon
const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case "listening":
      return <Headphones className="h-5 w-5" />;
    case "flashcards":
      return <BookOpen className="h-5 w-5" />;
    case "multiple-choice":
      return <CheckSquare className="h-5 w-5" />;
    case "writing":
      return <Pen className="h-5 w-5" />;
    case "speaking":
      return <Mic className="h-5 w-5" />;
    default:
      return <File className="h-5 w-5" />;
  }
};

// Function to extract content from file
const extractContentFromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string || "");
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      reader.readAsText(file);
    } else if (file.type.startsWith("audio/")) {
      // For audio files, we'd normally use a speech-to-text API
      // For demo, return placeholder
      setTimeout(() => {
        resolve("This is a transcribed audio content for demonstration purposes. In a real application, we would use speech-to-text APIs to extract the actual content from the audio file.");
      }, 1500);
    } else if (file.type === "application/pdf" || file.type.includes("document")) {
      // For PDFs and documents, we'd normally use a document parsing API
      // For demo, return placeholder
      setTimeout(() => {
        resolve("This is extracted document content for demonstration purposes. In a real application, we would use document parsing APIs to extract the actual content from the PDF or document file.");
      }, 1500);
    } else {
      // For unsupported file types
      reject(new Error("Unsupported file type"));
    }
  });
};

// Function to perform NLP analysis on content
const analyzeContent = (content: string, fileType: string): Promise<AIAnalysisResult> => {
  return new Promise((resolve) => {
    // Tokenize content
    const tokens = tokenizer.tokenize(content.toLowerCase());
    
    // Extract keywords (simple frequency-based approach)
    const wordFreq: Record<string, number> = {};
    tokens.forEach(token => {
      const stemmed = stemmer.stem(token);
      if (stemmed.length > 3) { // Ignore very short words
        wordFreq[stemmed] = (wordFreq[stemmed] || 0) + 1;
      }
    });
    
    // Sort keywords by frequency
    const keywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
    
    // Detect entities (simplified)
    const potentialEntities = content.match(/[A-Z][a-z]+(\s[A-Z][a-z]+)*/g) || [];
    const entities = [...new Set(potentialEntities)].slice(0, 10);
    
    // Generate a simple summary (first few sentences)
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    const summary = sentences.slice(0, 3).join(' ');
    
    // Simple content type detection
    let contentType: ContentType = "multiple-choice";
    let confidence = 50;
    
    // Check for different patterns
    if (fileType.startsWith("audio/") || 
        content.toLowerCase().includes("listen") || 
        content.toLowerCase().includes("audio") ||
        content.toLowerCase().includes("pronunciation")) {
      contentType = "listening";
      confidence = 85;
    } else if (content.toLowerCase().includes("vocabulary") || 
              content.toLowerCase().includes("words") ||
              content.toLowerCase().includes("flashcard") ||
              content.toLowerCase().includes("flash card")) {
      contentType = "flashcards";
      confidence = 80;
    } else if (content.toLowerCase().includes("speak") || 
              content.toLowerCase().includes("pronunciation") ||
              content.toLowerCase().includes("conversation")) {
      contentType = "speaking";
      confidence = 75;
    } else if (content.toLowerCase().includes("write") || 
              content.toLowerCase().includes("essay") ||
              content.toLowerCase().includes("writing")) {
      contentType = "writing";
      confidence = 70;
    } else if (content.match(/\?/g)?.length > 3 || 
              content.match(/[A-D]\)/g)?.length > 3 ||
              content.toLowerCase().includes("choose") ||
              content.toLowerCase().includes("select")) {
      contentType = "multiple-choice";
      confidence = 90;
    }
    
    // Generate simple questions based on content
    const questions = generateQuestionsFromContent(content, contentType);

    // Return the analysis
    resolve({
      fileType,
      contentType,
      confidence,
      suggestedQuestions: questions,
      entities,
      keywords,
      summary
    });
  });
};

// Generate questions based on content and type
const generateQuestionsFromContent = (content: string, contentType: ContentType) => {
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
  const questions = [];
  
  // Create different question types based on content type
  switch (contentType) {
    case "multiple-choice":
      // Extract some sentences to create questions
      for (let i = 0; i < Math.min(5, sentences.length); i++) {
        const sentence = sentences[i].trim();
        if (sentence.length > 20) {
          // Find a word to replace with a blank
          const words = sentence.split(" ");
          if (words.length > 5) {
            const wordToReplace = words.find(w => w.length > 4) || words[3];
            const questionText = sentence.replace(wordToReplace, "________");
            
            // Generate options
            const correctAnswer = wordToReplace;
            const options = [
              correctAnswer,
              wordToReplace.split("").reverse().join(""),
              wordToReplace[0] + wordToReplace.substring(1).split("").sort().join(""),
              wordToReplace.substring(0, wordToReplace.length - 1) + "x"
            ];
            
            questions.push({
              question: questionText,
              options: shuffleArray([...options]),
              correctAnswer: correctAnswer
            });
          }
        }
      }
      break;
      
    case "flashcards":
      // Extract some key terms and definitions
      const terms = sentences.slice(0, 8);
      terms.forEach((term, i) => {
        if (i % 2 === 0 && i+1 < terms.length) {
          questions.push({
            front: term.trim(),
            back: terms[i+1].trim()
          });
        }
      });
      break;
      
    case "listening":
      // Create comprehension questions
      for (let i = 0; i < Math.min(3, sentences.length); i++) {
        const sentence = sentences[i].trim();
        if (sentence.length > 30) {
          questions.push({
            audioTranscript: content.substring(0, 200),
            question: `What does the speaker mean when they say "${sentence.substring(0, 50)}..."?`,
            options: [
              "They are explaining a concept",
              "They are asking a question",
              "They are giving an example",
              "They are making a comparison"
            ],
            correctAnswer: "They are explaining a concept"
          });
        }
      }
      break;
      
    case "writing":
      // Create writing prompts
      questions.push({
        prompt: `Write about: ${content.substring(0, 100)}...`,
        minWords: 100,
        maxWords: 200,
        criteria: [
          "Grammar and vocabulary usage",
          "Coherence and cohesion",
          "Task completion",
          "Creativity"
        ]
      });
      break;
      
    case "speaking":
      // Create speaking prompts
      questions.push({
        prompt: `Discuss: ${content.substring(0, 100)}...`,
        duration: 60,
        preparationTime: 30,
        criteria: [
          "Pronunciation",
          "Fluency",
          "Vocabulary range",
          "Grammatical accuracy"
        ]
      });
      break;
  }
  
  return questions;
};

// Helper to shuffle array
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Save processed content to storage
const saveProcessedContent = (files: UploadedFile[]) => {
  const existingData = localStorage.getItem('processedContent');
  const existingContent = existingData ? JSON.parse(existingData) : [];
  
  // Filter out files with error status
  const validFiles = files.filter(file => file.status === 'success');
  
  // Extract relevant information from files
  const newContent = validFiles.map(file => ({
    id: file.id,
    name: file.name,
    contentType: file.contentType,
    content: file.content,
    questions: file.questions,
    language: file.language,
    dateAdded: new Date().toISOString(),
    processedContent: file.processedContent
  }));
  
  // Combine and save
  localStorage.setItem('processedContent', JSON.stringify([...existingContent, ...newContent]));
  
  return newContent.length;
};

const ContentUploader = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("upload");
  const [contentType, setContentType] = useState<ContentType>("multiple-choice");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [useAI, setUseAI] = useState(true);
  const [feedbackLanguage, setFeedbackLanguage] = useState<"english" | "italian" | "both">("both");
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isAIExplainerOpen, setIsAIExplainerOpen] = useState(false);
  const [fileProcessorAdded, setFileProcessorAdded] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Count processed items by type in storage
  const getProcessedCounts = () => {
    const existingData = localStorage.getItem('processedContent');
    if (!existingData) return { total: 0, types: {} };
    
    const content = JSON.parse(existingData);
    const counts: any = {
      total: content.length,
      types: {}
    };
    
    content.forEach((item: any) => {
      counts.types[item.contentType] = (counts.types[item.contentType] || 0) + 1;
    });
    
    return counts;
  };
  
  const processedCounts = getProcessedCounts();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles: UploadedFile[] = Array.from(e.target.files).map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 11),
      file,
      contentType,
      name: file.name,
      size: formatBytes(file.size),
      content: "",
      status: "pending",
      aiGenerated: false,
      questions: [],
      language: feedbackLanguage,
      confidence: 0
    }));
    
    setFiles([...files, ...newFiles]);
    
    toast({
      title: `${newFiles.length} file(s) added`,
      description: "Files are ready for processing"
    });
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processFiles = async () => {
    if (files.length === 0 || files.every(f => f.status !== "pending")) {
      toast({
        title: "No files to process",
        description: "Please add files first"
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Process each pending file
    const updatedFiles = [...files];
    const pendingFiles = updatedFiles.filter(f => f.status === "pending");
    
    for (let i = 0; i < pendingFiles.length; i++) {
      const fileIndex = updatedFiles.findIndex(f => f.id === pendingFiles[i].id);
      
      try {
        updatedFiles[fileIndex] = {
          ...updatedFiles[fileIndex],
          status: "processing"
        };
        setFiles([...updatedFiles]);
        
        // Extract content from file
        const content = await extractContentFromFile(updatedFiles[fileIndex].file);
        
        // Update progress
        setProcessingProgress(Math.round(((i + 0.5) / pendingFiles.length) * 100));
        
        // Use AI to analyze content if enabled
        if (useAI) {
          const analysis = await analyzeContent(content, updatedFiles[fileIndex].file.type);
          
          // Update file with extracted content, analysis, and generated questions
          updatedFiles[fileIndex] = {
            ...updatedFiles[fileIndex],
            content,
            contentType: analysis.contentType,
            questions: analysis.suggestedQuestions,
            status: "success",
            aiGenerated: true,
            confidence: analysis.confidence,
            processedContent: {
              text: content,
              keywords: analysis.keywords,
              entities: analysis.entities,
              summary: analysis.summary
            }
          };
        } else {
          // Without AI, just store the extracted content
          updatedFiles[fileIndex] = {
            ...updatedFiles[fileIndex],
            content,
            status: "success",
            aiGenerated: false
          };
        }
        
        setFiles([...updatedFiles]);
        setProcessingProgress(Math.round(((i + 1) / pendingFiles.length) * 100));
        
      } catch (error) {
        updatedFiles[fileIndex] = {
          ...updatedFiles[fileIndex],
          status: "error"
        };
        
        setFiles([...updatedFiles]);
        
        toast({
          title: `Failed to process: ${updatedFiles[fileIndex].name}`,
          description: "An error occurred during processing",
          variant: "destructive"
        });
      }
    }
    
    // All files processed
    setIsProcessing(false);
    setCurrentTab("review");
    setProcessingProgress(100);
    
    toast({
      title: "Processing complete",
      description: `Successfully processed ${pendingFiles.filter(f => f.status !== "error").length} of ${pendingFiles.length} files`,
    });
  };

  const viewFileDetails = (file: UploadedFile) => {
    setSelectedFile(file);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const saveToSystem = () => {
    // Implementation for saving processed files to the system
    const savedCount = saveProcessedContent(files);
    
    toast({
      title: "Content saved",
      description: `${savedCount} files have been added to the learning system`
    });
    
    // Reset state
    setFiles([]);
    setCurrentTab("upload");
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };
  
  const handleExerciseAdded = () => {
    setFileProcessorAdded(true);
    toast({
      title: "File Processed",
      description: "The file has been processed and saved as a learning exercise",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Content Uploader</h2>
      <p className="text-muted-foreground mb-6">
        Upload files to create learning content and AI-generated questions
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Newspaper className="h-5 w-5 mr-2 text-blue-500" />
              Total Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{processedCounts.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Headphones className="h-5 w-5 mr-2 text-amber-500" />
              Listening
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{processedCounts.types?.listening || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Audio exercises</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckSquare className="h-5 w-5 mr-2 text-green-500" />
              Multiple Choice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{processedCounts.types?.["multiple-choice"] || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Quiz questions</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
              Other Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                (processedCounts.types?.flashcards || 0) + 
                (processedCounts.types?.writing || 0) + 
                (processedCounts.types?.speaking || 0)
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">Flashcards, writing, speaking</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="review">Review & Save</TabsTrigger>
          <TabsTrigger value="processor">File Processor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileUp className="mr-2 h-5 w-5" />
                Upload Content Files
              </CardTitle>
              <CardDescription>
                Upload files to create learning content. Supports text, PDF, audio, and more.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium">Content Type</label>
                  <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice Questions</SelectItem>
                      <SelectItem value="flashcards">Flashcards</SelectItem>
                      <SelectItem value="listening">Listening Exercises</SelectItem>
                      <SelectItem value="writing">Writing Prompts</SelectItem>
                      <SelectItem value="speaking">Speaking Exercises</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <label className="text-sm font-medium">Feedback Language</label>
                  <Select value={feedbackLanguage} onValueChange={(value: any) => setFeedbackLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English Only</SelectItem>
                      <SelectItem value="italian">Italian Only</SelectItem>
                      <SelectItem value="both">Both Languages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="ai-generation" checked={useAI} onCheckedChange={setUseAI} />
                <div className="flex items-center">
                  <Label htmlFor="ai-generation" className="flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Use AI to automatically categorize content and generate questions
                  </Label>
                  <Dialog open={isAIExplainerOpen} onOpenChange={setIsAIExplainerOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>AI Content Processing</DialogTitle>
                        <DialogDescription>
                          How our AI content analyzer works
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>
                          Our AI content analyzer uses natural language processing techniques to:
                        </p>
                        <ol className="list-decimal ml-5 space-y-2">
                          <li>Extract key concepts and vocabulary from your content</li>
                          <li>Categorize content into the most appropriate exercise type</li>
                          <li>Generate relevant questions based on the content</li>
                          <li>Identify important keywords and entities</li>
                          <li>Create a concise summary of the material</li>
                        </ol>
                        <p>
                          This helps you quickly turn raw content into structured learning exercises
                          without manual categorization or question creation.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  multiple
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="text/*,audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                />
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Drag & drop files or click to browse</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Support for text, PDF, audio, Word, and more
                </p>
              </div>
              
              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-3">Uploaded Files</h3>
                  <div className="space-y-2">
                    {files.map(file => (
                      <div 
                        key={file.id} 
                        className="flex items-center justify-between py-2 px-3 rounded-md bg-accent/30"
                      >
                        <div className="flex items-center">
                          {getFileIcon(file.file)}
                          <span className="ml-2 text-sm font-medium">{file.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">({file.size})</span>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {getContentTypeIcon(file.contentType)}
                            <span className="ml-1">{file.contentType}</span>
                          </Badge>
                          {getStatusIcon(file.status)}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(file.id);
                            }}
                          >
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Processing files...</span>
                    <span className="text-sm font-medium">{processingProgress}%</span>
                  </div>
                  <Progress value={processingProgress} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={processFiles}
                disabled={files.length === 0 || isProcessing}
                className="w-full md:w-auto"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Process Files
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="review" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Review Content
              </CardTitle>
              <CardDescription>
                Review extracted content and AI-generated questions before saving
              </CardDescription>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No files have been processed yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setCurrentTab("upload")}
                  >
                    Go to Upload
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map(file => (
                      <Card key={file.id} className={`overflow-hidden ${file.status === "success" ? "" : "opacity-60"}`}>
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getFileIcon(file.file)}
                              <CardTitle className="text-sm ml-2 truncate">{file.name}</CardTitle>
                            </div>
                            {getStatusIcon(file.status)}
                          </div>
                          <CardDescription className="flex items-center mt-2">
                            <Badge variant="outline" className="flex items-center">
                              {getContentTypeIcon(file.contentType)}
                              <span className="ml-1">{file.contentType}</span>
                            </Badge>
                            {file.aiGenerated && (
                              <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-100 flex items-center">
                                <Brain className="h-3 w-3 mr-1" />
                                AI Enhanced ({file.confidence}%)
                              </Badge>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-xs text-muted-foreground">
                            {file.status === "success" ? (
                              <div className="flex items-center">
                                <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                                <span>
                                  {file.aiGenerated 
                                    ? `Generated ${file.questions.length} questions` 
                                    : "Content extracted successfully"}
                                </span>
                              </div>
                            ) : file.status === "error" ? (
                              <div className="flex items-center text-red-500">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                <span>Processing failed</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                <span>Processing...</span>
                              </div>
                            )}
                          </div>
                          
                          {file.status === "success" && file.processedContent && (
                            <div className="mt-3 space-y-2">
                              <div className="text-xs font-medium">Keywords:</div>
                              <div className="flex flex-wrap gap-1">
                                {file.processedContent.keywords.slice(0, 5).map((keyword, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full"
                                disabled={file.status !== "success"}
                                onClick={() => viewFileDetails(file)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>{file.name}</DialogTitle>
                                <DialogDescription>
                                  {file.contentType} content with {file.aiGenerated ? "AI-generated" : "extracted"} questions
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid gap-4 py-4">
                                <Accordion type="single" collapsible defaultValue="content">
                                  <AccordionItem value="content">
                                    <AccordionTrigger>Extracted Content</AccordionTrigger>
                                    <AccordionContent>
                                      <Textarea
                                        readOnly
                                        value={file.content}
                                        className="min-h-[100px] font-mono text-sm"
                                      />
                                    </AccordionContent>
                                  </AccordionItem>
                                  
                                  {file.processedContent && (
                                    <AccordionItem value="analysis">
                                      <AccordionTrigger>AI Analysis</AccordionTrigger>
                                      <AccordionContent>
                                        <div className="space-y-4">
                                          <div>
                                            <div className="text-sm font-medium mb-1">Summary:</div>
                                            <p className="text-sm p-2 bg-accent/30 rounded">
                                              {file.processedContent.summary}
                                            </p>
                                          </div>
                                          
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <div className="text-sm font-medium mb-1">Keywords:</div>
                                              <div className="flex flex-wrap gap-1">
                                                {file.processedContent.keywords.map((keyword, i) => (
                                                  <Badge key={i} variant="outline">
                                                    {keyword}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>
                                            
                                            <div>
                                              <div className="text-sm font-medium mb-1">Entities:</div>
                                              <div className="flex flex-wrap gap-1">
                                                {file.processedContent.entities.map((entity, i) => (
                                                  <Badge key={i} variant="secondary">
                                                    {entity}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="text-sm">
                                            <div className="font-medium">Confidence in classification: </div>
                                            <div className="flex items-center mt-1">
                                              <div className="w-full h-2 bg-secondary rounded-full">
                                                <div 
                                                  className="h-2 bg-primary rounded-full" 
                                                  style={{ width: `${file.confidence}%` }}
                                                ></div>
                                              </div>
                                              <span className="ml-2">{file.confidence}%</span>
                                            </div>
                                          </div>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  )}
                                  
                                  {file.questions.length > 0 && (
                                    <AccordionItem value="questions">
                                      <AccordionTrigger>Generated Questions</AccordionTrigger>
                                      <AccordionContent>
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto p-2">
                                          {file.contentType === "multiple-choice" && file.questions.map((q, i) => (
                                            <div key={i} className="p-3 rounded-md bg-accent">
                                              <p className="font-medium text-sm">{q.question}</p>
                                              <div className="mt-2 space-y-1">
                                                {q.options.map((option: string, j: number) => (
                                                  <div key={j} className="flex items-start text-sm">
                                                    <div className={`min-w-4 h-4 rounded-full flex items-center justify-center mt-1 mr-2 ${option === q.correctAnswer ? 'bg-green-500' : 'bg-secondary'}`}>
                                                      {option === q.correctAnswer && (
                                                        <CheckCircle2 className="h-3 w-3 text-white" />
                                                      )}
                                                    </div>
                                                    <span>{option}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ))}
                                          
                                          {file.contentType === "flashcards" && file.questions.map((q, i) => (
                                            <div key={i} className="p-3 rounded-md bg-accent">
                                              <div className="font-medium text-sm">Front:</div>
                                              <p className="p-2 bg-background rounded mt-1">{q.front}</p>
                                              <div className="font-medium text-sm mt-2">Back:</div>
                                              <p className="p-2 bg-background rounded mt-1">{q.back}</p>
                                            </div>
                                          ))}
                                          
                                          {file.contentType === "listening" && file.questions.map((q, i) => (
                                            <div key={i} className="p-3 rounded-md bg-accent">
                                              <div className="font-medium text-sm">Audio Transcript:</div>
                                              <p className="p-2 bg-background rounded mt-1 text-xs">{q.audioTranscript}</p>
                                              <p className="font-medium text-sm mt-2">{q.question}</p>
                                              <div className="mt-2 space-y-1">
                                                {q.options.map((option: string, j: number) => (
                                                  <div key={j} className="flex items-start text-sm">
                                                    <div className={`min-w-4 h-4 rounded-full flex items-center justify-center mt-1 mr-2 ${option === q.correctAnswer ? 'bg-green-500' : 'bg-secondary'}`}>
                                                      {option === q.correctAnswer && (
                                                        <CheckCircle2 className="h-3 w-3 text-white" />
                                                      )}
                                                    </div>
                                                    <span>{option}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ))}
                                          
                                          {file.contentType === "writing" && file.questions.map((q, i) => (
                                            <div key={i} className="p-3 rounded-md bg-accent">
                                              <div className="font-medium text-sm">Writing Prompt:</div>
                                              <p className="p-2 bg-background rounded mt-1">{q.prompt}</p>
                                              <div className="flex justify-between text-xs mt-2">
                                                <span>Min words: {q.minWords}</span>
                                                <span>Max words: {q.maxWords}</span>
                                              </div>
                                              <div className="font-medium text-sm mt-2">Evaluation Criteria:</div>
                                              <ul className="list-disc list-inside text-xs mt-1">
                                                {q.criteria.map((criterion: string, j: number) => (
                                                  <li key={j}>{criterion}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          ))}
                                          
                                          {file.contentType === "speaking" && file.questions.map((q, i) => (
                                            <div key={i} className="p-3 rounded-md bg-accent">
                                              <div className="font-medium text-sm">Speaking Prompt:</div>
                                              <p className="p-2 bg-background rounded mt-1">{q.prompt}</p>
                                              <div className="flex justify-between text-xs mt-2">
                                                <span>Preparation: {q.preparationTime} seconds</span>
                                                <span>Duration: {q.duration} seconds</span>
                                              </div>
                                              <div className="font-medium text-sm mt-2">Evaluation Criteria:</div>
                                              <ul className="list-disc list-inside text-xs mt-1">
                                                {q.criteria.map((criterion: string, j: number) => (
                                                  <li key={j}>{criterion}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          ))}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  )}
                                </Accordion>
                                
                                <div className="flex items-center space-x-2">
                                  <div className="grid gap-2 flex-1">
                                    <Label htmlFor="feedback-language">Feedback Language</Label>
                                    <Select value={file.language} onValueChange={(value: any) => {
                                      const updatedFiles = files.map(f => 
                                        f.id === file.id ? {...f, language: value} : f
                                      );
                                      setFiles(updatedFiles);
                                    }}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="english">English Only</SelectItem>
                                        <SelectItem value="italian">Italian Only</SelectItem>
                                        <SelectItem value="both">Both Languages</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 pt-6">
                                    <Switch 
                                      id="detailed-feedback" 
                                      checked={showDetailedFeedback} 
                                      onCheckedChange={setShowDetailedFeedback} 
                                    />
                                    <Label htmlFor="detailed-feedback">Detailed AI Feedback</Label>
                                  </div>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button type="button">Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button
                      variant="default"
                      onClick={saveToSystem}
                      disabled={files.filter(f => f.status === "success").length === 0}
                      className="w-full sm:w-auto"
                    >
                      Save All to Learning System
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processor" className="mt-6">
          <FileProcessor onExerciseAdded={handleExerciseAdded} />
          
          {fileProcessorAdded && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium">File processed successfully!</span>
              </div>
              <p className="text-sm mt-2">
                The file has been processed and added as a learning exercise.
                You can now access it in the appropriate section of the learning app.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-6 bg-accent/30 rounded-lg">
        <h3 className="text-lg font-bold flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          AI Information
        </h3>
        <p className="mt-2 text-muted-foreground">
          This system uses natural language processing for content analysis and automatic question generation:
        </p>
        <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
          <li>Content categorization: Determines the most appropriate exercise type based on content analysis</li>
          <li>Question generation: Automatically creates appropriate questions or exercises from your content</li>
          <li>Keyword extraction: Identifies important terms and concepts from your materials</li>
          <li>Entity recognition: Finds and categorizes proper nouns and important elements</li>
          <li>Text summarization: Creates concise summaries to highlight key information</li>
        </ul>
        <div className="mt-4 text-sm">
          <p className="font-medium">Key benefits for educators:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Save time by automating question creation and content categorization</li>
            <li>Ensure consistent coverage of important concepts across learning materials</li>
            <li>Focus on tailoring content rather than formatting and organizing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentUploader;
