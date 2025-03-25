
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useFlashcards } from '@/hooks/useFlashcards';
import { Upload, FileType, Loader2 } from 'lucide-react';

type ImportFormat = 'csv' | 'txt' | 'json' | 'anki';

interface FlashcardImporterProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const FlashcardImporter: React.FC<FlashcardImporterProps> = ({
  onSuccess,
  onCancel
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImportFormat>('csv');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  
  const { toast } = useToast();
  const { importFlashcards } = useFlashcards();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPreviewData(null);
    
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    
    // Check file type
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!fileExt) {
      setError('Unable to determine file type');
      return;
    }
    
    // Auto-detect format based on extension
    if (['csv', 'txt', 'json'].includes(fileExt)) {
      setFormat(fileExt as ImportFormat);
    } else if (fileExt === 'apkg') {
      setFormat('anki');
    } else {
      setError(`Unsupported file format: .${fileExt}. Please use CSV, TXT, JSON, or APKG files.`);
      return;
    }
    
    setFile(selectedFile);
    
    // Generate preview
    generatePreview(selectedFile, fileExt as ImportFormat);
  };
  
  const generatePreview = (file: File, format: ImportFormat) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (!content) {
          setError('Failed to read file content');
          return;
        }
        
        let previewItems = [];
        
        if (format === 'csv') {
          // Parse CSV (simple implementation)
          const lines = content.split('\n');
          if (lines.length > 0) {
            const headers = lines[0].split(',');
            
            // Take first 5 items for preview
            for (let i = 1; i < Math.min(lines.length, 6); i++) {
              const values = lines[i].split(',');
              if (values.length >= 2) {
                previewItems.push({
                  front: values[0].trim().replace(/^"|"$/g, ''),
                  back: values[1].trim().replace(/^"|"$/g, '')
                });
              }
            }
          }
        } else if (format === 'json') {
          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
              previewItems = parsed.slice(0, 5).map(item => ({
                front: item.front || item.term || item.question || '',
                back: item.back || item.definition || item.answer || ''
              }));
            }
          } catch (jsonError) {
            setError('Invalid JSON format');
            return;
          }
        } else if (format === 'txt') {
          // Assume tab or line separated
          const lines = content.split('\n');
          for (let i = 0; i < Math.min(lines.length, 5); i++) {
            const line = lines[i];
            const parts = line.includes('\t') ? line.split('\t') : [line, ''];
            if (parts.length >= 1) {
              previewItems.push({
                front: parts[0].trim(),
                back: parts.length > 1 ? parts[1].trim() : ''
              });
            }
          }
        } else if (format === 'anki') {
          setError('Anki import preview is not available. Please import the file to see the flashcards.');
          return;
        }
        
        setPreviewData(previewItems);
      } catch (error) {
        console.error('Error generating preview:', error);
        setError('Failed to parse file');
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
    };
    
    if (format === 'anki') {
      // Anki files are binary and need special handling
      setError('Preview not available for Anki files');
    } else {
      reader.readAsText(file);
    }
  };
  
  const handleImport = async () => {
    if (!file) {
      setError('Please select a file to import');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Read file content
      const content = await readFileContent(file);
      
      // Import flashcards
      const importedCount = await importFlashcards(content, format);
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${importedCount} flashcards.`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Failed to import flashcards');
      
      toast({
        title: "Import Failed",
        description: err instanceof Error ? err.message : 'Failed to import flashcards',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          resolve(content);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Flashcards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="file">Select File</Label>
          <Input
            id="file"
            type="file"
            accept=".csv,.txt,.json,.apkg"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Supported formats: CSV, TXT, JSON, Anki (.apkg)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="format">File Format</Label>
          <Select
            value={format}
            onValueChange={(value) => setFormat(value as ImportFormat)}
            disabled={isLoading}
          >
            <SelectTrigger id="format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV (front,back)</SelectItem>
              <SelectItem value="txt">Text (tab or line separated)</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="anki">Anki (.apkg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {previewData && previewData.length > 0 && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="rounded-md border p-2 text-sm max-h-40 overflow-y-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left font-medium text-muted-foreground">Front</th>
                    <th className="text-left font-medium text-muted-foreground">Back</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                      <td className="py-1 px-2">{item.front}</td>
                      <td className="py-1 px-2">{item.back}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleImport} disabled={!file || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Import Flashcards
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlashcardImporter;
