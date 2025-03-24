
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, Save, RotateCcw, DatabaseBackup, Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { addTrainingExamples, getConfidenceScore } from '@/services/AIService';
import { ContentType } from '@/utils/textAnalysis';

const contentTypes: { value: ContentType; label: string }[] = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'flashcards', label: 'Flashcards' },
  { value: 'writing', label: 'Writing' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'listening', label: 'Listening' }
];

// Sample training examples data
const initialExamples = [
  {
    id: '1',
    contentType: 'multiple-choice' as ContentType,
    text: 'What is the capital of Italy?',
    metadata: {
      options: ['Rome', 'Milan', 'Florence', 'Venice'],
      correctAnswer: 'Rome'
    }
  },
  {
    id: '2',
    contentType: 'flashcards' as ContentType,
    text: 'Buongiorno',
    metadata: {
      translation: 'Good morning',
      example: 'Buongiorno, come stai?'
    }
  },
  {
    id: '3',
    contentType: 'speaking' as ContentType,
    text: 'Come ti chiami?',
    metadata: {
      translation: 'What is your name?',
      difficulty: 'beginner'
    }
  }
];

interface TrainingExample {
  id: string;
  contentType: ContentType;
  text: string;
  metadata: any;
}

const AITrainingManager: React.FC = () => {
  const [examples, setExamples] = useState<TrainingExample[]>(initialExamples);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('multiple-choice');
  const [newExampleText, setNewExampleText] = useState('');
  const [newExampleMetadata, setNewExampleMetadata] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confidenceScores, setConfidenceScores] = useState<Record<ContentType, number>>({
    'multiple-choice': 85,
    'flashcards': 78,
    'writing': 72,
    'speaking': 68,
    'listening': 80
  });
  
  const { toast } = useToast();
  
  // Load confidence scores on mount
  useEffect(() => {
    const loadConfidenceScores = () => {
      const scores: Record<ContentType, number> = {} as Record<ContentType, number>;
      
      contentTypes.forEach(type => {
        scores[type.value] = getConfidenceScore(type.value);
      });
      
      setConfidenceScores(scores);
    };
    
    loadConfidenceScores();
  }, []);
  
  const handleAddExample = () => {
    if (!newExampleText.trim()) {
      toast({
        title: "Empty Example",
        description: "Please provide text for the training example.",
        variant: "destructive",
      });
      return;
    }
    
    let metadata: any;
    try {
      metadata = newExampleMetadata ? JSON.parse(newExampleMetadata) : {};
    } catch (error) {
      toast({
        title: "Invalid Metadata",
        description: "Please provide valid JSON for metadata.",
        variant: "destructive",
      });
      return;
    }
    
    const newExample: TrainingExample = {
      id: `example-${Date.now()}`,
      contentType: selectedContentType,
      text: newExampleText,
      metadata
    };
    
    setExamples([...examples, newExample]);
    setNewExampleText('');
    setNewExampleMetadata('');
    
    toast({
      title: "Example Added",
      description: "Training example has been added to the list.",
    });
  };
  
  const handleDeleteExample = (id: string) => {
    setExamples(examples.filter(ex => ex.id !== id));
    
    toast({
      title: "Example Deleted",
      description: "Training example has been removed.",
    });
  };
  
  const handleTrainModel = async () => {
    setIsSubmitting(true);
    
    try {
      // Group examples by content type
      const examplesByType: Record<ContentType, TrainingExample[]> = {} as Record<ContentType, TrainingExample[]>;
      
      contentTypes.forEach(type => {
        examplesByType[type.value] = examples.filter(ex => ex.contentType === type.value);
      });
      
      // Submit examples to AI service for training
      for (const type of contentTypes) {
        const typeExamples = examplesByType[type.value];
        if (typeExamples.length > 0) {
          const addedCount = addTrainingExamples(type.value, typeExamples);
          
          // Update confidence score for this content type
          setConfidenceScores(prev => ({
            ...prev,
            [type.value]: getConfidenceScore(type.value)
          }));
          
          toast({
            title: `${type.label} Model Updated`,
            description: `Added ${addedCount} training examples for ${type.label}.`,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Training Error",
        description: "Failed to train the AI model with the provided examples.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResetExamples = () => {
    setExamples(initialExamples);
    
    toast({
      title: "Examples Reset",
      description: "Training examples have been reset to default values.",
    });
  };
  
  const renderMetadataFields = () => {
    switch (selectedContentType) {
      case 'multiple-choice':
        return (
          <div className="text-sm text-muted-foreground mt-2">
            <p>Metadata format for Multiple Choice:</p>
            <pre className="bg-secondary/30 p-2 rounded text-xs mt-1">
{`{
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": "Option 2"
}`}
            </pre>
          </div>
        );
      case 'flashcards':
        return (
          <div className="text-sm text-muted-foreground mt-2">
            <p>Metadata format for Flashcards:</p>
            <pre className="bg-secondary/30 p-2 rounded text-xs mt-1">
{`{
  "translation": "English translation",
  "example": "Example usage"
}`}
            </pre>
          </div>
        );
      case 'speaking':
        return (
          <div className="text-sm text-muted-foreground mt-2">
            <p>Metadata format for Speaking:</p>
            <pre className="bg-secondary/30 p-2 rounded text-xs mt-1">
{`{
  "translation": "English translation",
  "difficulty": "beginner|intermediate|advanced"
}`}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Training Management</CardTitle>
          <CardDescription>
            Add training examples to improve AI content type recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentTypes.map((type) => (
                <Card key={type.value} className="overflow-hidden">
                  <div className="flex flex-col h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{type.label}</CardTitle>
                        <Badge variant={confidenceScores[type.value] > 80 ? "default" : "outline"}>
                          {confidenceScores[type.value]}% Confidence
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 flex-grow">
                      <Progress 
                        value={confidenceScores[type.value]} 
                        className="h-2 mb-2"
                      />
                      <p className="text-sm text-muted-foreground">
                        {examples.filter(ex => ex.contentType === type.value).length} training examples
                      </p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-4">Add New Training Example</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select 
                    value={selectedContentType} 
                    onValueChange={(value: ContentType) => setSelectedContentType(value)}
                  >
                    <SelectTrigger id="contentType">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="exampleText">Example Text</Label>
                  <Textarea
                    id="exampleText"
                    placeholder="Enter the text content for this training example"
                    value={newExampleText}
                    onChange={(e) => setNewExampleText(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="metadata">Metadata (JSON)</Label>
                  <Textarea
                    id="metadata"
                    placeholder="Enter additional metadata as JSON"
                    value={newExampleMetadata}
                    onChange={(e) => setNewExampleMetadata(e.target.value)}
                    rows={4}
                  />
                  {renderMetadataFields()}
                </div>
                
                <Button onClick={handleAddExample} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Example
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Training Examples</CardTitle>
          <CardDescription>
            Manage your training examples for AI content recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          {examples.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No training examples added yet.
            </div>
          ) : (
            <Table>
              <TableCaption>List of training examples for AI model</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Example Text</TableHead>
                  <TableHead>Metadata</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examples.map((example) => (
                  <TableRow key={example.id}>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {example.contentType.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{example.text}</TableCell>
                    <TableCell>
                      <pre className="text-xs max-w-[280px] overflow-hidden text-ellipsis">
                        {JSON.stringify(example.metadata, null, 2)}
                      </pre>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExample(example.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleResetExamples}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Examples
          </Button>
          
          <Button onClick={handleTrainModel} disabled={isSubmitting}>
            <Brain className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Training...' : 'Train Model'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AITrainingManager;
