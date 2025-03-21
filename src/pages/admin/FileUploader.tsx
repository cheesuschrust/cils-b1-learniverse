
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, FileType, FilePlus, Check, AlertCircle } from "lucide-react";
import { ListeningExercise, ListeningQuestion } from "@/data/listeningExercises";

const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileContents, setFileContents] = useState<{[filename: string]: string}>({});
  const [analyzedResults, setAnalyzedResults] = useState<{[filename: string]: string}>({});
  const [selectedExerciseType, setSelectedExerciseType] = useState<{[filename: string]: string}>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    
    // Read file contents
    for (const file of newFiles) {
      try {
        const text = await file.text();
        setFileContents(prev => ({
          ...prev,
          [file.name]: text
        }));
        
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      } catch (error) {
        console.error("Error reading file:", error);
        toast({
          title: "Error reading file",
          description: `Could not read ${file.name}. Please try again.`,
          variant: "destructive",
        });
      }
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
    
    // Also remove content and analysis if they exist
    const newContents = { ...fileContents };
    delete newContents[fileName];
    setFileContents(newContents);
    
    const newResults = { ...analyzedResults };
    delete newResults[fileName];
    setAnalyzedResults(newResults);
    
    const newTypes = { ...selectedExerciseType };
    delete newTypes[fileName];
    setSelectedExerciseType(newTypes);
  };

  const analyzeFiles = () => {
    if (files.length === 0) {
      toast({
        title: "No files to analyze",
        description: "Please upload at least one file first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simple analysis based on file content
    // In a real app, this would be more sophisticated, possibly using AI
    const results: {[filename: string]: string} = {};
    const suggestedTypes: {[filename: string]: string} = {};
    
    for (const file of files) {
      const content = fileContents[file.name] || "";
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      // Determine potential exercise type based on content and file type
      if (fileExt === 'mp3' || fileExt === 'wav' || fileExt === 'm4a') {
        results[file.name] = "Audio file detected. Suitable for listening exercises.";
        suggestedTypes[file.name] = "listening";
      } else if (fileExt === 'txt' || fileExt === 'docx' || fileExt === 'pdf') {
        // Text analysis simulation
        if (content.length > 500) {
          results[file.name] = "Long text detected. Suitable for reading exercises or as a transcript for listening exercises.";
          suggestedTypes[file.name] = "reading";
        } else if (content.includes('?')) {
          results[file.name] = "Questions detected. Suitable for multiple choice or writing exercises.";
          suggestedTypes[file.name] = "multiple-choice";
        } else {
          results[file.name] = "Text content detected. Could be used for vocabulary or grammar exercises.";
          suggestedTypes[file.name] = "writing";
        }
      } else {
        results[file.name] = "Unrecognized file type. Please review manually.";
        suggestedTypes[file.name] = "";
      }
    }
    
    // Simulate processing delay
    setTimeout(() => {
      setAnalyzedResults(results);
      setSelectedExerciseType(suggestedTypes);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: `Analyzed ${files.length} files. Please review the suggestions.`,
      });
    }, 1500);
  };

  const createExerciseFromFile = (fileName: string) => {
    const content = fileContents[fileName] || "";
    const exerciseType = selectedExerciseType[fileName] || "";
    
    let processedExercise;
    
    if (exerciseType === "listening") {
      // Create a listening exercise structure
      processedExercise = {
        type: "listening",
        title: fileName.replace(/\.[^/.]+$/, ""),
        audioUrl: URL.createObjectURL(files.find(f => f.name === fileName) || new Blob()),
        transcript: content,
        difficulty: "Intermediate",
        questions: generateSimpleQuestions(content),
      };
    } else if (exerciseType === "multiple-choice") {
      // Create a multiple choice exercise
      processedExercise = {
        type: "multiple-choice",
        title: fileName.replace(/\.[^/.]+$/, ""),
        questions: parseQuestionsFromText(content),
      };
    } else if (exerciseType === "writing") {
      // Create a writing exercise
      processedExercise = {
        type: "writing",
        title: fileName.replace(/\.[^/.]+$/, ""),
        prompt: content.substring(0, 200),
        fullContent: content,
      };
    } else if (exerciseType === "reading") {
      // Create a reading exercise
      processedExercise = {
        type: "reading",
        title: fileName.replace(/\.[^/.]+$/, ""),
        content: content,
        questions: generateSimpleQuestions(content),
      };
    }
    
    setProcessedData(processedExercise);
    
    toast({
      title: "Exercise created",
      description: `Created a ${exerciseType} exercise from ${fileName}`,
    });
  };

  // Helper functions to parse/generate questions
  const parseQuestionsFromText = (text: string): any[] => {
    // This is a simplified parser - in a real app you would use more sophisticated parsing
    const questions = [];
    const lines = text.split('\n');
    
    let currentQuestion = '';
    let options: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.endsWith('?')) {
        // This looks like a question
        currentQuestion = line;
        options = [];
      } else if (line.startsWith('- ') || line.startsWith('* ') || /^[A-D]\./.test(line)) {
        // This looks like an option
        options.push(line.replace(/^[- *A-D]\.\s*/, ''));
      }
      
      // If we have a question and some options, add it to our questions array
      if (currentQuestion && options.length >= 2 && 
          (i === lines.length - 1 || lines[i+1].trim() === '' || lines[i+1].trim().endsWith('?'))) {
        questions.push({
          id: questions.length + 1,
          question: currentQuestion,
          options: options,
          correctAnswer: options[0], // Default to first option as correct answer
        });
        
        currentQuestion = '';
        options = [];
      }
    }
    
    return questions.length > 0 ? questions : generateSimpleQuestions(text);
  };

  const generateSimpleQuestions = (text: string): any[] => {
    // Very simple question generator
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const questions = [];
    
    // Take up to 3 sentences to create questions
    for (let i = 0; i < Math.min(3, sentences.length); i++) {
      const sentence = sentences[i].trim();
      if (sentence.length > 10) {
        const words = sentence.split(' ');
        const keywordIndex = Math.floor(words.length / 2);
        const keyword = words[keywordIndex];
        
        // Create a simple question by replacing a keyword with a blank
        const question = `What word completes this sentence: "${sentence.replace(keyword, '_____')}"?`;
        
        // Generate some plausible options
        const correctAnswer = keyword;
        const otherOptions = ["option 1", "option 2", "option 3"];
        
        questions.push({
          id: i + 1,
          question,
          options: [correctAnswer, ...otherOptions],
          correctAnswer,
        });
      }
    }
    
    return questions;
  };

  const exportToJSON = () => {
    if (!processedData) return;
    
    const dataStr = JSON.stringify(processedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${processedData.title || 'exercise'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Export complete",
      description: "The exercise data has been exported as JSON.",
    });
  };

  const saveToListeningExercises = () => {
    if (!processedData || processedData.type !== "listening") {
      toast({
        title: "Invalid data",
        description: "Only listening exercises can be saved to the listening exercises database.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would update your database
    // For now, we'll just show a success message
    toast({
      title: "Exercise saved",
      description: "The listening exercise has been saved to the database.",
    });
    
    // Clear the processed data
    setProcessedData(null);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2 animate-fade-in">
        File Upload & Analysis
      </h1>
      <p className="text-muted-foreground mb-8 animate-fade-in">
        Upload teaching materials to create exercises automatically
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="backdrop-blur-sm border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                File Upload
              </CardTitle>
              <CardDescription>
                Upload files to analyze and convert into exercises
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drag files here or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Support for .txt, .pdf, .docx, .mp3, .wav and other formats
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Uploaded Files ({files.length})</h3>
                  <div className="max-h-[300px] overflow-y-auto">
                    {files.map((file) => (
                      <div 
                        key={file.name} 
                        className="flex items-center justify-between p-3 border rounded-md mb-2"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFile(file.name)}
                          className="text-red-500 h-8 w-8 p-0"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={analyzeFiles}
                    disabled={isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Files"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {Object.keys(analyzedResults).length > 0 && (
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileType className="h-5 w-5 mr-2" />
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  Review the analysis and select exercise types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {files.map((file) => (
                  <div key={file.name} className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium">{file.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {analyzedResults[file.name] || "Not analyzed yet"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs" htmlFor={`type-${file.name}`}>
                          Exercise Type
                        </Label>
                        <Select
                          value={selectedExerciseType[file.name] || ""}
                          onValueChange={(value) => 
                            setSelectedExerciseType({
                              ...selectedExerciseType,
                              [file.name]: value
                            })
                          }
                        >
                          <SelectTrigger id={`type-${file.name}`}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="listening">Listening</SelectItem>
                            <SelectItem value="reading">Reading</SelectItem>
                            <SelectItem value="writing">Writing</SelectItem>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Button 
                          className="mt-5 w-full"
                          disabled={!selectedExerciseType[file.name]}
                          onClick={() => createExerciseFromFile(file.name)}
                        >
                          Create Exercise
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          {processedData && (
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FilePlus className="h-5 w-5 mr-2" />
                  Generated Exercise
                </CardTitle>
                <CardDescription>
                  {processedData.type.charAt(0).toUpperCase() + processedData.type.slice(1)} exercise generated from your file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">{processedData.title}</h3>
                  
                  {processedData.type === "listening" && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-sm font-medium">Audio Source:</p>
                        <p className="text-sm">{processedData.audioUrl ? "Audio file uploaded" : "No audio file"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Transcript ({processedData.transcript.length} characters):</p>
                        <p className="text-sm line-clamp-3">{processedData.transcript}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Generated Questions ({processedData.questions.length}):</p>
                        <ul className="text-sm list-disc list-inside">
                          {processedData.questions.map((q: any, i: number) => (
                            <li key={i} className="line-clamp-1">{q.question}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {processedData.type === "multiple-choice" && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-sm font-medium">Questions ({processedData.questions.length}):</p>
                        <ul className="text-sm list-disc list-inside">
                          {processedData.questions.map((q: any, i: number) => (
                            <li key={i} className="line-clamp-1">{q.question}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {processedData.type === "writing" && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-sm font-medium">Writing Prompt:</p>
                        <p className="text-sm">{processedData.prompt}</p>
                      </div>
                    </div>
                  )}
                  
                  {processedData.type === "reading" && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-sm font-medium">Content ({processedData.content.length} characters):</p>
                        <p className="text-sm line-clamp-3">{processedData.content}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Generated Questions ({processedData.questions.length}):</p>
                        <ul className="text-sm list-disc list-inside">
                          {processedData.questions.map((q: any, i: number) => (
                            <li key={i} className="line-clamp-1">{q.question}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={exportToJSON}
                  >
                    Export as JSON
                  </Button>
                  
                  {processedData.type === "listening" && (
                    <Button 
                      className="flex-1"
                      onClick={saveToListeningExercises}
                    >
                      Save to Listening Exercises
                    </Button>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p>Note: This is a simple exercise generation system. In a real application, you would have more sophisticated analysis and generation capabilities, possibly using AI to create better questions and determine the most appropriate exercise type.</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!processedData && (
            <Card className="backdrop-blur-sm border-accent/20 h-full flex flex-col justify-center items-center p-8">
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileType className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-lg">Exercise Generation</h3>
                <p className="text-muted-foreground text-sm">
                  Upload and analyze files to automatically generate exercises. 
                  The system will suggest appropriate exercise types based on file content.
                </p>
                <div className="pt-3">
                  <ul className="text-sm text-left space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Text files can become reading or multiple-choice exercises</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Audio files are perfect for listening comprehension</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>The system attempts to generate questions automatically</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Export exercises as JSON or save them directly</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
