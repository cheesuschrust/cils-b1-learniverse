
import React, { useState, useCallback, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { ImportFormat, Flashcard } from '@/types/interface-fixes';
import { useFlashcardImporter } from '@/hooks/useFlashcardImporter';
import { Upload, FileUp, AlertCircle } from 'lucide-react';

interface FlashcardImporterProps {
  onImportComplete?: (flashcards: Partial<Flashcard>[]) => void;
  onCancel?: () => void;
}

const FlashcardImporter: React.FC<FlashcardImporterProps> = ({
  onImportComplete,
  onCancel
}) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState<'format' | 'mapping' | 'preview'>('format');
  const [previewData, setPreviewData] = useState<Partial<Flashcard>[]>([]);
  
  // Use the custom hook
  const {
    importFromFile,
    updateImportFormat,
    importFormat,
    isImporting,
    error
  } = useFlashcardImporter({
    onImportComplete: (flashcards) => {
      setPreviewData(flashcards);
      toast({
        title: "Import Successful",
        description: `${flashcards.length} flashcards have been imported.`,
      });
      if (onImportComplete) {
        onImportComplete(flashcards);
      }
    },
    onError: (err) => {
      toast({
        title: "Import Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Auto-detect format from file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'csv') {
        updateImportFormat({ type: 'csv' });
      } else if (extension === 'json') {
        updateImportFormat({ type: 'json' });
      } else if (extension === 'xlsx' || extension === 'xls') {
        updateImportFormat({ type: 'excel' });
      } else if (extension === 'txt') {
        // Could be Anki or Quizlet, let user decide
      }
    }
  };
  
  // Update format type
  const handleFormatTypeChange = (value: string) => {
    updateImportFormat({ 
      type: value as 'csv' | 'json' | 'anki' | 'quizlet' | 'excel' 
    });
  };
  
  // Update field mapping
  const handleFieldMapChange = (field: string, value: string) => {
    updateImportFormat({
      fieldMap: {
        ...importFormat.fieldMap,
        [field]: value
      }
    });
  };
  
  // Toggle headers
  const handleHeaderToggle = (checked: boolean) => {
    updateImportFormat({ hasHeaders: checked });
  };
  
  // Update delimiter
  const handleDelimiterChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateImportFormat({ delimiter: e.target.value });
  };
  
  // Start import process
  const handleImport = useCallback(async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to import.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await importFromFile(selectedFile);
      setStep('preview');
    } catch (err) {
      // Error is already handled by the hook
    }
  }, [selectedFile, importFromFile, toast]);
  
  // Finish import and call completion handler
  const handleFinish = useCallback(() => {
    if (previewData.length > 0 && onImportComplete) {
      onImportComplete(previewData);
    }
  }, [previewData, onImportComplete]);
  
  // Render format selection step
  const renderFormatStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>File Format</Label>
        <Select value={importFormat.type} onValueChange={handleFormatTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select file format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">CSV File</SelectItem>
            <SelectItem value="json">JSON File</SelectItem>
            <SelectItem value="anki">Anki Deck</SelectItem>
            <SelectItem value="quizlet">Quizlet Export</SelectItem>
            <SelectItem value="excel">Excel Spreadsheet</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Upload File</Label>
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          {selectedFile ? (
            <div className="space-y-2">
              <FileUp className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                Change File
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your file here, or click to select
              </p>
              <Button variant="outline" size="sm" asChild>
                <label>
                  <Input
                    type="file"
                    accept=".csv,.json,.txt,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  Select File
                </label>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Format-specific options */}
      {importFormat.type === 'csv' && (
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="delimiter">Delimiter</Label>
            <Input
              id="delimiter"
              value={importFormat.delimiter || ','}
              onChange={handleDelimiterChange}
              placeholder="Delimiter character"
              className="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasHeader"
              checked={importFormat.hasHeaders}
              onCheckedChange={handleHeaderToggle}
            />
            <Label htmlFor="hasHeader">File has header row</Label>
          </div>
        </div>
      )}
      
      <CardFooter className="flex justify-between px-0">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => setStep('mapping')}
          disabled={!selectedFile}
        >
          Next
        </Button>
      </CardFooter>
    </div>
  );
  
  // Render field mapping step
  const renderMappingStep = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Map the fields from your import file to the flashcard properties.
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="italian-field">Italian Field</Label>
          <Input
            id="italian-field"
            value={importFormat.fieldMap.italian}
            onChange={(e) => handleFieldMapChange('italian', e.target.value)}
            placeholder="Column name for Italian text"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="english-field">English Field</Label>
          <Input
            id="english-field"
            value={importFormat.fieldMap.english}
            onChange={(e) => handleFieldMapChange('english', e.target.value)}
            placeholder="Column name for English text"
            className="w-full"
          />
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label htmlFor="tags-field">Tags Field (Optional)</Label>
          <Input
            id="tags-field"
            value={importFormat.fieldMap.tags || ''}
            onChange={(e) => handleFieldMapChange('tags', e.target.value)}
            placeholder="Column name for tags"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="level-field">Level Field (Optional)</Label>
          <Input
            id="level-field"
            value={importFormat.fieldMap.level || ''}
            onChange={(e) => handleFieldMapChange('level', e.target.value)}
            placeholder="Column name for level"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mastered-field">Mastered Field (Optional)</Label>
          <Input
            id="mastered-field"
            value={importFormat.fieldMap.mastered || ''}
            onChange={(e) => handleFieldMapChange('mastered', e.target.value)}
            placeholder="Column name for mastered status"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="examples-field">Examples Field (Optional)</Label>
          <Input
            id="examples-field"
            value={importFormat.fieldMap.examples || ''}
            onChange={(e) => handleFieldMapChange('examples', e.target.value)}
            placeholder="Column name for examples"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="explanation-field">Explanation Field (Optional)</Label>
          <Input
            id="explanation-field"
            value={importFormat.fieldMap.explanation || ''}
            onChange={(e) => handleFieldMapChange('explanation', e.target.value)}
            placeholder="Column name for explanation"
            className="w-full"
          />
        </div>
      </div>
      
      <CardFooter className="flex justify-between px-0">
        <Button variant="outline" onClick={() => setStep('format')}>
          Back
        </Button>
        <Button onClick={handleImport} disabled={isImporting}>
          {isImporting ? 'Importing...' : 'Import'}
        </Button>
      </CardFooter>
    </div>
  );
  
  // Render preview step
  const renderPreviewStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Import Preview</h3>
          <p className="text-sm text-muted-foreground">
            {previewData.length} flashcards imported successfully.
          </p>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto border rounded-md">
        {previewData.length > 0 ? (
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Italian</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">English</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {previewData.map((card, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                  <td className="px-4 py-2 text-sm">{card.italian}</td>
                  <td className="px-4 py-2 text-sm">{card.english}</td>
                  <td className="px-4 py-2 text-sm">{Array.isArray(card.tags) ? card.tags.join(', ') : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No data to preview.</p>
          </div>
        )}
      </div>
      
      <CardFooter className="flex justify-between px-0">
        <Button variant="outline" onClick={() => setStep('mapping')}>
          Back
        </Button>
        <Button onClick={handleFinish}>
          Finish
        </Button>
      </CardFooter>
    </div>
  );
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Import Flashcards</CardTitle>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="rounded-md bg-destructive/10 p-4 mb-4 text-destructive text-sm flex items-start">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>{error.message}</div>
          </div>
        )}
        
        {step === 'format' && renderFormatStep()}
        {step === 'mapping' && renderMappingStep()}
        {step === 'preview' && renderPreviewStep()}
      </CardContent>
    </Card>
  );
};

export default FlashcardImporter;
