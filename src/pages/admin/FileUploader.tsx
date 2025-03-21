
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  FileUp,
  CheckCircle,
  X,
  BookOpen,
  PenTool,
  Headphones,
  Brain,
  Download,
  Save,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { listeningExercises, ListeningExercise } from "@/data/listeningExercises";

type FileType = "text" | "audio" | "pdf" | "unknown";
type ExerciseType = "listening" | "reading" | "writing" | "multiple-choice";

interface AnalyzedFile {
  file: File;
  name: string;
  type: FileType;
  content: string;
  suggestedExerciseType: ExerciseType;
  analyzed: boolean;
}

const FileUploader = () => {
  const [files, setFiles] = useState<AnalyzedFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [exerciseTitle, setExerciseTitle] = useState("");
  const [exerciseType, setExerciseType] = useState<ExerciseType>("listening");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [questions, setQuestions] = useState<any[]>([]);
  const [generatedExercise, setGeneratedExercise] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles: AnalyzedFile[] = [];
    
    Array.from(e.target.files).forEach(file => {
      const fileType = getFileType(file);
      newFiles.push({
        file,
        name: file.name,
        type: fileType,
        content: "",
        suggestedExerciseType: suggestExerciseType(fileType),
        analyzed: false
      });
    });

    setFiles([...files, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    toast({
      title: `${newFiles.length} file(s) uploaded`,
      description: "Click on a file to analyze its content"
    });
  };

  const getFileType = (file: File): FileType => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type === "application/pdf" || ext === "pdf") return "pdf";
    if (file.type.startsWith("text/") || ["txt", "md", "rtf"].includes(ext || "")) return "text";
    
    return "unknown";
  };

  const suggestExerciseType = (fileType: FileType): ExerciseType => {
    switch (fileType) {
      case "audio": return "listening";
      case "pdf": return "reading";
      case "text": return "reading";
      default: return "multiple-choice";
    }
  };

  const analyzeFile = async (index: number) => {
    const file = files[index];
    if (!file) return;

    // If already analyzed, just select it
    if (file.analyzed) {
      setSelectedFileIndex(index);
      return;
    }
    
    try {
      let content = "";
      
      if (file.type === "text") {
        content = await file.file.text();
      } else if (file.type === "pdf") {
        content = "PDF content would be extracted here in a real application";
      } else if (file.type === "audio") {
        content = "Audio transcription would happen here in a real application";
      } else {
        content = "Unknown file type. Content cannot be extracted.";
      }
      
      const updatedFiles = [...files];
      updatedFiles[index] = {
        ...file,
        content,
        analyzed: true
      };
      
      setFiles(updatedFiles);
      setSelectedFileIndex(index);
      
      // Set suggested exercise properties
      setExerciseType(file.suggestedExerciseType);
      setExerciseTitle(file.name.split('.')[0].replace(/_/g, ' '));
      
      // Generate sample questions based on content
      const sampleQuestions = generateSampleQuestions(content, file.suggestedExerciseType);
      setQuestions(sampleQuestions);
      
      toast({
        title: "File analyzed",
        description: `Suggested exercise type: ${file.suggestedExerciseType}`
      });
    } catch (error) {
      toast({
        title: "Error analyzing file",
        description: "There was a problem processing this file",
        variant: "destructive"
      });
    }
  };

  const generateSampleQuestions = (content: string, type: ExerciseType) => {
    // This is a simplified example. In a real app, you might use AI to generate questions
    const contentSample = content.slice(0, 200);
    const words = contentSample.split(/\s+/).filter(w => w.length > 3);
    
    if (type === "multiple-choice") {
      return [1, 2, 3].map(num => ({
        id: num,
        question: `Sample question ${num} about "${words[num] || 'the content'}"?`,
        options: [
          `Option A for question ${num}`,
          `Option B for question ${num}`,
          `Option C for question ${num}`,
          `Option D for question ${num}`
        ],
        correctAnswer: `Option A for question ${num}`
      }));
    }
    
    if (type === "listening") {
      return [1, 2, 3].map(num => ({
        id: num,
        question: `What does the speaker say about "${words[num] || 'the topic'}"?`,
        options: [
          `They mention it's important`,
          `They don't refer to it`,
          `They provide historical context`,
          `They express a personal opinion`
        ],
        correctAnswer: `They mention it's important`
      }));
    }
    
    return [];
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: ""
      }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const generateExercise = () => {
    if (!selectedFileIndex && selectedFileIndex !== 0) {
      toast({
        title: "No file selected",
        description: "Please select a file to generate an exercise",
        variant: "destructive"
      });
      return;
    }
    
    const selectedFile = files[selectedFileIndex];
    
    // Create exercise object based on type
    const exercise = {
      id: Date.now(),
      title: exerciseTitle,
      difficulty,
      type: exerciseType,
      content: selectedFile.content,
      questions: exerciseType === "multiple-choice" || exerciseType === "listening" ? questions : [],
      // For listening exercises
      audioUrl: selectedFile.type === "audio" ? URL.createObjectURL(selectedFile.file) : "",
      transcript: selectedFile.type === "audio" ? selectedFile.content : ""
    };
    
    setGeneratedExercise(exercise);
    
    toast({
      title: "Exercise generated",
      description: `${exerciseTitle} (${exerciseType}) has been created`
    });
  };

  const exportExercise = () => {
    if (!generatedExercise) return;
    
    const exerciseData = JSON.stringify(generatedExercise, null, 2);
    const blob = new Blob([exerciseData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exerciseTitle.replace(/\s+/g, '_')}_exercise.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Exercise exported",
      description: "JSON file has been downloaded"
    });
  };

  const saveExercise = () => {
    if (!generatedExercise || exerciseType !== "listening") {
      toast({
        title: "Cannot save exercise",
        description: "Only listening exercises can be saved directly at this time",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save to a database
    // For now, we're simulating adding to the listeningExercises array
    console.log("Exercise saved:", generatedExercise);
    
    toast({
      title: "Exercise saved",
      description: "The listening exercise has been added to the collection",
    });
  };

  const getExerciseTypeIcon = (type: ExerciseType) => {
    switch (type) {
      case "listening": return <Headphones className="h-5 w-5" />;
      case "reading": return <BookOpen className="h-5 w-5" />;
      case "writing": return <PenTool className="h-5 w-5" />;
      case "multiple-choice": return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold tracking-tight animate-fade-in">
          Training File Uploader
        </h1>
        <Link to="/admin/dashboard">
          <Button variant="outline" size="sm">Back to Dashboard</Button>
        </Link>
      </div>
      <p className="text-muted-foreground mb-8 animate-fade-in">
        Upload files to create language learning exercises
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 backdrop-blur-sm border-accent/20">
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>
              Upload and manage your files for generating exercises
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="border-2 border-dashed border-muted rounded-md p-6 text-center cursor-pointer hover:bg-accent/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files, or click to browse
              </p>
              <Input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload} 
                multiple
              />
              <Button variant="secondary" size="sm" onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}>
                Choose Files
              </Button>
            </div>
            
            {files.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">Uploaded Files ({files.length})</p>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-md flex items-center justify-between cursor-pointer hover:bg-accent/10 transition-colors ${
                        selectedFileIndex === index ? "bg-accent/20" : "bg-card"
                      }`}
                      onClick={() => analyzeFile(index)}
                    >
                      <div className="flex items-center">
                        {file.type === "audio" && <Headphones className="h-4 w-4 mr-2 text-blue-500" />}
                        {file.type === "text" && <FileText className="h-4 w-4 mr-2 text-green-500" />}
                        {file.type === "pdf" && <FileText className="h-4 w-4 mr-2 text-red-500" />}
                        {file.type === "unknown" && <FileText className="h-4 w-4 mr-2 text-gray-500" />}
                        <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                      </div>
                      {file.analyzed && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 backdrop-blur-sm border-accent/20">
          <CardHeader>
            <CardTitle>Generate Exercise</CardTitle>
            <CardDescription>
              Create learning materials from your uploaded files
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedFileIndex !== null && selectedFileIndex >= 0 && selectedFileIndex < files.length ? (
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="edit">Edit Exercise</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="export">Export/Save</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Exercise Title</label>
                      <Input 
                        value={exerciseTitle} 
                        onChange={(e) => setExerciseTitle(e.target.value)}
                        placeholder="Enter a title for this exercise"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Exercise Type</label>
                      <Select 
                        value={exerciseType}
                        onValueChange={(value: any) => setExerciseType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select exercise type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="listening">
                            <div className="flex items-center">
                              <Headphones className="h-4 w-4 mr-2" />
                              <span>Listening Comprehension</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="reading">
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-2" />
                              <span>Reading Comprehension</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="writing">
                            <div className="flex items-center">
                              <PenTool className="h-4 w-4 mr-2" />
                              <span>Writing Exercise</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="multiple-choice">
                            <div className="flex items-center">
                              <Brain className="h-4 w-4 mr-2" />
                              <span>Multiple Choice Quiz</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty Level</label>
                    <Select 
                      value={difficulty}
                      onValueChange={(value: any) => setDifficulty(value)}
                    >
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
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content/Transcript</label>
                    <Textarea 
                      value={files[selectedFileIndex]?.content || ""} 
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[selectedFileIndex] = {
                          ...updatedFiles[selectedFileIndex],
                          content: e.target.value
                        };
                        setFiles(updatedFiles);
                      }}
                      placeholder="Content or transcript of the file"
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  {(exerciseType === "multiple-choice" || exerciseType === "listening") && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Questions</label>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleAddQuestion}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                      
                      {questions.map((question, qIndex) => (
                        <Card key={qIndex} className="border border-accent/10">
                          <CardHeader className="py-3 px-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleRemoveQuestion(qIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="py-3 px-4 space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Question Text</label>
                              <Input 
                                value={question.question} 
                                onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                                placeholder="Enter the question"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Options</label>
                              {question.options.map((option: string, oIndex: number) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                  <Input 
                                    value={option} 
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                  />
                                </div>
                              ))}
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Correct Answer</label>
                              <Select 
                                value={question.correctAnswer} 
                                onValueChange={(value) => handleCorrectAnswerChange(qIndex, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select correct answer" />
                                </SelectTrigger>
                                <SelectContent>
                                  {question.options.map((option: string, oIndex: number) => (
                                    <SelectItem key={oIndex} value={option}>
                                      {option || `Option ${String.fromCharCode(65 + oIndex)}`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button onClick={generateExercise}>
                      Generate Exercise
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview">
                  {generatedExercise ? (
                    <div className="space-y-6">
                      <div className="bg-accent/10 p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">{generatedExercise.title}</h3>
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {generatedExercise.difficulty}
                          </span>
                          <span className="text-sm flex items-center">
                            {getExerciseTypeIcon(generatedExercise.type)}
                            <span className="ml-1 capitalize">{generatedExercise.type}</span>
                          </span>
                        </div>
                        
                        {generatedExercise.type === "listening" && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Audio:</p>
                            <audio controls className="w-full">
                              <source src={generatedExercise.audioUrl} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                            <p className="text-sm font-medium mt-4 mb-2">Transcript:</p>
                            <p className="text-sm bg-background p-4 rounded-md">
                              {generatedExercise.transcript}
                            </p>
                          </div>
                        )}
                        
                        {(generatedExercise.type === "multiple-choice" || generatedExercise.type === "listening") && (
                          <div className="space-y-4 mt-4">
                            <p className="text-sm font-medium">Questions:</p>
                            {generatedExercise.questions.map((q: any, i: number) => (
                              <div key={i} className="space-y-2 bg-background p-4 rounded-md">
                                <p className="font-medium">{i + 1}. {q.question}</p>
                                <div className="space-y-1">
                                  {q.options.map((option: string, j: number) => (
                                    <div key={j} className="flex items-center">
                                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs ${
                                        option === q.correctAnswer 
                                          ? "bg-green-500 text-white" 
                                          : "bg-gray-200"
                                      }`}>
                                        {String.fromCharCode(65 + j)}
                                      </div>
                                      <span>{option}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p>Generate an exercise to preview it here</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="export">
                  {generatedExercise ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="backdrop-blur-sm border-accent/20">
                          <CardHeader>
                            <div className="flex items-center">
                              <Download className="h-5 w-5 mr-2" />
                              <CardTitle className="text-base">Export Exercise</CardTitle>
                            </div>
                            <CardDescription>
                              Download this exercise as a JSON file
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button onClick={exportExercise} className="w-full">
                              <Download className="h-4 w-4 mr-2" />
                              Export JSON
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card className="backdrop-blur-sm border-accent/20">
                          <CardHeader>
                            <div className="flex items-center">
                              <Save className="h-5 w-5 mr-2" />
                              <CardTitle className="text-base">Save to Collection</CardTitle>
                            </div>
                            <CardDescription>
                              Add this exercise to the application
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button 
                              onClick={saveExercise} 
                              className="w-full"
                              disabled={exerciseType !== "listening"}
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Exercise
                            </Button>
                            {exerciseType !== "listening" && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Note: Currently only listening exercises can be saved directly
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p>Generate an exercise first to enable export options</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <FileUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="mb-2">No file selected</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload and select a file to start creating your exercise
                </p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileUploader;
