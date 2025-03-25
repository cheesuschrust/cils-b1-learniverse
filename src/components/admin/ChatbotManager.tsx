
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Bot, 
  Settings, 
  Database, 
  Trash2, 
  Pencil, 
  Plus, 
  Save,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  FileText,
  Upload,
  Download,
  Play,
  Globe,
  Brain
} from 'lucide-react';
import * as ChatbotService from '@/services/ChatbotService';
import { useToast } from '@/components/ui/use-toast';
import { ChatbotSettings, ChatbotTrainingExample, ChatMessage, ChatSession, KnowledgeBaseEntry } from '@/types/chatbot';

// Mock chat messages
const mockChatMessages: ChatMessage[] = [
  { 
    id: "msg1", 
    text: "Ciao! Come posso aiutarti oggi?", 
    isUser: false, 
    timestamp: new Date(Date.now() - 1000000) 
  },
  { 
    id: "msg2", 
    text: "Vorrei sapere come usare i verbi al passato prossimo", 
    isUser: true, 
    timestamp: new Date(Date.now() - 900000) 
  },
  { 
    id: "msg3", 
    text: "Il passato prossimo in italiano si forma con l'ausiliare (essere o avere) + il participio passato del verbo. Ad esempio: 'Io ho mangiato' o 'Maria è andata'. I verbi di movimento usano essere, mentre la maggior parte degli altri verbi usa avere.", 
    isUser: false, 
    timestamp: new Date(Date.now() - 800000),
    feedback: 'positive'
  },
  { 
    id: "msg4", 
    text: "Puoi farmi un esempio con il verbo 'vedere'?", 
    isUser: true, 
    timestamp: new Date(Date.now() - 700000) 
  },
  { 
    id: "msg5", 
    text: "Certo! Il verbo 'vedere' al passato prossimo usa l'ausiliare 'avere'. Ecco alcuni esempi:\n\n- Io ho visto un film ieri.\n- Tu hai visto la mia penna?\n- Lui ha visto il suo amico al parco.\n- Noi abbiamo visto un bel tramonto.\n- Voi avete visto la nuova mostra d'arte?\n- Loro hanno visto lo spettacolo a teatro.", 
    isUser: false, 
    timestamp: new Date(Date.now() - 600000),
    feedback: 'positive'
  }
];

// Mock chat sessions
const mockSessions: ChatSession[] = [
  {
    id: "session1",
    userId: "user123",
    messages: mockChatMessages,
    startedAt: new Date(Date.now() - 1000000),
    lastActivityAt: new Date(Date.now() - 600000),
    context: {
      userType: "student",
      language: "english"
    },
    resolved: false,
    escalatedToHuman: false
  },
  {
    id: "session2",
    userId: "user456",
    messages: mockChatMessages.slice(0, 3),
    startedAt: new Date(Date.now() - 3000000),
    lastActivityAt: new Date(Date.now() - 2800000),
    context: {
      userType: "student",
      language: "english"
    },
    resolved: true,
    escalatedToHuman: false
  },
  {
    id: "session3",
    userId: "user789",
    messages: [...mockChatMessages.slice(0, 2), {
      id: "error-msg",
      text: "Mi dispiace, non ho capito la tua domanda. Posso aiutarti con qualcos'altro?",
      isUser: false,
      timestamp: new Date(Date.now() - 1500000)
    }],
    startedAt: new Date(Date.now() - 2000000),
    lastActivityAt: new Date(Date.now() - 1500000),
    context: {
      userType: "student",
      language: "english"
    },
    resolved: false,
    escalatedToHuman: true
  }
];

