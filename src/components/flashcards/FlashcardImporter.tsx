
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useFlashcards, ImportOptions, ImportResult } from '@/hooks/useFlashcards';
import { Check, FileDown, FileUp, Upload, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FlashcardImporterProps {
  onClose?: () => void;
}

export const FlashcardImporter: React.FC<FlashcardImporterProps> = ({ onClose }) => {
  const { importFlashcards, exportFlashcards, flashcardSets } = useFlashcards();
  const { toast } = useToast();
  
  // Import state
  const [importFormat, setImportFormat] = useState<'csv' | 'txt' | 'json' | 'anki'>('csv');
  const [fileContent, setFileContent] = useState('');
  const [selectedSetName, setSelectedSetName] = useState('');
  const [separator, setSeparator] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [italianColumn, setItalianColumn] = useState(0);
  const [englishColumn, setEnglishColumn] = useState(1);
  const [importLoading, setImportLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Export state
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [exportSetId, setExportSetId] = useState<string | null>(null);
  const [exportContent, setExportContent] = useState('');
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setErrorMessage(null);
    
    if (acceptedFiles.length === 0) {
      setErrorMessage('No valid files selected.');
      return;
    }
    
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      
      // Try to detect format from file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'csv') {
        setImportFormat('csv');
        setSeparator(',');
      } else if (extension === 'txt') {
        setImportFormat('txt');
        setSeparator('\t');
      } else if (extension === 'json') {
        setImportFormat('json');
      } else if (extension === 'apkg' || extension === 'anki') {
        setImportFormat('anki');
      }
      
      // Try to detect if file has a header for CSV
      if (extension === 'csv') {
        const firstLine = content.split('\n')[0].toLowerCase();
        if (firstLine.includes('italian') || firstLine.includes('english') ||
            firstLine.includes('term') || firstLine.includes('definition')) {
          setHasHeader(true);
        } else {
          setHasHeader(false);
        }
      }
    };
    
    reader.onerror = () => {
      setErrorMessage('Error reading file.');
    };
    
    reader.readAsText(file);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/json': ['.json'],
      'application/octet-stream': ['.anki', '.apkg']
    }
  });
  
  const handleImport = async () => {
    if (!fileContent) {
      toast({
        title: "No Content",
        description: "Please upload or paste content to import.",
        variant: "destructive"
      });
      return;
    }
    
    setImportLoading(true);
    setProgress(0);
    setErrorMessage(null);
    
    try {
      // Animate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const next = prev + (100 - prev) * 0.1;
          return Math.min(next, 95); // Cap at 95% until complete
        });
      }, 100);
      
      const options: ImportOptions = {
        format: importFormat,
        separator,
        hasHeader,
        italianColumn,
        englishColumn,
        setName: selectedSetName || undefined
      };
      
      const result = await importFlashcards(fileContent, options);
      
      clearInterval(progressInterval);
      setProgress(100);
      setImportResult(result);
      
      if (result.imported > 0) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.imported} flashcards.`
        });
      }
      
      if (result.failed > 0) {
        toast({
          title: "Some Cards Failed",
          description: `${result.failed} cards could not be imported.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      clearInterval(progress);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to import flashcards');
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'Failed to import flashcards',
        variant: "destructive"
      });
    } finally {
      setImportLoading(false);
    }
  };
  
  const handleExport = () => {
    try {
      const content = exportFlashcards(exportSetId === '' ? undefined : exportSetId, exportFormat);
      setExportContent(content);
      
      // Create download link
      const blob = new Blob([content], { type: exportFormat === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashcards.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Flashcards exported as ${exportFormat.toUpperCase()}.`
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : 'Failed to export flashcards',
        variant: "destructive"
      });
    }
  };
  
  return (
    <Tabs defaultValue="import" className="w-full">
      <TabsList className="grid grid-cols-2 w-60 mb-4">
        <TabsTrigger value="import">Import</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
      </TabsList>
      
      <TabsContent value="import" className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-lg font-medium">Drag & drop a file here</p>
              <p className="text-sm text-muted-foreground mt-1">
                Supported formats: CSV, TXT, JSON, Anki
              </p>
              <Button variant="outline" className="mt-4">
                Select File
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Format</Label>
                <Select value={importFormat} onValueChange={(value) => setImportFormat(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                    <SelectItem value="txt">TXT (Tab/Custom Separated)</SelectItem>
                    <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
                    <SelectItem value="anki">Anki Export (.txt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(importFormat === 'csv' || importFormat === 'txt') && (
                <>
                  <div className="flex flex-col space-y-2">
                    <Label>Separator</Label>
                    <RadioGroup value={separator} onValueChange={setSeparator} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="," id="separator-comma" />
                        <Label htmlFor="separator-comma">Comma (,)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="\t" id="separator-tab" />
                        <Label htmlFor="separator-tab">Tab</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value=";" id="separator-semicolon" />
                        <Label htmlFor="separator-semicolon">Semicolon (;)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {importFormat === 'csv' && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="has-header"
                        checked={hasHeader}
                        onChange={(e) => setHasHeader(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="has-header">First row is header</Label>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <Label>Italian Column</Label>
                      <Select 
                        value={italianColumn.toString()} 
                        onValueChange={(value) => setItalianColumn(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">First Column (0)</SelectItem>
                          <SelectItem value="1">Second Column (1)</SelectItem>
                          <SelectItem value="2">Third Column (2)</SelectItem>
                          <SelectItem value="3">Fourth Column (3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label>English Column</Label>
                      <Select 
                        value={englishColumn.toString()} 
                        onValueChange={(value) => setEnglishColumn(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">First Column (0)</SelectItem>
                          <SelectItem value="1">Second Column (1)</SelectItem>
                          <SelectItem value="2">Third Column (2)</SelectItem>
                          <SelectItem value="3">Fourth Column (3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex flex-col space-y-2">
                <Label>Save to Set (Optional)</Label>
                <Input 
                  placeholder="Create a new set or leave empty"
                  value={selectedSetName}
                  onChange={(e) => setSelectedSetName(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label>Preview</Label>
                <Textarea 
                  placeholder="Paste content here or upload a file"
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              {importLoading && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    {progress < 100 ? 'Processing...' : 'Complete!'}
                  </p>
                </div>
              )}
              
              {importResult && (
                <div className="space-y-2 border rounded-md p-4 bg-muted/50">
                  <div className="flex items-center space-x-2">
                    {importResult.imported > 0 ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                    <h3 className="text-lg font-medium">Import Results</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-sm font-medium">Cards Imported:</p>
                      <p className="text-2xl font-bold text-green-600">{importResult.imported}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cards Failed:</p>
                      <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                    </div>
                  </div>
                  
                  {importResult.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Errors:</p>
                      <ul className="text-sm text-red-600 ml-5 list-disc">
                        {importResult.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {importResult.errors.length > 5 && (
                          <li>...and {importResult.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleImport} 
                  disabled={!fileContent || importLoading}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Import Flashcards
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="export" className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Format</Label>
                <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                    <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label>Export From</Label>
                <Select 
                  value={exportSetId === null ? '' : exportSetId} 
                  onValueChange={setExportSetId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a set or all cards" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Flashcards</SelectItem>
                    {flashcardSets.map(set => (
                      <SelectItem key={set.id} value={set.id}>
                        {set.name} ({set.cards.length} cards)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleExport}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Flashcards
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
