
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Binary, Book, BookOpen, BrainCircuit, Check, Clock, Database, FileSpreadsheet, 
  FileText, FolderInput, Gauge, UploadCloud, X
} from 'lucide-react';

interface TrainingDataItem {
  id: string;
  title: string;
  type: 'vocabulary' | 'text' | 'dialogue' | 'grammar';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'approved' | 'pending' | 'rejected';
  source: 'user' | 'system' | 'imported';
  tags: string[];
  confidence: number;
  createdAt: string;
}

const TrainingDataManager: React.FC = () => {
  // Sample training data
  const [trainingData, setTrainingData] = useState<TrainingDataItem[]>([
    {
      id: '1',
      title: 'Common Italian Greetings',
      type: 'vocabulary',
      difficulty: 'beginner',
      status: 'approved',
      source: 'system',
      tags: ['greetings', 'basics', 'formal', 'informal'],
      confidence: 95,
      createdAt: '2025-03-15'
    },
    {
      id: '2',
      title: 'Restaurant Dialogues',
      type: 'dialogue',
      difficulty: 'intermediate',
      status: 'approved',
      source: 'system',
      tags: ['food', 'dining', 'ordering', 'conversation'],
      confidence: 92,
      createdAt: '2025-03-18'
    },
    {
      id: '3',
      title: 'Past Tense Conjugations',
      type: 'grammar',
      difficulty: 'intermediate',
      status: 'approved',
      source: 'system',
      tags: ['verbs', 'tenses', 'conjugation', 'past'],
      confidence: 98,
      createdAt: '2025-03-20'
    },
    {
      id: '4',
      title: 'Italian News Article - Politics',
      type: 'text',
      difficulty: 'advanced',
      status: 'pending',
      source: 'imported',
      tags: ['news', 'politics', 'reading', 'current events'],
      confidence: 78,
      createdAt: '2025-04-02'
    },
    {
      id: '5',
      title: 'Travel Vocabulary',
      type: 'vocabulary',
      difficulty: 'beginner',
      status: 'approved',
      source: 'user',
      tags: ['travel', 'transportation', 'directions', 'accommodation'],
      confidence: 88,
      createdAt: '2025-04-05'
    },
  ]);
  
  // State for new training data item
  const [newDataTitle, setNewDataTitle] = useState('');
  const [newDataType, setNewDataType] = useState<string>('vocabulary');
  const [newDataDifficulty, setNewDataDifficulty] = useState<string>('beginner');
  const [newDataTags, setNewDataTags] = useState('');
  const [newDataContent, setNewDataContent] = useState('');
  const [currentTab, setCurrentTab] = useState('browse');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  
  // Handle upload simulation
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  // Handle adding new data
  const handleAddData = () => {
    if (!newDataTitle.trim()) return;
    
    const newItem: TrainingDataItem = {
      id: Date.now().toString(),
      title: newDataTitle,
      type: newDataType as any,
      difficulty: newDataDifficulty as any,
      status: 'pending',
      source: 'user',
      tags: newDataTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      confidence: 80,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTrainingData(prev => [newItem, ...prev]);
    
    // Reset form
    setNewDataTitle('');
    setNewDataType('vocabulary');
    setNewDataDifficulty('beginner');
    setNewDataTags('');
    setNewDataContent('');
    setCurrentTab('browse');
  };
  
  // Handle data approval toggle
  const toggleApproval = (id: string) => {
    setTrainingData(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'approved' ? 'pending' : 'approved'
        };
      }
      return item;
    }));
  };
  
  // Get filtered data
  const getFilteredData = () => {
    return trainingData.filter(item => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (difficultyFilter !== 'all' && item.difficulty !== difficultyFilter) return false;
      return true;
    });
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vocabulary': return <Book className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'dialogue': return <BookOpen className="h-4 w-4" />;
      case 'grammar': return <FileSpreadsheet className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': 
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case 'pending': 
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'rejected': 
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
      default: 
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get difficulty badge
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': 
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">Beginner</Badge>;
      case 'intermediate': 
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">Intermediate</Badge>;
      case 'advanced': 
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">Advanced</Badge>;
      default: 
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Database className="mr-2 h-5 w-5 text-primary" />
          Training Data Manager
        </CardTitle>
        <CardDescription>
          Manage and process AI training materials for language learning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Browse Data
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center">
              <UploadCloud className="mr-2 h-4 w-4" />
              Add New Data
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-6 mt-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <Label htmlFor="status-filter" className="text-xs">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="w-[130px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="type-filter" className="text-xs">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter" className="w-[140px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="vocabulary">Vocabulary</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="dialogue">Dialogue</SelectItem>
                    <SelectItem value="grammar">Grammar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="difficulty-filter" className="text-xs">Difficulty</Label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger id="difficulty-filter" className="w-[140px]">
                    <SelectValue placeholder="Filter by difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              {getFilteredData().length > 0 ? (
                getFilteredData().map(item => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <div className="mr-2">
                            {getTypeIcon(item.type)}
                          </div>
                          <h3 className="font-medium">{item.title}</h3>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>Added: {item.createdAt}</span>
                          <span>•</span>
                          <span>Source: {item.source}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(item.status)}
                        {getDifficultyBadge(item.difficulty)}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Confidence: {item.confidence}%</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleApproval(item.id)}
                          className="flex items-center"
                        >
                          {item.status === 'approved' ? (
                            <>
                              <X className="h-3 w-3 mr-1 text-red-500" />
                              Unapprove
                            </>
                          ) : (
                            <>
                              <Check className="h-3 w-3 mr-1 text-green-500" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                  <h3 className="text-lg font-medium mb-2">No data found</h3>
                  <p className="text-muted-foreground mb-4">No training data matches your filter criteria</p>
                  <Button onClick={() => {
                    setStatusFilter('all');
                    setTypeFilter('all');
                    setDifficultyFilter('all');
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="add" className="space-y-6 mt-4">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-title">Title</Label>
                <Input 
                  id="data-title" 
                  value={newDataTitle} 
                  onChange={(e) => setNewDataTitle(e.target.value)} 
                  placeholder="e.g., Italian Business Vocabulary"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data-type">Content Type</Label>
                  <Select value={newDataType} onValueChange={setNewDataType}>
                    <SelectTrigger id="data-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vocabulary">Vocabulary</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="dialogue">Dialogue</SelectItem>
                      <SelectItem value="grammar">Grammar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data-difficulty">Difficulty Level</Label>
                  <Select value={newDataDifficulty} onValueChange={setNewDataDifficulty}>
                    <SelectTrigger id="data-difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-tags">Tags (comma separated)</Label>
                <Input 
                  id="data-tags" 
                  value={newDataTags} 
                  onChange={(e) => setNewDataTags(e.target.value)} 
                  placeholder="e.g., business, office, professional, formal"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-content">Content</Label>
                <Textarea 
                  id="data-content" 
                  value={newDataContent} 
                  onChange={(e) => setNewDataContent(e.target.value)} 
                  placeholder="Enter your content here..."
                  rows={8}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="show-advanced" 
                    checked={showAdvanced} 
                    onCheckedChange={setShowAdvanced} 
                  />
                  <Label htmlFor="show-advanced" className="text-sm">Show advanced options</Label>
                </div>
                <Button 
                  onClick={handleAddData}
                  disabled={!newDataTitle.trim()}
                  className="flex items-center"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Add Training Data
                </Button>
              </div>
              
              {showAdvanced && (
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="text-sm font-medium">Advanced Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm" htmlFor="auto-processing">
                        Automatic data processing
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Process and categorize content automatically
                      </p>
                    </div>
                    <Switch id="auto-processing" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm" htmlFor="verification">
                        Require verification
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Require manual approval before data is used
                      </p>
                    </div>
                    <Switch id="verification" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm" htmlFor="train-immediately">
                        Train models immediately
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Update AI models with new data right away
                      </p>
                    </div>
                    <Switch id="train-immediately" defaultChecked={false} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium flex items-center">
                  <FolderInput className="mr-2 h-4 w-4 text-blue-600" />
                  File Upload
                </h3>
                
                <Select defaultValue="csv">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="File type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xlsx">Excel</SelectItem>
                    <SelectItem value="txt">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <UploadCloud className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-sm font-medium mb-1">Drop files here or click to upload</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Support for CSV, JSON, Excel, and TXT files
                </p>
                
                <Button className="mx-auto" onClick={simulateUpload}>
                  <Binary className="mr-2 h-4 w-4" />
                  Select Files
                </Button>
                
                {isUploading && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <BrainCircuit className="h-4 w-4 mr-2" />
          <span>{trainingData.length} training items in database</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>Last updated: April 9, 2025</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrainingDataManager;
