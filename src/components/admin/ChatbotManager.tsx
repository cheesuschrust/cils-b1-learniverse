
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LineChart, PieChart, BarChart } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import ChatbotService, { getSettings, updateSettings } from '@/services/ChatbotService';
import { v4 as uuidv4 } from 'uuid';
import { 
  MessageSquare, 
  Settings, 
  Brain,
  Database, 
  BarChart3, 
  Clock, 
  ChevronRight, 
  Pencil, 
  Trash2, 
  Plus, 
  Save, 
  Bot, 
  Search, 
  CheckCircle2, 
  Languages, 
  BookOpen, 
  Filter, 
  Upload,
  UploadCloud,
  Copy,
  Zap,
  AlignLeft,
  Eye,
  History,
  Lightbulb,
  UserPlus,
  Lock
} from 'lucide-react';
import { KnowledgeBaseEntry, ChatbotSettings, ChatbotTrainingExample, ChatSession } from '@/types/chatbot';

// Mock chat sessions for analysis
const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    userId: 'user-1',
    messages: [
      {
        id: 'm1',
        text: 'How do I reset my password?',
        isUser: true,
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'm2',
        text: 'You can reset your password by clicking on the "Forgot Password" link on the login page. You\'ll receive an email with instructions to create a new password.',
        isUser: false,
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    ],
    startedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    context: {
      userType: 'free',
      language: 'en'
    },
    resolved: true
  },
  {
    id: '2',
    userId: 'user-2',
    messages: [
      {
        id: 'm3',
        text: 'How many questions can I do per day?',
        isUser: true,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'm4',
        text: 'On the free plan, you can do one question per category per day. Premium users get unlimited questions.',
        isUser: false,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'm5',
        text: 'How do I upgrade to premium?',
        isUser: true,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'm6',
        text: 'You can upgrade to premium by visiting the Subscription page in your account settings. We offer monthly and annual plans.',
        isUser: false,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ],
    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    context: {
      userType: 'free',
      language: 'en'
    },
    resolved: true
  },
  {
    id: '3',
    userId: 'user-3',
    messages: [
      {
        id: 'm7',
        text: 'The audio isn\'t working on the listening exercises',
        isUser: true,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'm8',
        text: 'I\'m sorry to hear that. Please make sure your browser permissions allow audio playback. If the issue persists, try using headphones or a different browser.',
        isUser: false,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'm9',
        text: 'I\'ve tried different browsers but it still doesn\'t work',
        isUser: true,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'm10',
        text: 'I understand this is frustrating. Would you like to speak with our technical support team for further assistance?',
        isUser: false,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'm11',
        text: 'Yes please',
        isUser: true,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ],
    startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    context: {
      userType: 'premium',
      language: 'en'
    },
    resolved: false,
    escalatedToHuman: true
  }
];

// Sample KB entries for the application
const initialKnowledgeBase: KnowledgeBaseEntry[] = [
  {
    id: "kb-1",
    title: "Free vs Premium Plans",
    content: "Our platform offers both free and premium subscription plans. Free users can access one question per day, while premium users get unlimited questions and an ad-free experience.",
    tags: ["subscription", "pricing", "plans"],
    category: "pricing",
    relevance: 0.9,
    lastUpdated: new Date("2023-06-15"),
    keywords: ["free", "premium", "subscription", "pricing", "plan"],
    version: "1.0"
  },
  {
    id: "kb-2",
    title: "Italian Grammar Lessons",
    content: "Our platform offers comprehensive Italian grammar lessons covering all levels from beginner to advanced. Topics include verb conjugation, article usage, and sentence structure.",
    tags: ["grammar", "lessons", "italian"],
    category: "content",
    relevance: 0.8,
    lastUpdated: new Date("2023-07-20"),
    keywords: ["grammar", "italian", "lessons", "conjugation", "verbs"],
    version: "1.1"
  },
  {
    id: "kb-3",
    title: "Speaking Practice",
    content: "Our speaking practice feature uses AI to evaluate your pronunciation and provide feedback. You can practice with conversation simulations and receive detailed feedback on your pronunciation accuracy.",
    tags: ["speaking", "pronunciation", "practice"],
    category: "features",
    relevance: 0.85,
    lastUpdated: new Date("2023-08-05"),
    keywords: ["speaking", "pronunciation", "practice", "conversation"],
    version: "1.0"
  },
  {
    id: "kb-4",
    title: "Flashcard System",
    content: "Our flashcard system uses spaced repetition to optimize your learning. Cards are scheduled based on your performance, ensuring efficient memorization of vocabulary.",
    tags: ["flashcards", "vocabulary", "spaced repetition"],
    category: "features",
    relevance: 0.75,
    lastUpdated: new Date("2023-09-10"),
    keywords: ["flashcards", "vocabulary", "spaced repetition", "memorization"],
    version: "1.2"
  },
  {
    id: "kb-5",
    title: "Technical Support",
    content: "For technical issues, you can contact our support team through the Support Center. Premium users receive priority support with faster response times.",
    tags: ["support", "help", "technical"],
    category: "support",
    relevance: 0.7,
    lastUpdated: new Date("2023-10-25"),
    keywords: ["support", "help", "technical", "issues"],
    version: "1.0"
  }
];

const ChatbotManager: React.FC = () => {
  const { toast } = useToast();
  const [chatbotSettings, setChatbotSettings] = useState<ChatbotSettings>(getSettings());
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseEntry[]>(initialKnowledgeBase);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(mockChatSessions);
  const [trainingExamples, setTrainingExamples] = useState<ChatbotTrainingExample[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isKnowledgeBaseEntryDialogOpen, setIsKnowledgeBaseEntryDialogOpen] = useState(false);
  const [selectedKnowledgeBaseEntry, setSelectedKnowledgeBaseEntry] = useState<KnowledgeBaseEntry | null>(null);
  const [newTrainingExample, setNewTrainingExample] = useState<Partial<ChatbotTrainingExample>>({
    question: '',
    answer: '',
    category: 'general',
    tags: [],
    alternatives: [],
    approved: true,
    createdBy: 'admin'
  });
  
  // Save chatbot settings
  const handleSaveSettings = () => {
    updateSettings(chatbotSettings);
    toast({
      title: "Settings Saved",
      description: "Chatbot settings have been updated successfully.",
    });
  };
  
  // Add a new knowledge base entry
  const handleAddKnowledgeBaseEntry = (entry: Omit<KnowledgeBaseEntry, 'id' | 'lastUpdated'>) => {
    const newEntry: KnowledgeBaseEntry = {
      ...entry,
      id: uuidv4(),
      lastUpdated: new Date()
    };
    
    setKnowledgeBase([...knowledgeBase, newEntry]);
    setIsKnowledgeBaseEntryDialogOpen(false);
    setSelectedKnowledgeBaseEntry(null);
    
    toast({
      title: "Entry Added",
      description: "Knowledge base entry has been added successfully.",
    });
  };
  
  // Update an existing knowledge base entry
  const handleUpdateKnowledgeBaseEntry = (updatedEntry: KnowledgeBaseEntry) => {
    setKnowledgeBase(knowledgeBase.map(entry => 
      entry.id === updatedEntry.id ? { ...updatedEntry, lastUpdated: new Date() } : entry
    ));
    setIsKnowledgeBaseEntryDialogOpen(false);
    setSelectedKnowledgeBaseEntry(null);
    
    toast({
      title: "Entry Updated",
      description: "Knowledge base entry has been updated successfully.",
    });
  };
  
  // Delete a knowledge base entry
  const handleDeleteKnowledgeBaseEntry = (entryId: string) => {
    setKnowledgeBase(knowledgeBase.filter(entry => entry.id !== entryId));
    
    toast({
      title: "Entry Deleted",
      description: "Knowledge base entry has been deleted.",
    });
  };
  
  // Add a new training example
  const handleAddTrainingExample = () => {
    if (!newTrainingExample.question || !newTrainingExample.answer) {
      toast({
        title: "Missing Information",
        description: "Please provide both a question and an answer.",
        variant: "destructive",
      });
      return;
    }
    
    const example: ChatbotTrainingExample = {
      ...newTrainingExample as Omit<ChatbotTrainingExample, 'id' | 'createdAt' | 'updatedAt'>,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTrainingExamples([...trainingExamples, example]);
    setNewTrainingExample({
      question: '',
      answer: '',
      category: 'general',
      tags: [],
      alternatives: [],
      approved: true,
      createdBy: 'admin'
    });
    
    toast({
      title: "Example Added",
      description: "Training example has been added successfully.",
    });
  };
  
  // Filter knowledge base entries by category
  const filteredKnowledgeBase = selectedCategory === 'all' 
    ? knowledgeBase 
    : knowledgeBase.filter(entry => entry.category === selectedCategory);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Chatbot Management</h1>
          <p className="text-muted-foreground">Configure and train your support chatbot</p>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-5 w-full mb-8">
          <TabsTrigger value="dashboard" className="flex items-center justify-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center justify-center gap-2">
            <Database className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center justify-center gap-2">
            <Brain className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="conversations" className="flex items-center justify-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center justify-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{knowledgeBase.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Total knowledge entries</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatSessions.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {chatSessions.filter(session => session.resolved).length} resolved ({Math.round((chatSessions.filter(session => session.resolved).length / chatSessions.length) * 100)}%)
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Escalations</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatSessions.filter(session => session.escalatedToHuman).length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Escalation rate: {Math.round((chatSessions.filter(session => session.escalatedToHuman).length / chatSessions.length) * 100)}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 7 days: <span className="text-green-500">+3%</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Metrics</CardTitle>
                <CardDescription>Chat volume and resolution rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart 
                    data={[
                      { date: "Mon", conversations: 12, resolved: 10 },
                      { date: "Tue", conversations: 18, resolved: 15 },
                      { date: "Wed", conversations: 15, resolved: 12 },
                      { date: "Thu", conversations: 22, resolved: 18 },
                      { date: "Fri", conversations: 28, resolved: 22 },
                      { date: "Sat", conversations: 16, resolved: 14 },
                      { date: "Sun", conversations: 14, resolved: 12 },
                    ]}
                    index="date"
                    categories={["conversations", "resolved"]}
                    colors={["blue", "green"]}
                    valueFormatter={(value) => `${value}`}
                    className="h-full"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Usage</CardTitle>
                <CardDescription>Most referenced knowledge base entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart 
                    data={knowledgeBase.slice(0, 5).map((entry, index) => ({
                      title: entry.title,
                      uses: 25 - index * 4
                    }))}
                    index="title"
                    categories={["uses"]}
                    colors={["purple"]}
                    valueFormatter={(value) => `${value} uses`}
                    className="h-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Common User Queries</CardTitle>
              <CardDescription>Frequently asked questions that may need knowledge base entries</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Avg. Confidence</TableHead>
                    <TableHead>Escalation Rate</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">How do I reset my password?</TableCell>
                    <TableCell>32</TableCell>
                    <TableCell>92%</TableCell>
                    <TableCell>2%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Add to KB</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">What's included in the premium plan?</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell>88%</TableCell>
                    <TableCell>5%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Add to KB</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">How many lessons are available?</TableCell>
                    <TableCell>24</TableCell>
                    <TableCell>78%</TableCell>
                    <TableCell>12%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Add to KB</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Audio not working in lessons</TableCell>
                    <TableCell>22</TableCell>
                    <TableCell>65%</TableCell>
                    <TableCell>35%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Add to KB</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">How to download content for offline use</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell>72%</TableCell>
                    <TableCell>18%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Add to KB</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Knowledge Base</CardTitle>
                  <CardDescription>Manage the information your chatbot uses to respond to users</CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search knowledge base..."
                      className="pl-8 w-full"
                    />
                  </div>
                  
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="pricing">Pricing</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="features">Features</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={() => {
                      setSelectedKnowledgeBaseEntry(null);
                      setIsKnowledgeBaseEntryDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredKnowledgeBase.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Knowledge Base Entries</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                    Add entries to help your chatbot provide accurate and helpful responses.
                  </p>
                  <Button onClick={() => {
                    setSelectedKnowledgeBaseEntry(null);
                    setIsKnowledgeBaseEntryDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Knowledge Base Entry
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredKnowledgeBase.map((entry) => (
                    <Card key={entry.id} className="overflow-hidden">
                      <div className="p-4 sm:p-6">
                        <div className="flex justify-between mb-3">
                          <div className="flex items-center">
                            <Badge className="capitalize mr-2">
                              {entry.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Last updated: {entry.lastUpdated.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedKnowledgeBaseEntry(entry);
                                setIsKnowledgeBaseEntryDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteKnowledgeBaseEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-medium mb-2">{entry.title}</h3>
                        <p className="text-muted-foreground mb-4">{entry.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {entry.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="mt-4 text-sm">
                          <p className="font-medium">Keywords:</p>
                          <p className="text-muted-foreground">
                            {entry.keywords.join(', ')}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Operations</CardTitle>
                <CardDescription>Manage knowledge base in bulk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <UploadCloud className="h-5 w-5 mr-2 text-primary" />
                      Import Knowledge Base
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Import knowledge base entries from a CSV or JSON file.
                    </p>
                    <div className="flex flex-col gap-4">
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your file here, or click to browse
                        </p>
                        <Button variant="outline" size="sm">Choose File</Button>
                      </div>
                      <Button disabled>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload and Import
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      Import from Documentation
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Automatically extract knowledge from your documentation.
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="docUrl">Documentation URL</Label>
                        <Input id="docUrl" placeholder="e.g., https://docs.example.com" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="processSubpages" />
                        <Label htmlFor="processSubpages">Process subpages (up to 50 pages)</Label>
                      </div>
                      <Button disabled>
                        <Brain className="h-4 w-4 mr-2" />
                        Process Documentation
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="training">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Chatbot Training</CardTitle>
                  <CardDescription>Create and manage training examples for your chatbot</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">Add New Training Example</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Input 
                          id="question" 
                          placeholder="e.g., How do I reset my password?"
                          value={newTrainingExample.question}
                          onChange={(e) => setNewTrainingExample({
                            ...newTrainingExample,
                            question: e.target.value
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea 
                          id="answer" 
                          placeholder="Provide a clear and helpful answer to the question..."
                          rows={4}
                          value={newTrainingExample.answer}
                          onChange={(e) => setNewTrainingExample({
                            ...newTrainingExample,
                            answer: e.target.value
                          })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select 
                            value={newTrainingExample.category} 
                            onValueChange={(value) => setNewTrainingExample({
                              ...newTrainingExample,
                              category: value
                            })}
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="account">Account</SelectItem>
                              <SelectItem value="pricing">Pricing</SelectItem>
                              <SelectItem value="features">Features</SelectItem>
                              <SelectItem value="technical">Technical</SelectItem>
                              <SelectItem value="language">Language</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags (comma separated)</Label>
                          <Input 
                            id="tags" 
                            placeholder="e.g., password, reset, login"
                            value={newTrainingExample.tags?.join(', ') || ''}
                            onChange={(e) => setNewTrainingExample({
                              ...newTrainingExample,
                              tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="alternatives">Alternative Questions (one per line)</Label>
                        <Textarea 
                          id="alternatives" 
                          placeholder="Add alternative ways to ask the same question..."
                          rows={3}
                          value={newTrainingExample.alternatives?.join('\n') || ''}
                          onChange={(e) => setNewTrainingExample({
                            ...newTrainingExample,
                            alternatives: e.target.value.split('\n').map(alt => alt.trim()).filter(alt => alt !== '')
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="approved" 
                          checked={newTrainingExample.approved}
                          onCheckedChange={(checked) => setNewTrainingExample({
                            ...newTrainingExample,
                            approved: checked
                          })}
                        />
                        <Label htmlFor="approved">Mark as approved (ready for training)</Label>
                      </div>
                      
                      <Button onClick={handleAddTrainingExample} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Training Example
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">Training Status</h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Training Examples</Label>
                          <span className="text-sm">{trainingExamples.length}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${Math.min(100, trainingExamples.length / 2)}%` }} 
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Recommendation: Add at least 200 examples for optimal performance
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Category Coverage</Label>
                          <span className="text-sm">3/6</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: '50%' }} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Some categories need more examples
                        </p>
                      </div>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Last Training</h4>
                              <p className="text-sm text-muted-foreground">
                                Never trained
                              </p>
                            </div>
                            <Badge variant="outline">Needs Training</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Button className="w-full" disabled={trainingExamples.length === 0}>
                        <Zap className="h-4 w-4 mr-2" />
                        Start Training
                      </Button>
                      
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>Training Tip</AlertTitle>
                        <AlertDescription>
                          Include variations of common questions to improve chatbot understanding.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <CardTitle className="text-base">Training Examples</CardTitle>
                      <div className="flex items-center">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[150px] h-8">
                            <SelectValue placeholder="Filter by category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="account">Account</SelectItem>
                            <SelectItem value="pricing">Pricing</SelectItem>
                            <SelectItem value="features">Features</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="language">Language</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {trainingExamples.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No training examples yet.</p>
                        <p className="text-sm text-muted-foreground">
                          Add examples to train your chatbot.
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Question</TableHead>
                            <TableHead>Answer</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Alternatives</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {trainingExamples.map((example) => (
                            <TableRow key={example.id}>
                              <TableCell className="font-medium">{example.question}</TableCell>
                              <TableCell className="max-w-xs truncate">{example.answer}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {example.category}
                                </Badge>
                              </TableCell>
                              <TableCell>{example.alternatives?.length || 0}</TableCell>
                              <TableCell>
                                <Badge variant={example.approved ? "default" : "outline"}>
                                  {example.approved ? "Approved" : "Draft"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversations">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Conversation History</CardTitle>
                  <CardDescription>Review past conversations and analyze chatbot performance</CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search conversations..."
                      className="pl-8 w-full"
                    />
                  </div>
                  
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="unresolved">Unresolved</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {chatSessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Conversations Yet</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Conversations will appear here once users start interacting with your chatbot.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {chatSessions.map((session) => (
                    <Accordion key={session.id} type="single" collapsible className="border rounded-lg overflow-hidden">
                      <AccordionItem value={session.id} className="border-0">
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
                          <div className="flex flex-col sm:flex-row flex-1 items-start sm:items-center justify-between text-left">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                <Badge variant={session.resolved ? "default" : (session.escalatedToHuman ? "destructive" : "outline")}>
                                  {session.resolved ? "Resolved" : (session.escalatedToHuman ? "Escalated" : "Ongoing")}
                                </Badge>
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  {session.messages[0].text.length > 50 
                                    ? `${session.messages[0].text.substring(0, 50)}...` 
                                    : session.messages[0].text
                                  }
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {session.messages.length} messages · {session.startedAt.toLocaleDateString()} · User {session.userId?.substring(0, 8)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center mt-2 sm:mt-0">
                              <Badge variant="outline" className="mr-2 capitalize">
                                {session.context?.userType}
                              </Badge>
                              <Badge variant="outline">{session.messages.length} messages</Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-4 pb-4">
                            <div className="space-y-4 mb-4">
                              <ScrollArea className="h-80 rounded border p-4">
                                <div className="space-y-4">
                                  {session.messages.map((message) => (
                                    <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`max-w-[80%] p-3 rounded-lg ${
                                        message.isUser 
                                          ? 'bg-primary text-primary-foreground' 
                                          : 'bg-muted'
                                      }`}>
                                        <p>{message.text}</p>
                                        <div className="mt-1 text-xs opacity-70 flex justify-between items-center">
                                          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                                          {!message.isUser && message.feedback && (
                                            <Badge variant={message.feedback.helpful ? "default" : "destructive"} className="text-[10px] h-4">
                                              {message.feedback.helpful ? "Helpful" : "Not Helpful"}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Session Details</h4>
                                <div className="text-sm">
                                  <p><span className="font-medium">Started:</span> {session.startedAt.toLocaleString()}</p>
                                  <p><span className="font-medium">Last Activity:</span> {session.lastActivityAt.toLocaleString()}</p>
                                  <p><span className="font-medium">User Type:</span> {session.context?.userType}</p>
                                  <p><span className="font-medium">Language:</span> {session.context?.language}</p>
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                <Button variant="outline" size="sm" className="flex items-center">
                                  <History className="h-4 w-4 mr-2" />
                                  View Full Session Log
                                </Button>
                                {!session.resolved && (
                                  <Button variant="outline" size="sm" className="flex items-center">
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Mark as Resolved
                                  </Button>
                                )}
                                {!session.escalatedToHuman && !session.resolved && (
                                  <Button variant="outline" size="sm" className="flex items-center">
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Escalate to Human
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" className="flex items-center">
                                  <Brain className="h-4 w-4 mr-2" />
                                  Create Training Example
                                </Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Configuration</CardTitle>
              <CardDescription>Configure your chatbot settings and behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enableChatbot">Enable Chatbot</Label>
                        <Switch 
                          id="enableChatbot" 
                          checked={chatbotSettings.enabled}
                          onCheckedChange={(checked) => setChatbotSettings({
                            ...chatbotSettings,
                            enabled: checked
                          })}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Toggle to enable or disable the chatbot platform-wide
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chatbotName">Chatbot Name</Label>
                      <Input 
                        id="chatbotName" 
                        value={chatbotSettings.name}
                        onChange={(e) => setChatbotSettings({
                          ...chatbotSettings,
                          name: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl">Avatar URL</Label>
                      <Input 
                        id="avatarUrl" 
                        value={chatbotSettings.avatarUrl || ''}
                        onChange={(e) => setChatbotSettings({
                          ...chatbotSettings,
                          avatarUrl: e.target.value
                        })}
                        placeholder="https://example.com/avatar.png"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="welcomeMessage">Welcome Message</Label>
                      <Textarea 
                        id="welcomeMessage" 
                        value={chatbotSettings.welcomeMessage}
                        onChange={(e) => setChatbotSettings({
                          ...chatbotSettings,
                          welcomeMessage: e.target.value
                        })}
                        placeholder="Welcome! How can I help you today?"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fallbackMessage">Fallback Message</Label>
                      <Textarea 
                        id="fallbackMessage" 
                        value={chatbotSettings.fallbackMessage}
                        onChange={(e) => setChatbotSettings({
                          ...chatbotSettings,
                          fallbackMessage: e.target.value
                        })}
                        placeholder="I'm sorry, I don't understand. Can you rephrase that?"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="confidenceThreshold">Confidence Threshold</Label>
                      <div className="flex items-center space-x-3">
                        <Input 
                          id="confidenceThreshold" 
                          type="range" 
                          min="0.1" 
                          max="0.9" 
                          step="0.05"
                          value={chatbotSettings.confidenceThreshold}
                          onChange={(e) => setChatbotSettings({
                            ...chatbotSettings,
                            confidenceThreshold: parseFloat(e.target.value)
                          })}
                          className="w-full"
                        />
                        <span>{(chatbotSettings.confidenceThreshold * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Minimum confidence level required to provide an answer (higher = more accurate but may use fallback more often)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxContextLength">Maximum Context Length</Label>
                      <Input 
                        id="maxContextLength" 
                        type="number" 
                        min="1" 
                        max="50"
                        value={chatbotSettings.maxContextLength}
                        onChange={(e) => setChatbotSettings({
                          ...chatbotSettings,
                          maxContextLength: parseInt(e.target.value)
                        })}
                      />
                      <p className="text-sm text-muted-foreground">
                        Number of previous messages to include as context for responses
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="escalationThreshold">Escalation Threshold</Label>
                      <Input 
                        id="escalationThreshold" 
                        type="number" 
                        min="1" 
                        max="10"
                        value={chatbotSettings.escalationThreshold}
                        onChange={(e) => setChatbotSettings({
                          ...chatbotSettings,
                          escalationThreshold: parseInt(e.target.value)
                        })}
                      />
                      <p className="text-sm text-muted-foreground">
                        Number of low-confidence responses before suggesting human support
                      </p>
                    </div>
                    
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="suggestFeedback" 
                          checked={chatbotSettings.suggestFeedback}
                          onCheckedChange={(checked) => setChatbotSettings({
                            ...chatbotSettings,
                            suggestFeedback: checked
                          })}
                        />
                        <Label htmlFor="suggestFeedback">Ask for feedback on responses</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="suggestRelatedQuestions" 
                          checked={chatbotSettings.suggestRelatedQuestions}
                          onCheckedChange={(checked) => setChatbotSettings({
                            ...chatbotSettings,
                            suggestRelatedQuestions: checked
                          })}
                        />
                        <Label htmlFor="suggestRelatedQuestions">Suggest related questions</Label>
                      </div>
                    </div>
                    
                    <Card className="border-dashed mt-6">
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Operating Hours
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                          Configure when the chatbot is available. Outside these hours, visitors will be directed to leave a message.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          <Clock className="h-4 w-4 mr-2" />
                          Configure Hours
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-2 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Integration Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-dashed">
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm flex items-center">
                          <Languages className="h-4 w-4 mr-2" />
                          Language Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                          Configure language options and translations for your chatbot.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          <Languages className="h-4 w-4 mr-2" />
                          Configure Languages
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-dashed">
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm flex items-center">
                          <Lock className="h-4 w-4 mr-2" />
                          Privacy & Data Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                          Configure data retention and privacy settings for conversation logs.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          <Lock className="h-4 w-4 mr-2" />
                          Configure Privacy Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Knowledge Base Entry Dialog */}
      <Dialog open={isKnowledgeBaseEntryDialogOpen} onOpenChange={setIsKnowledgeBaseEntryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedKnowledgeBaseEntry ? 'Edit Knowledge Base Entry' : 'Add Knowledge Base Entry'}
            </DialogTitle>
            <DialogDescription>
              {selectedKnowledgeBaseEntry 
                ? 'Update information in your knowledge base'
                : 'Add new information to your chatbot knowledge base'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="entryTitle">Title</Label>
                <Input 
                  id="entryTitle" 
                  placeholder="e.g., How to Reset Password"
                  defaultValue={selectedKnowledgeBaseEntry?.title}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entryContent">Content</Label>
                <Textarea 
                  id="entryContent" 
                  placeholder="Provide the knowledge or information that the chatbot should use..."
                  rows={6}
                  defaultValue={selectedKnowledgeBaseEntry?.content}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryCategory">Category</Label>
                  <Select defaultValue={selectedKnowledgeBaseEntry?.category || "features"}>
                    <SelectTrigger id="entryCategory">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="pricing">Pricing</SelectItem>
                      <SelectItem value="features">Features</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="entryRelevance">Relevance Score (0-1)</Label>
                  <Input 
                    id="entryRelevance" 
                    type="number" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    defaultValue={selectedKnowledgeBaseEntry?.relevance || 0.8}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entryTags">Tags (comma separated)</Label>
                <Input 
                  id="entryTags" 
                  placeholder="e.g., password, reset, account"
                  defaultValue={selectedKnowledgeBaseEntry?.tags.join(', ')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entryKeywords">Keywords (comma separated)</Label>
                <Input 
                  id="entryKeywords" 
                  placeholder="e.g., forgot password, login issue"
                  defaultValue={selectedKnowledgeBaseEntry?.keywords.join(', ')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entryVersion">Version</Label>
                <Input 
                  id="entryVersion" 
                  placeholder="e.g., 1.0"
                  defaultValue={selectedKnowledgeBaseEntry?.version || "1.0"}
                />
              </div>
            </div>
            
            {!selectedKnowledgeBaseEntry && (
              <Alert>
                <AlignLeft className="h-4 w-4" />
                <AlertTitle>Adding Knowledge</AlertTitle>
                <AlertDescription>
                  The chatbot will use this information to answer user questions. Be clear, accurate, and concise.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsKnowledgeBaseEntryDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const entryTitle = (document.getElementById('entryTitle') as HTMLInputElement).value;
              const entryContent = (document.getElementById('entryContent') as HTMLTextAreaElement).value;
              const entryCategory = (document.getElementById('entryCategory') as HTMLSelectElement).value as any;
              const entryRelevance = parseFloat((document.getElementById('entryRelevance') as HTMLInputElement).value);
              const entryTags = (document.getElementById('entryTags') as HTMLInputElement).value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
              const entryKeywords = (document.getElementById('entryKeywords') as HTMLInputElement).value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword !== '');
              const entryVersion = (document.getElementById('entryVersion') as HTMLInputElement).value;
              
              if (!entryTitle || !entryContent) {
                toast({
                  title: "Missing Information",
                  description: "Please provide both a title and content for the knowledge base entry.",
                  variant: "destructive",
                });
                return;
              }
              
              if (selectedKnowledgeBaseEntry) {
                handleUpdateKnowledgeBaseEntry({
                  ...selectedKnowledgeBaseEntry,
                  title: entryTitle,
                  content: entryContent,
                  category: entryCategory,
                  relevance: entryRelevance,
                  tags: entryTags,
                  keywords: entryKeywords,
                  version: entryVersion
                });
              } else {
                handleAddKnowledgeBaseEntry({
                  title: entryTitle,
                  content: entryContent,
                  category: entryCategory,
                  relevance: entryRelevance,
                  tags: entryTags,
                  keywords: entryKeywords,
                  version: entryVersion
                });
              }
            }}>
              {selectedKnowledgeBaseEntry ? 'Update Entry' : 'Add Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatbotManager;
