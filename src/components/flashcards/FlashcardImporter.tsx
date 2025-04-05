
import React, { useState, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Flashcard, ImportFormat } from '@/types';
import { useFlashcardImporter } from '@/hooks/useFlashcardImporter';
import { Upload, AlertCircle, File, FileText, Table } from 'lucide-react';

interface FlashcardImporterProps {
  onImportComplete?: (flashcards: Flashcard[]) => void;
  onError?: (error: string) => void;
  maxImport?: number;
}

const FlashcardImporter: React.FC<FlashcardImporterProps> = ({
  onImportComplete,
  onError,
  maxImport = 100
}) => {
  const { toast } = useToast();
  
  // State for import options
  const [importType, setImportType] = useState<'file' | 'paste'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  
  // Loading state
  const [isImporting, setIsImporting] = useState(false);
  
  // For file drop interaction
  const [isDragging, setIsDragging] = useState(false);
  
  // Import service
  const { importFromText, importFromFile, setImportFormat, importFormat } = useFlashcardImporter();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      
      // Auto-detect format from file extension
      const fileName = e.target.files[0].name.toLowerCase();
      if (fileName.endsWith('.csv')) {
        setImportFormat({ ...importFormat, type: 'csv' });
      } else if (fileName.endsWith('.json')) {
        setImportFormat({ ...importFormat, type: 'json' });
      } else if (fileName.endsWith('.txt')) {
        setImportFormat({ ...importFormat, type: 'text' });
      }
    }
  };
  
  // Handle format change
  const handleFormatChange = (value: string) => {
    setImportFormat({
      ...importFormat,
      type: value as 'csv' | 'json' | 'text' | 'anki' | 'quizlet'
    });
  };
  
  // Handle delimiter change
  const handleDelimiterChange = (value: string) => {
    setImportFormat({ 
      ...importFormat, 
      delimiter: value 
    });
  };
  
  // Handle header change
  const handleHeaderChange = (value: string) => {
    setImportFormat({ 
      ...importFormat, 
      hasHeader: value === 'true' 
    });
  };
  
  // Handle field mapping changes
  const handleFieldMapChange = (field: string, value: string) => {
    setImportFormat({
      ...importFormat,
      fieldMap: { 
        ...(importFormat.fieldMap || {}), 
        [field]: value 
      }
    });
  };
  
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      
      // Auto-detect format from file extension
      const fileName = e.dataTransfer.files[0].name.toLowerCase();
      if (fileName.endsWith('.csv')) {
        setImportFormat({ ...importFormat, type: 'csv' });
      } else if (fileName.endsWith('.json')) {
        setImportFormat({ ...importFormat, type: 'json' });
      } else if (fileName.endsWith('.txt')) {
        setImportFormat({ ...importFormat, type: 'text' });
      }
    }
  };
  
  // Import function
  const handleImport = async () => {
    setIsImporting(true);
    
    try {
      let importedCards: Flashcard[] = [];
      
      if (importType === 'file' && selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('File size exceeds 5MB limit');
        }
        
        importedCards = await importFromFile(selectedFile);
      } else if (importType === 'paste' && pastedText) {
        importedCards = await importFromText(pastedText);
      } else {
        throw new Error('No file selected or text pasted');
      }
      
      // Limit if needed
      if (maxImport && importedCards.length > maxImport) {
        toast({
          title: `Import limited to ${maxImport} cards`,
          description: `Only the first ${maxImport} out of ${importedCards.length} cards were imported.`,
          variant: "warning"
        });
        importedCards = importedCards.slice(0, maxImport);
      }
      
      // Success
      toast({
        title: "Import successful",
        description: `Successfully imported ${importedCards.length} flashcards.`,
      });
      
      // Callback with imported cards
      if (onImportComplete) {
        onImportComplete(importedCards);
      }
      
      // Reset states
      setSelectedFile(null);
      setPastedText('');
      
    } catch (error) {
      console.error('Import error:', error);
      
      // Toast error message
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'An unknown error occurred during import',
        variant: "destructive"
      });
      
      // Error callback
      if (onError) {
        onError(error instanceof Error ? error.message : 'Import error occurred');
      }
    } finally {
      setIsImporting(false);
    }
  };
  
  // For CSV and delimited formats, show a preview of how the data will be parsed
  const renderFormatSpecificOptions = () => {
    if (importFormat.type === 'csv' || importFormat.type === 'text') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Delimiter</Label>
              <Select 
                value={importFormat.delimiter || ','} 
                onValueChange={handleDelimiterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select delimiter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Comma (,)</SelectItem>
                  <SelectItem value=";">Semicolon (;)</SelectItem>
                  <SelectItem value="\t">Tab</SelectItem>
                  <SelectItem value="|">Pipe (|)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Has Header Row</Label>
              <Select 
                value={importFormat.hasHeader ? 'true' : 'false'} 
                onValueChange={handleHeaderChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Field Mapping</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Italian Field</Label>
                <Select 
                  value={importFormat.fieldMap?.italian || 'italian'}
                  onValueChange={(value) => handleFieldMapChange('italian', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="italian">italian</SelectItem>
                    <SelectItem value="front">front</SelectItem>
                    <SelectItem value="term">term</SelectItem>
                    <SelectItem value="question">question</SelectItem>
                    <SelectItem value="col1">Column 1</SelectItem>
                    <SelectItem value="col2">Column 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">English Field</Label>
                <Select 
                  value={importFormat.fieldMap?.english || 'english'}
                  onValueChange={(value) => handleFieldMapChange('english', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">english</SelectItem>
                    <SelectItem value="back">back</SelectItem>
                    <SelectItem value="definition">definition</SelectItem>
                    <SelectItem value="answer">answer</SelectItem>
                    <SelectItem value="col1">Column 1</SelectItem>
                    <SelectItem value="col2">Column 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Tags Field (optional)</Label>
                <Select 
                  value={importFormat.fieldMap?.tags || 'tags'}
                  onValueChange={(value) => handleFieldMapChange('tags', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tags">tags</SelectItem>
                    <SelectItem value="category">category</SelectItem>
                    <SelectItem value="type">type</SelectItem>
                    <SelectItem value="col3">Column 3</SelectItem>
                    <SelectItem value="none">No Tags</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Level Field (optional)</Label>
                <Select 
                  value={importFormat.fieldMap?.level || 'level'}
                  onValueChange={(value) => handleFieldMapChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="level">level</SelectItem>
                    <SelectItem value="difficulty">difficulty</SelectItem>
                    <SelectItem value="col4">Column 4</SelectItem>
                    <SelectItem value="none">No Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Alert>
            <Table className="h-4 w-4" />
            <AlertTitle>CSV Format Example</AlertTitle>
            <AlertDescription className="text-xs font-mono">
              italian,english,tags,level<br />
              ciao,hello,"greeting,basic",1<br />
              buongiorno,good morning,"greeting,formal",1
            </AlertDescription>
          </Alert>
        </div>
      );
    } else if (importFormat.type === 'json') {
      return (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>JSON Format Example</AlertTitle>
          <AlertDescription className="text-xs font-mono">
            [<br />
            &nbsp;&nbsp;{"{"}<br />
            &nbsp;&nbsp;&nbsp;&nbsp;"italian": "ciao",<br />
            &nbsp;&nbsp;&nbsp;&nbsp;"english": "hello",<br />
            &nbsp;&nbsp;&nbsp;&nbsp;"tags": ["greeting", "basic"],<br />
            &nbsp;&nbsp;&nbsp;&nbsp;"level": 1<br />
            &nbsp;&nbsp;{"}"},<br />
            &nbsp;&nbsp;{"{"}<br />
            &nbsp;&nbsp;&nbsp;&nbsp;"italian": "buongiorno",<br />
            &nbsp;&nbsp;&nbsp;&nbsp;"english": "good morning",<br />
            &nbsp;&nbsp;&nbsp;&nbsp;"tags": ["greeting", "formal"],<br />
            &nbsp;&nbsp;&nbsp;&nbsp;"level": 1<br />
            &nbsp;&nbsp;{"}"}<br />
            ]
          </AlertDescription>
        </Alert>
      );
    } else {
      return null;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Flashcards</CardTitle>
        <CardDescription>
          Import flashcards from various formats
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="file" onValueChange={(v) => setImportType(v as 'file' | 'paste')}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="pt-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              
              <input 
                id="file-upload"
                type="file" 
                className="hidden" 
                accept=".csv,.json,.txt" 
                onChange={handleFileChange}
              />
              
              {selectedFile ? (
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB | {selectedFile.type || 'Unknown format'}
                  </p>
                </div>
              ) : (
                <>
                  <p className="font-medium mb-1">
                    {isDragging ? 'Drop your file here' : 'Drag & drop a file here, or click to browse'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV, JSON, and plain text files
                  </p>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="paste" className="pt-4">
            <Textarea 
              placeholder="Paste your flashcard data here (CSV, JSON, or plain text format)"
              className="min-h-[150px] font-mono text-sm"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
            />
            
            <p className="text-xs text-muted-foreground mt-2">
              Format will be auto-detected from the content. For best results, paste well-formatted CSV or JSON.
            </p>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="format-type">Format Type</Label>
            <Select 
              value={importFormat.type} 
              onValueChange={handleFormatChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="text">Plain Text</SelectItem>
                <SelectItem value="anki">Anki Export</SelectItem>
                <SelectItem value="quizlet">Quizlet Export</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {renderFormatSpecificOptions()}
        </div>
        
        {(importType === 'paste' && !pastedText) || (importType === 'file' && !selectedFile) ? (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Import data required</AlertTitle>
            <AlertDescription>
              {importType === 'file' 
                ? 'Please select a file to import' 
                : 'Please paste your data in the text area above'}
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button 
          onClick={handleImport} 
          disabled={isImporting || 
            (importType === 'paste' && !pastedText) || 
            (importType === 'file' && !selectedFile)}
        >
          {isImporting ? 'Importing...' : 'Import Flashcards'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlashcardImporter;
