
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Database, Upload, FileText, AlertTriangle, CheckCircle, Trash2, Plus, RefreshCw, Filter } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AITrainingData } from '@/types/ai-types';

const TrainingDataManager: React.FC = () => {
  const { toast } = useToast();
  
  const [trainingData, setTrainingData] = useState<AITrainingData[]>([
    { 
      id: '1', 
      content: 'Qual è la capitale dell\'Italia?', 
      label: 'geography-question', 
      source: 'manual-entry',
      languageLevel: 'A2',
      dateAdded: new Date('2025-02-10'),
      isVerified: true
    },
    { 
      id: '2', 
      content: 'Il Colosseo si trova a Roma.', 
      label: 'cultural-fact', 
      source: 'imported',
      languageLevel: 'A1',
      dateAdded: new Date('2025-02-15'),
      isVerified: true
    },
    { 
      id: '3', 
      content: 'Come si usa il congiuntivo in italiano?', 
      label: 'grammar-question', 
      source: 'generated',
      languageLevel: 'B1',
      dateAdded: new Date('2025-03-01'),
      isVerified: false
    },
    { 
      id: '4', 
      content: 'La pizza margherita è stata inventata a Napoli.', 
      label: 'cultural-fact', 
      source: 'imported',
      languageLevel: 'A2',
      dateAdded: new Date('2025-03-05'),
      isVerified: true
    },
    { 
      id: '5', 
      content: 'Quali sono i tempi verbali in italiano?', 
      label: 'grammar-question', 
      source: 'manual-entry',
      languageLevel: 'B1',
      dateAdded: new Date('2025-03-10'),
      isVerified: true
    }
  ]);
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [newExample, setNewExample] = useState({ content: '', label: 'grammar-question', languageLevel: 'B1' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState({ verified: 'all', label: 'all', level: 'all' });
  
  const dataStats = {
    total: trainingData.length,
    verified: trainingData.filter(item => item.isVerified).length,
    unverified: trainingData.filter(item => !item.isVerified).length,
    distribution: {
      'grammar-question': trainingData.filter(item => item.label === 'grammar-question').length,
      'cultural-fact': trainingData.filter(item => item.label === 'cultural-fact').length,
      'geography-question': trainingData.filter(item => item.label === 'geography-question').length
    }
  };
  
  const handleToggleVerify = (id: string) => {
    setTrainingData(data => 
      data.map(item => 
        item.id === id 
          ? { ...item, isVerified: !item.isVerified } 
          : item
      )
    );
    
    toast({
      title: "Status Updated",
      description: "Training data verification status has been updated.",
    });
  };
  
  const handleDeleteItem = (id: string) => {
    setTrainingData(data => data.filter(item => item.id !== id));
    setSelectedItems(items => items.filter(item => item !== id));
    
    toast({
      title: "Item Deleted",
      description: "Training data item has been removed.",
    });
  };
  
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    setTrainingData(data => data.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    
    toast({
      title: "Items Deleted",
      description: `${selectedItems.length} training data items have been removed.`,
    });
  };
  
  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };
  
  const handleAddExample = () => {
    if (!newExample.content.trim()) {
      toast({
        title: "Error",
        description: "Content cannot be empty.",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: AITrainingData = {
      id: Math.random().toString(36).substring(2, 9),
      content: newExample.content,
      label: newExample.label,
      source: 'manual-entry',
      languageLevel: newExample.languageLevel,
      dateAdded: new Date(),
      isVerified: false
    };
    
    setTrainingData(prev => [...prev, newItem]);
    setNewExample({ content: '', label: 'grammar-question', languageLevel: 'B1' });
    setShowAddForm(false);
    
    toast({
      title: "Example Added",
      description: "New training example has been added.",
    });
  };
  
  const handleImportData = () => {
    // Simulated import functionality
    toast({
      title: "Import Started",
      description: "Importing training data. This may take a moment.",
    });
    
    // Simulate delay
    setTimeout(() => {
      toast({
        title: "Import Complete",
        description: "10 new training examples have been imported.",
      });
    }, 2000);
  };
  
  const handleGenerateData = () => {
    // Simulated generation functionality
    toast({
      title: "Generation Started",
      description: "Generating training data using AI. This may take a moment.",
    });
    
    // Simulate delay
    setTimeout(() => {
      toast({
        title: "Generation Complete",
        description: "15 new training examples have been generated.",
      });
    }, 3000);
  };
  
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      setNewExample({ content: '', label: 'grammar-question', languageLevel: 'B1' });
    }
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const filteredData = trainingData.filter(item => {
    if (filter.verified !== 'all') {
      if (filter.verified === 'verified' && !item.isVerified) return false;
      if (filter.verified === 'unverified' && item.isVerified) return false;
    }
    
    if (filter.label !== 'all' && item.label !== filter.label) return false;
    if (filter.level !== 'all' && item.languageLevel !== filter.level) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Training Data Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage data used to train the Italian language AI models
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center"
            onClick={toggleAddForm}
          >
            {showAddForm ? <AlertTriangle className="mr-1 h-4 w-4" /> : <Plus className="mr-1 h-4 w-4" />}
            {showAddForm ? 'Cancel' : 'Add Example'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center"
            onClick={handleImportData}
          >
            <Upload className="mr-1 h-4 w-4" />
            Import
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center"
            onClick={handleGenerateData}
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Generate
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm"
            className="flex items-center"
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      </div>
      
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Training Example</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="example-content">Content</Label>
                <Input 
                  id="example-content"
                  value={newExample.content}
                  onChange={(e) => setNewExample({...newExample, content: e.target.value})}
                  placeholder="Enter Italian text example"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="example-label">Category</Label>
                  <Select 
                    value={newExample.label} 
                    onValueChange={(value) => setNewExample({...newExample, label: value})}
                  >
                    <SelectTrigger id="example-label">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grammar-question">Grammar Question</SelectItem>
                      <SelectItem value="cultural-fact">Cultural Fact</SelectItem>
                      <SelectItem value="vocabulary">Vocabulary</SelectItem>
                      <SelectItem value="geography-question">Geography Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="example-level">Language Level</Label>
                  <Select 
                    value={newExample.languageLevel} 
                    onValueChange={(value) => setNewExample({...newExample, languageLevel: value})}
                  >
                    <SelectTrigger id="example-level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1">A1 - Beginner</SelectItem>
                      <SelectItem value="A2">A2 - Elementary</SelectItem>
                      <SelectItem value="B1">B1 - Intermediate</SelectItem>
                      <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                      <SelectItem value="C1">C1 - Advanced</SelectItem>
                      <SelectItem value="C2">C2 - Proficient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button onClick={handleAddExample} className="ml-auto">
              Add Example
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="mr-2 h-4 w-4 text-primary" />
              Total Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dataStats.verified} verified, {dataStats.unverified} pending verification
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="mr-2 h-4 w-4 text-primary" />
              Data Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((dataStats.verified / dataStats.total) * 100)}%</div>
            <Progress 
              value={(dataStats.verified / dataStats.total) * 100} 
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-primary" />
              Needs Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataStats.unverified}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((dataStats.unverified / dataStats.total) * 100)}% of total data
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Training Examples</CardTitle>
              <CardDescription>
                {filteredData.length} examples shown (filtered from {trainingData.length} total)
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select 
                value={filter.verified} 
                onValueChange={(value) => handleFilterChange('verified', value)}
              >
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={filter.label} 
                onValueChange={(value) => handleFilterChange('label', value)}
              >
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="grammar-question">Grammar</SelectItem>
                  <SelectItem value="cultural-fact">Cultural</SelectItem>
                  <SelectItem value="geography-question">Geography</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={filter.level} 
                onValueChange={(value) => handleFilterChange('level', value)}
              >
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={
                      filteredData.length > 0 && 
                      selectedItems.length === filteredData.length
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No training data found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => 
                          handleSelectItem(item.id, checked as boolean)
                        }
                        aria-label={`Select item ${item.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.content.length > 50 
                        ? `${item.content.substring(0, 50)}...` 
                        : item.content
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.label.replace(/-/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.languageLevel}</TableCell>
                    <TableCell>
                      {item.isVerified ? (
                        <div className="flex items-center text-green-500">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-500">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span>Pending</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleVerify(item.id)}
                          title={item.isVerified ? "Mark as unverified" : "Mark as verified"}
                        >
                          {item.isVerified ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                          title="Delete item"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingDataManager;