// Mock knowledge base entries (additional to the ones in the service)
const additionalKnowledgeBaseEntries: KnowledgeBaseEntry[] = [
  {
    id: "kb-6",
    title: "Italian Verb Tenses",
    content: "Italian has various verb tenses including present (presente), past perfect (passato prossimo), imperfect (imperfetto), future (futuro), and more. Each tense has specific conjugation rules based on verb groups (-are, -ere, -ire).",
    tags: ["grammar", "verbs", "tenses"],
    category: "grammar",
    relevance: 0.95,
    lastUpdated: new Date("2023-11-10"),
    keywords: ["verbs", "tenses", "conjugation", "grammar"],
    version: "1.0",
    language: "both"
  },
  {
    id: "kb-7",
    title: "Italian Food Vocabulary",
    content: "Essential Italian food vocabulary includes terms like 'pasta', 'pizza', 'pane' (bread), 'formaggio' (cheese), 'carne' (meat), 'pesce' (fish), 'verdura' (vegetables), and 'frutta' (fruit).",
    tags: ["vocabulary", "food", "dining"],
    category: "vocabulary",
    relevance: 0.85,
    lastUpdated: new Date("2023-11-05"),
    keywords: ["food", "vocabulary", "dining", "italian cuisine"],
    version: "1.0",
    language: "both"
  },
  {
    id: "kb-8",
    title: "Common Italian Greetings",
    content: "Common Italian greetings include 'Ciao' (hello/bye), 'Buongiorno' (good morning), 'Buonasera' (good evening), 'Arrivederci' (goodbye), 'Come stai?' (how are you?), and 'Piacere di conoscerti' (nice to meet you).",
    tags: ["greetings", "conversation", "basics"],
    category: "conversation",
    relevance: 0.9,
    lastUpdated: new Date("2023-10-28"),
    keywords: ["greetings", "hello", "goodbye", "conversation"],
    version: "1.0",
    language: "both"
  },
  {
    id: "kb-9",
    title: "B1 Citizenship Test Requirements",
    content: "To obtain Italian citizenship, applicants must pass the B1 language test which evaluates listening, reading, writing, and speaking skills. The test assesses the ability to understand and communicate in everyday situations, write simple texts, and participate in conversations on familiar topics.",
    tags: ["citizenship", "B1 test", "requirements"],
    category: "citizenship",
    relevance: 0.95,
    lastUpdated: new Date("2023-11-15"),
    keywords: ["citizenship", "B1", "test", "requirements", "Italian citizenship"],
    version: "1.0",
    language: "both"
  },
  {
    id: "kb-10",
    title: "B1 Test Format and Structure",
    content: "The Italian B1 citizenship test consists of four parts: listening (approximately 25 minutes), reading (35 minutes), writing (15 minutes), and speaking (15 minutes). Candidates must demonstrate the ability to understand main points in clear standard speech, read straightforward texts, write simple connected text, and communicate in most situations likely to arise while traveling in Italy.",
    tags: ["B1 test", "format", "structure", "exam"],
    category: "citizenship",
    relevance: 0.95,
    lastUpdated: new Date("2023-11-20"),
    keywords: ["B1", "test format", "exam structure", "citizenship test"],
    version: "1.0",
    language: "both"
  }
];

// Mock training examples
const mockTrainingExamples: ChatbotTrainingExample[] = [
  {
    id: "train1",
    question: "Come si dice 'hello' in italiano?",
    answer: "In italiano, 'hello' si dice 'ciao'.",
    alternatives: ["'Hello' in italiano è 'ciao'.", "La traduzione di 'hello' è 'ciao'."],
    category: "vocabulary",
    tags: ["greetings", "basics", "translation"],
    createdAt: new Date(Date.now() - 5000000),
    approved: true,
    language: "both",
    difficulty: "beginner"
  },
  {
    id: "train2",
    question: "Qual è la differenza tra 'essere' e 'stare'?",
    answer: "'Essere' si usa per caratteristiche permanenti e identità (Io sono alto, Lei è studentessa), mentre 'stare' si usa per condizioni temporanee e posizioni (Sto bene, Lui sta a Roma).",
    category: "grammar",
    tags: ["verbs", "essere", "stare"],
    createdAt: new Date(Date.now() - 4000000),
    approved: true,
    language: "both",
    difficulty: "intermediate"
  },
  {
    id: "train3",
    question: "What are the requirements for the Italian citizenship language test?",
    answer: "For Italian citizenship, you need to pass a B1 level language test which assesses listening, reading, writing, and speaking abilities. This test evaluates your capacity to understand and communicate in everyday situations, write simple connected texts, and participate in conversations on familiar topics.",
    category: "citizenship",
    tags: ["B1 test", "requirements", "citizenship"],
    createdAt: new Date(Date.now() - 3000000),
    approved: true,
    language: "english",
    difficulty: "intermediate"
  }
];

