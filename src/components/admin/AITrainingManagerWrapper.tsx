
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Upload, Database, RefreshCw, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TrainingDataItem {
  id: string;
  name: string;
  type: 'vocabulary' | 'grammar' | 'conversation' | 'reading';
  size: number;
  status: 'ready' | 'processing' | 'error';
  items: number;
  accuracy: number;
  dateAdded: string;
}

interface ModelPerformanceItem {
  id: string;
  name: string;
  accuracy: number;
  speed: number;
  trained: number;
  lastUpdate: string;
}

const AITrainingManagerWrapper: React.FC = () => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trainingData, setTrainingData] = useState<TrainingDataItem[]>([]);
  const [models, setModels] = useState<ModelPerformanceItem[]>([]);

  // Mock data initialization
  useEffect(() => {
    setTrainingData([
      {
        id: '1',
        name: 'Italian Vocabulary - A1/A2',
        type: 'vocabulary',
        size: 1250,
        status: 'ready',
        items: 2500,
        accuracy: 95,
        dateAdded: '2023-03-15'
      },
      {
        id: '2',
        name: 'Grammar Rules - B1',
        type: 'grammar',
        size: 850,
        status: 'ready',
        items: 350,
        accuracy: 92,
        dateAdded: '2023-04-22'
      },
      {
        id: '3',
        name: 'Italian Conversations',
        type: 'conversation',
        size: 2100,
        status: 'processing',
        items: 180,
        accuracy: 88,
        dateAdded: '2023-05-10'
      },
      {
        id: '4',
        name: 'Reading Comprehension - B2/C1',
        type: 'reading',
        size: 3250,
        status: 'error',
        items: 75,
        accuracy: 0,
        dateAdded: '2023-05-18'
      }
    ]);

    setModels([
      {
        id: '1',
        name: 'Italian Grammar Correction',
        accuracy: 94.2,
        speed: 120,
        trained: 15000,
        lastUpdate: '2023-05-20'
      },
      {
        id: '2',
        name: 'Vocabulary Generation',
        accuracy: 89.7,
        speed: 95,
        trained: 22000,
        lastUpdate: '2023-05-15'
      },
      {
        id: '3',
        name: 'Conversation Analysis',
        accuracy: 91.5,
        speed: 105,
        trained: 8500,
        lastUpdate: '2023-05-10'
      }
    ]);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            // Add the new dataset
            const newDataset: TrainingDataItem = {
              id: Date.now().toString(),
              name: file.name.replace(/\.[^/.]+$/, ""),
              type: 'vocabulary',
              size: Math.round(file.size / 1024),
              status: 'processing',
              items: Math.round(file.size / 1024 / 2),
              accuracy: 0,
              dateAdded: new Date().toISOString().split('T')[0]
            };
            setTrainingData(prev => [...prev, newDataset]);
            toast({
              title: 'Upload Complete',
              description: `${file.name} has been uploaded and is being processed.`,
            });
          }, 500);
        }
        return newProgress;
      });
    }, 300);
  };
  
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Update a random dataset to simulate changes
      setTrainingData(prev => 
        prev.map(item => {
          if (item.status === 'processing') {
            return {
              ...item,
              status: 'ready',
              accuracy: Math.round(85 + Math.random() * 10)
            };
          }
          return item;
        })
      );
      setIsRefreshing(false);
      toast({
        title: 'Data Refreshed',
        description: 'Training data has been updated with the latest information.',
      });
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-600">Ready</Badge>;
      case 'processing':
        return <Badge className="bg-amber-500">Processing</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Training Data Management</CardTitle>
          <CardDescription>
            Upload and manage datasets for AI model training
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="datasets">
            <TabsList className="mb-4">
              <TabsTrigger value="datasets">Datasets</TabsTrigger>
              <TabsTrigger value="models">Model Performance</TabsTrigger>
              <TabsTrigger value="upload">Upload Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="datasets">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Available Datasets</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? 
                    <Loader2 className="h-4 w-4 animate-spin" /> : 
                    <RefreshCw className="h-4 w-4" />
                  }
                  Refresh
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size (KB)</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Added</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainingData.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.items}</TableCell>
                        <TableCell>
                          {item.status === 'ready' ? `${item.accuracy}%` : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.dateAdded}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="models">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Model Performance</h3>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Speed (ms)</TableHead>
                      <TableHead>Samples Trained</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map(model => (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium">{model.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{model.accuracy}%</span>
                            {model.accuracy > 90 ? 
                              <CheckCircle className="h-4 w-4 text-green-500" /> : 
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                            }
                          </div>
                        </TableCell>
                        <TableCell>{model.speed} ms</TableCell>
                        <TableCell>{model.trained.toLocaleString()}</TableCell>
                        <TableCell>{model.lastUpdate}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-600">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="upload">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Upload New Dataset</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload data files for training the AI models. Supported formats: CSV, JSON, TXT.
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dataset-name">Dataset Name</Label>
                      <Input id="dataset-name" placeholder="Enter dataset name" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dataset-type">Dataset Type</Label>
                      <Select defaultValue="vocabulary">
                        <SelectTrigger id="dataset-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vocabulary">Vocabulary</SelectItem>
                          <SelectItem value="grammar">Grammar</SelectItem>
                          <SelectItem value="conversation">Conversation</SelectItem>
                          <SelectItem value="reading">Reading</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Upload File</Label>
                    <Input 
                      id="file-upload" 
                      type="file" 
                      accept=".csv,.json,.txt" 
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                  
                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertTitle>Dataset Requirements</AlertTitle>
                    <AlertDescription>
                      For best results, ensure your dataset has at least 500 examples. 
                      Data should be properly formatted with labels for supervised learning.
                    </AlertDescription>
                  </Alert>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    disabled={isUploading} 
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Start Upload
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITrainingManagerWrapper;
