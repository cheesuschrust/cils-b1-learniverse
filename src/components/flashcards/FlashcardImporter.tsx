
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useFlashcardImporter, ImportOptions } from '@/hooks/useFlashcardImporter';
import { Upload, FileText, Database, Check, AlertTriangle, FileX, Table } from 'lucide-react';
import { ImportFormat } from '@/types/interface-fixes';

interface FlashcardImporterProps {
  onImportComplete?: (result: any) => void;
  onCancel?: () => void;
}

const FlashcardImporter: React.FC<FlashcardImporterProps> = ({ 
  onImportComplete, 
  onCancel 
}) => {
  const [activeTab, setActiveTab] = useState<string>('csv');
  const [csvContent, setCsvContent] = useState<string>('');
  const [jsonContent, setJsonContent] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    italianColumn: 'italian',
    englishColumn: 'english',
    tagsColumn: 'tags'
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  const { handleImport, loading, error, importResult } = useFlashcardImporter();
  const { toast } = useToast();
  
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadError(null);
    setFileName(file.name);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (file.name.endsWith('.csv')) {
        setCsvContent(content);
        setActiveTab('csv');
      } else if (file.name.endsWith('.json')) {
        setJsonContent(content);
        setActiveTab('json');
      } else {
        setUploadError('Unsupported file format. Please upload a CSV or JSON file.');
      }
      
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      setUploadError('Error reading file');
      setIsUploading(false);
    };
    
    reader.readAsText(file);
  }, []);
  
  const handleImportClick = async () => {
    try {
      let content = '';
      let format: ImportFormat = 'csv';
      
      if (activeTab === 'csv') {
        content = csvContent;
        format = 'csv';
      } else if (activeTab === 'json') {
        content = jsonContent;
        format = 'json';
      } else if (activeTab === 'anki') {
        format = 'anki';
      } else if (activeTab === 'quizlet') {
        format = 'quizlet';
      }
      
      if (!content && (format === 'csv' || format === 'json')) {
        setUploadError('Please provide content to import');
        return;
      }
      
      const result = await handleImport(content, {
        ...importOptions,
        format
      });
      
      toast({
        title: 'Import Complete',
        description: `Successfully imported ${result.imported} flashcards.`,
      });
      
      if (onImportComplete) {
        onImportComplete(result);
      }
    } catch (err) {
      toast({
        title: 'Import Failed',
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Import Flashcards</CardTitle>
        <CardDescription>
          Import flashcards from various formats including CSV, JSON, Anki, and Quizlet
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="csv">CSV</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="anki">Anki</TabsTrigger>
            <TabsTrigger value="quizlet">Quizlet</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activeTab === 'csv' && 'CSV (.csv)'}
                    {activeTab === 'json' && 'JSON (.json)'}
                    {activeTab === 'anki' && 'Anki (.apkg)'}
                    {activeTab === 'quizlet' && 'Quizlet (.txt)'}
                  </p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept={
                    activeTab === 'csv' ? '.csv' : 
                    activeTab === 'json' ? '.json' : 
                    activeTab === 'anki' ? '.apkg' : 
                    '.txt'
                  }
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            
            {fileName && (
              <div className="flex items-center p-2 bg-muted/30 rounded">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{fileName}</span>
              </div>
            )}
            
            {uploadError && (
              <div className="flex items-center p-2 bg-destructive/10 text-destructive rounded">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="text-sm">{uploadError}</span>
              </div>
            )}
            
            <TabsContent value="csv" className="m-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="italianColumn">Italian Column</Label>
                    <Input
                      id="italianColumn"
                      placeholder="italian"
                      value={importOptions.italianColumn}
                      onChange={(e) => setImportOptions({ ...importOptions, italianColumn: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="englishColumn">English Column</Label>
                    <Input
                      id="englishColumn"
                      placeholder="english"
                      value={importOptions.englishColumn}
                      onChange={(e) => setImportOptions({ ...importOptions, englishColumn: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tagsColumn">Tags Column (Optional)</Label>
                    <Input
                      id="tagsColumn"
                      placeholder="tags"
                      value={importOptions.tagsColumn}
                      onChange={(e) => setImportOptions({ ...importOptions, tagsColumn: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="csvContent">CSV Content</Label>
                  <Textarea
                    id="csvContent"
                    placeholder="Paste your CSV content here (including headers)"
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Example format: italian,english,tags
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="m-0">
              <div className="space-y-2">
                <Label htmlFor="jsonContent">JSON Content</Label>
                <Textarea
                  id="jsonContent"
                  placeholder='Paste your JSON content here (format: [{"italian": "casa", "english": "house", "tags": ["basics"]}])'
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Must be an array of objects with at least "italian" and "english" properties
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="anki" className="m-0">
              <div className="p-8 text-center">
                <Database className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Anki Import</h3>
                <p className="text-muted-foreground mb-4">
                  Upload an Anki package (.apkg) file to import flashcards
                </p>
                <p className="text-xs text-muted-foreground">
                  Note: This feature is still in development
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="quizlet" className="m-0">
              <div className="p-8 text-center">
                <Table className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Quizlet Import</h3>
                <p className="text-muted-foreground mb-4">
                  Upload a text file exported from Quizlet to import flashcards
                </p>
                <p className="text-xs text-muted-foreground">
                  Note: This feature is still in development
                </p>
              </div>
            </TabsContent>
          </div>
        </CardContent>
      </Tabs>
      
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        
        <Button onClick={handleImportClick} disabled={loading}>
          {loading ? (
            <>Loading...</>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Import Flashcards
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlashcardImporter;
