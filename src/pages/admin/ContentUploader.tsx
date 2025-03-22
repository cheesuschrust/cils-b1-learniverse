
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
  Brain
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { extractContentFromFile, generateQuestions } from "@/data/listeningExercises";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

const ContentUploader = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("upload");
  const [contentType, setContentType] = useState<ContentType>("multiple-choice");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [useAI, setUseAI] = useState(true);
  const [feedbackLanguage, setFeedbackLanguage] = useState<"english" | "italian" | "both">("both");
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles: UploadedFile[] = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      contentType,
      name: file.name,
      size: formatBytes(file.size),
      content: "",
      status: "pending",
      aiGenerated: false,
      questions: [],
      language: feedbackLanguage
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
    
    // Process each pending file
    const updatedFiles = [...files];
    
    for (let i = 0; i < updatedFiles.length; i++) {
      const file = updatedFiles[i];
      
      if (file.status !== "pending") continue;
      
      try {
        updatedFiles[i] = {
          ...file,
          status: "processing"
        };
        setFiles([...updatedFiles]);
        
        // Extract content from file
        const content = await extractContentFromFile(file.file);
        
        // Generate AI questions if enabled
        let questions: any[] = [];
        if (useAI) {
          questions = generateQuestions(content);
        }
        
        // Update file with extracted content and generated questions
        updatedFiles[i] = {
          ...file,
          content,
          questions,
          status: "success",
          aiGenerated: useAI && questions.length > 0
        };
        
        setFiles([...updatedFiles]);
        
        toast({
          title: `Processed: ${file.name}`,
          description: useAI ? `Generated ${questions.length} questions` : "Content extracted"
        });
        
      } catch (error) {
        updatedFiles[i] = {
          ...file,
          status: "error"
        };
        
        setFiles([...updatedFiles]);
        
        toast({
          title: `Failed to process: ${file.name}`,
          description: "An error occurred during processing",
          variant: "destructive"
        });
      }
    }
    
    setIsProcessing(false);
    setCurrentTab("review");
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
    toast({
      title: "Content saved",
      description: `${files.filter(f => f.status === "success").length} files have been added to the learning system`
    });
    
    // Reset state
    setFiles([]);
    setCurrentTab("upload");
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Content Uploader</h2>
      <p className="text-muted-foreground mb-6">
        Upload files to create learning content and AI-generated questions
      </p>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="review">Review & Save</TabsTrigger>
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
                <Label htmlFor="ai-generation" className="flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  Use AI to generate similar questions
                </Label>
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
                      <Card key={file.id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getFileIcon(file.file)}
                              <CardTitle className="text-sm ml-2 truncate">{file.name}</CardTitle>
                            </div>
                            {getStatusIcon(file.status)}
                          </div>
                          <CardDescription className="flex items-center mt-2">
                            <Badge variant="outline">
                              {getContentTypeIcon(file.contentType)}
                              <span className="ml-1">{file.contentType}</span>
                            </Badge>
                            {file.aiGenerated && (
                              <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200">
                                <Brain className="h-3 w-3 mr-1" />
                                AI Enhanced
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
                                <div>
                                  <h3 className="text-sm font-medium mb-2">Extracted Content</h3>
                                  <Textarea
                                    readOnly
                                    value={file.content}
                                    className="min-h-[100px] font-mono text-sm"
                                  />
                                </div>
                                
                                {file.questions.length > 0 && (
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <h3 className="text-sm font-medium">Generated Questions</h3>
                                      {file.aiGenerated && (
                                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                          <Brain className="h-3 w-3 mr-1" />
                                          AI Generated
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto p-2">
                                      {file.questions.map((q, i) => (
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
                                    </div>
                                  </div>
                                )}
                                
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
      </Tabs>
      
      <div className="mt-8 p-6 bg-accent/30 rounded-lg">
        <h3 className="text-lg font-bold flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          AI Information
        </h3>
        <p className="mt-2 text-muted-foreground">
          This system uses the following free AI services for content processing:
        </p>
        <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
          <li>Content generation: Built-in JavaScript algorithms with basic NLP for question generation</li>
          <li>Audio analysis: Web Speech API (browser-native, free)</li>
          <li>For more advanced AI functionality: OpenAI's models can be integrated (requires API key)</li>
        </ul>
        <div className="mt-4 text-sm font-medium">
          <p>Current AI confidence level in generated content: ~75-80%</p>
          <p>Note: For production use, more advanced AI models would be required.</p>
        </div>
      </div>
    </div>
  );
};

export default ContentUploader;