// Define ChatbotManager component
const ChatbotManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(mockSessions);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseEntry[]>([
    ...additionalKnowledgeBaseEntries
  ]);
  const [trainingExamples, setTrainingExamples] = useState<ChatbotTrainingExample[]>(mockTrainingExamples);
  const [settings, setSettings] = useState<ChatbotSettings>(ChatbotService.getSettings());
  const [newEntry, setNewEntry] = useState<{
    title: string;
    content: string;
    category: string;
    tags: string;
    keywords: string;
    language: 'english' | 'italian' | 'both';
  }>({
    title: '',
    content: '',
    category: '',
    tags: '',
    keywords: '',
    language: 'both'
  });
  const [sessionFilter, setSessionFilter] = useState('all');
  const { toast } = useToast();
  
  // Handle saving chatbot settings
  const handleSaveSettings = () => {
    // In a real application, this would be persistent
    ChatbotService.updateSettings(settings);
    
    toast({
      title: "Settings Saved",
      description: "Chatbot settings have been updated successfully."
    });
  };
  
  // Handle adding new knowledge base entry
  const handleAddKnowledgeBaseEntry = () => {
    if (!newEntry.title || !newEntry.content) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and content for the knowledge base entry.",
        variant: "destructive"
      });
      return;
    }
    
    const tagsArray = newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const keywordsArray = newEntry.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword);
    
    const newKBEntry: Omit<KnowledgeBaseEntry, "id" | "lastUpdated"> = {
      title: newEntry.title,
      content: newEntry.content,
      category: newEntry.category,
      tags: tagsArray,
      keywords: keywordsArray,
      relevance: 0.8,
      version: "1.0",
      language: newEntry.language
    };
    
    try {
      const addedEntry = ChatbotService.addKnowledgeBaseEntry(newKBEntry);
      setKnowledgeBase([...knowledgeBase, addedEntry]);
      
      setNewEntry({
        title: '',
        content: '',
        category: '',
        tags: '',
        keywords: '',
        language: 'both'
      });
      
      toast({
        title: "Entry Added",
        description: "Knowledge base entry has been added successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add knowledge base entry.",
        variant: "destructive"
      });
    }
  };
  
  // Handle deleting a knowledge base entry
  const handleDeleteKnowledgeBaseEntry = (id: string) => {
    setKnowledgeBase(knowledgeBase.filter(entry => entry.id !== id));
    
    toast({
      title: "Entry Deleted",
      description: "Knowledge base entry has been removed."
    });
  };
  
  // Handle viewing a chat session
  const handleViewSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      setActiveTab("conversations");
    }
  };
  
  // Handle closing the current session view
  const handleCloseSession = () => {
    setCurrentSession(null);
  };
  
  // Filtered sessions based on selected filter
  const filteredSessions = chatSessions.filter(session => {
    if (sessionFilter === 'all') return true;
    if (sessionFilter === 'active') return !session.resolved;
    if (sessionFilter === 'resolved') return session.resolved;
    if (sessionFilter === 'escalated') return session.escalatedToHuman;
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <Bot className="h-8 w-8 mr-2" />
          Chatbot Management
        </h1>
        <div className="flex items-center gap-2">
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
          />
          <Label>{settings.enabled ? "Enabled" : "Disabled"}</Label>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatSessions.filter(s => !s.resolved).length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {chatSessions.filter(s => s.escalatedToHuman).length} escalated to human
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{knowledgeBase.length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {knowledgeBase.reduce((total, entry) => total + entry.tags.length, 0)} total tags
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Training Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trainingExamples.length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Across {new Set(trainingExamples.map(ex => ex.category)).size} categories
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Of questions answered successfully
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
                <CardDescription>
                  Latest chatbot interactions with users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chatSessions.slice(0, 5).map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>User {session.userId?.substring(4)}</TableCell>
                        <TableCell>{session.startedAt.toLocaleString()}</TableCell>
                        <TableCell>{session.lastActivityAt.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={session.resolved ? "outline" : session.escalatedToHuman ? "secondary" : "default"}>
                            {session.resolved ? "Resolved" : session.escalatedToHuman ? "Escalated" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewSession(session.id)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setActiveTab("conversations")} className="w-full">
                  View All Conversations
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Feedback Overview</CardTitle>
                <CardDescription>
                  User feedback on chatbot responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 items-center">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                        <span className="text-sm">Positive</span>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 items-center">
                      <div className="flex items-center">
                        <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
                        <span className="text-sm">Negative</span>
                      </div>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 items-center">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                        <span className="text-sm">Neutral</span>
                      </div>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Popular Topics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Grammar Questions</span>
                      <span>42%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Vocabulary</span>
                      <span>25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Citizenship Test</span>
                      <span>18%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Platform Help</span>
                      <span>15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>B1 Citizenship Test Support</CardTitle>
              <CardDescription>
                Specialized chatbot functionality for citizenship test preparation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Test Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive knowledge base with B1 test requirements, format, and practice materials.
                  </p>
                </div>
                
                <div className="bg-muted rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Practice Dialogs</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive conversations simulating real test scenarios for speaking practice.
                  </p>
                </div>
                
                <div className="bg-muted rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Evaluation</h3>
                  <p className="text-sm text-muted-foreground">
                    Feedback on language proficiency and readiness for the official citizenship exam.
                  </p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Citizenship Test Knowledge Coverage</h3>
                  <Badge>92% Complete</Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Listening Comprehension</span>
                      <span>95%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Reading Comprehension</span>
                      <span>98%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "98%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Writing Exercises</span>
                      <span>90%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Speaking Preparation</span>
                      <span>85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversations" className="space-y-6">
          {currentSession ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Conversation with User {currentSession.userId?.substring(4)}
                    </CardTitle>
                    <CardDescription>
                      Started {currentSession.startedAt.toLocaleString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCloseSession}>
                    Back to List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Status:</span> 
                        <Badge className="ml-2" variant={currentSession.resolved ? "outline" : currentSession.escalatedToHuman ? "secondary" : "default"}>
                          {currentSession.resolved ? "Resolved" : currentSession.escalatedToHuman ? "Escalated" : "Active"}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">User Type:</span> 
                        <span className="ml-2 capitalize">{currentSession.context.userType}</span>
                      </div>
                      <div>
                        <span className="font-medium">Language:</span> 
                        <span className="ml-2 capitalize">{currentSession.context.language}</span>
                      </div>
                      <div>
                        <span className="font-medium">Last Activity:</span> 
                        <span className="ml-2">{currentSession.lastActivityAt.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[500px] border rounded-md">
                    <div className="p-4 space-y-4">
                      {currentSession.messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.isUser 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            <div className="text-sm mb-1">
                              {message.isUser ? 'User' : settings.name || 'Bot'}
                            </div>
                            <div className="space-y-2">
                              <div className="whitespace-pre-wrap">{message.text}</div>
                              {!message.isUser && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <div className="text-xs text-muted-foreground">
                                    {message.feedback && (
                                      <div className="flex items-center">
                                        <span className="mr-1">Feedback:</span>
                                        {message.feedback === 'positive' ? (
                                          <ThumbsUp className="h-3 w-3 text-green-500" />
                                        ) : message.feedback === 'negative' ? (
                                          <ThumbsDown className="h-3 w-3 text-red-500" />
                                        ) : (
                                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-xs mt-1 text-right opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="space-x-2">
                  {!currentSession.resolved && (
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </Button>
                  )}
                  {!currentSession.escalatedToHuman && !currentSession.resolved && (
                    <Button variant="default" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Escalate to Human
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Chat Sessions</h2>
                <Select 
                  value={sessionFilter} 
                  onValueChange={setSessionFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>All Conversations</CardTitle>
                  <CardDescription>
                    View and manage all chatbot conversations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredSessions.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No sessions match the selected filter.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Messages</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead>Last Activity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>User {session.userId?.substring(4)}</TableCell>
                            <TableCell>{session.messages.length}</TableCell>
                            <TableCell>{session.startedAt.toLocaleString()}</TableCell>
                            <TableCell>{session.lastActivityAt.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={session.resolved ? "outline" : session.escalatedToHuman ? "secondary" : "default"}>
                                {session.resolved ? "Resolved" : session.escalatedToHuman ? "Escalated" : "Active"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewSession(session.id)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="knowledge" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Knowledge Base Entries</CardTitle>
                <CardDescription>
                  Information available to the chatbot for answering queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {knowledgeBase.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.title}</TableCell>
                        <TableCell>{entry.category}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {entry.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{entry.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {entry.language}
                          </Badge>
                        </TableCell>
                        <TableCell>{entry.lastUpdated.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDeleteKnowledgeBaseEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Entries
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Entry</CardTitle>
                <CardDescription>
                  Create a new knowledge base entry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Entry title"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Knowledge content"
                      rows={5}
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category" 
                      placeholder="E.g., grammar, vocabulary"
                      value={newEntry.category}
                      onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input 
                      id="tags" 
                      placeholder="E.g., verbs, past tense, grammar"
                      value={newEntry.tags}
                      onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords (comma separated)</Label>
                    <Input 
                      id="keywords" 
                      placeholder="E.g., speak, talk, say"
                      value={newEntry.keywords}
                      onChange={(e) => setNewEntry({...newEntry, keywords: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={newEntry.language} 
                      onValueChange={(value: 'english' | 'italian' | 'both') => 
                        setNewEntry({...newEntry, language: value})
                      }
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddKnowledgeBaseEntry} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Training Examples</CardTitle>
              <CardDescription>
                Examples used to train the chatbot on specific topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Examples</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingExamples.map((example) => (
                    <TableRow key={example.id}>
                      <TableCell className="max-w-[300px] truncate">
                        {example.question}
                      </TableCell>
                      <TableCell>{example.category}</TableCell>
                      <TableCell className="capitalize">{example.difficulty}</TableCell>
                      <TableCell className="capitalize">{example.language}</TableCell>
                      <TableCell>
                        <Badge variant={example.approved ? "default" : "outline"}>
                          {example.approved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Examples
              </Button>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Add Example
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Citizenship Test Resources</CardTitle>
              <CardDescription>
                Specialized knowledge base for B1 test preparation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">B1 Test Coverage</h3>
                  <Badge variant="outline">
                    5 Knowledge Entries
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Test Requirements
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Detailed information about Italian citizenship B1 test requirements, eligibility criteria, and application process.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Language Skills
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Explanations of the four required language skills (reading, writing, listening, speaking) at B1 level.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Practice Materials
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Sample questions, practice exercises, and simulated tests to prepare candidates for the actual B1 test.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Bot className="h-4 w-4 mr-2" />
                      Conversation Practice
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Interactive dialogue templates for practicing conversational Italian at B1 level, focusing on common test topics.
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Citizenship Test Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Chatbot Configuration</CardTitle>
                <CardDescription>
                  Configure how the chatbot operates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="botName">Chatbot Name</Label>
                        <Input 
                          id="botName" 
                          value={settings.name || ''}
                          onChange={(e) => setSettings({...settings, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="welcomeMessage">Welcome Message</Label>
                        <Textarea 
                          id="welcomeMessage" 
                          value={settings.welcomeMessage || ''}
                          onChange={(e) => setSettings({...settings, welcomeMessage: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fallbackMessage">Fallback Message</Label>
                        <Textarea 
                          id="fallbackMessage" 
                          value={settings.fallbackMessage || ''}
                          onChange={(e) => setSettings({...settings, fallbackMessage: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="defaultLanguage">Default Language</Label>
                        <Select 
                          value={settings.defaultLanguage} 
                          onValueChange={(value: "english" | "italian" | "auto-detect") => 
                            setSettings({...settings, defaultLanguage: value})
                          }
                        >
                          <SelectTrigger id="defaultLanguage">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="italian">Italian</SelectItem>
                            <SelectItem value="auto-detect">Auto Detect</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="model">AI Model</Label>
                        <Select 
                          value={settings.model} 
                          onValueChange={(value) => setSettings({...settings, model: value})}
                        >
                          <SelectTrigger id="model">
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="distilbert-base-uncased">DistilBERT Base (Default)</SelectItem>
                            <SelectItem value="mixedbread-ai/mxbai-embed-small">MixedBread AI Embed Small</SelectItem>
                            <SelectItem value="Helsinki-NLP/opus-mt-en-it">Helsinki NLP En-It</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="responseTime">Response Time</Label>
                        <Select 
                          value={settings.responseTime} 
                          onValueChange={(value: "fast" | "balanced" | "thorough") => 
                            setSettings({...settings, responseTime: value})
                          }
                        >
                          <SelectTrigger id="responseTime">
                            <SelectValue placeholder="Select response time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fast">Fast (Shorter responses)</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="thorough">Thorough (Detailed responses)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="personality">Personality</Label>
                        <Select 
                          value={settings.personality} 
                          onValueChange={(value: "formal" | "friendly" | "educational") => 
                            setSettings({...settings, personality: value})
                          }
                        >
                          <SelectTrigger id="personality">
                            <SelectValue placeholder="Select personality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="educational">Educational</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="confidence">Confidence Threshold</Label>
                          <span className="text-sm">{Math.round(settings.confidenceThreshold * 100)}%</span>
                        </div>
                        <Slider 
                          id="confidence"
                          min={0.1}
                          max={0.9}
                          step={0.05}
                          value={[settings.confidenceThreshold]}
                          onValueChange={([value]) => setSettings({...settings, confidenceThreshold: value})}
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum confidence required for the chatbot to provide an answer
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Feature Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="feedbackEnabled">User Feedback</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow users to provide feedback on responses
                          </p>
                        </div>
                        <Switch 
                          id="feedbackEnabled"
                          checked={settings.feedbackEnabled}
                          onCheckedChange={(checked) => setSettings({...settings, feedbackEnabled: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="suggestRelatedQuestions">Suggest Related Questions</Label>
                          <p className="text-sm text-muted-foreground">
                            Suggest follow-up questions after responses
                          </p>
                        </div>
                        <Switch 
                          id="suggestRelatedQuestions"
                          checked={settings.suggestRelatedQuestions}
                          onCheckedChange={(checked) => setSettings({...settings, suggestRelatedQuestions: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="learningEnabled">Continuous Learning</Label>
                          <p className="text-sm text-muted-foreground">
                            Learn from user interactions to improve responses
                          </p>
                        </div>
                        <Switch 
                          id="learningEnabled"
                          checked={settings.learningEnabled}
                          onCheckedChange={(checked) => setSettings({...settings, learningEnabled: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={handleSaveSettings}>Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>B1 Test Support Settings</CardTitle>
                <CardDescription>
                  Configure citizenship test support features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Test Support</Label>
                      <p className="text-sm text-muted-foreground">
                        Specialized support for citizenship test preparation
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Test Preparation Mode</Label>
                    <Select defaultValue="comprehensive">
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (Key topics only)</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                        <SelectItem value="intensive">Intensive (Practice focused)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Resource Emphasis</Label>
                    <Select defaultValue="balanced">
                      <SelectTrigger>
                        <SelectValue placeholder="Select emphasis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grammar">Grammar Focus</SelectItem>
                        <SelectItem value="vocabulary">Vocabulary Focus</SelectItem>
                        <SelectItem value="speaking">Speaking Focus</SelectItem>
                        <SelectItem value="balanced">Balanced Approach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Feedback Detail Level</Label>
                      <span className="text-sm">Medium</span>
                    </div>
                    <Slider defaultValue={[0.5]} min={0} max={1} step={0.1} />
                    <p className="text-xs text-muted-foreground">
                      Amount of detail in language feedback
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Included Resources</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="vocabLists" checked={true} />
                        <Label htmlFor="vocabLists">Essential Vocabulary Lists</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="grammarGuides" checked={true} />
                        <Label htmlFor="grammarGuides">Grammar Guides</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="practiceDrill" checked={true} />
                        <Label htmlFor="practiceDrill">Practice Drills</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="mockTests" checked={true} />
                        <Label htmlFor="mockTests">Mock Tests</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Test Support Settings</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatbotManager;
