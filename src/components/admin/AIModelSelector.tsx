
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';

// This is a placeholder component
export const AIModelSelector: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('grammar-analyzer-v1.2.4');
  
  const models = [
    {
      id: 'grammar-analyzer-v1.2.4',
      name: 'Italian Grammar Analyzer',
      version: 'v1.2.4',
      type: 'Text Classification',
      size: '45 MB',
      accuracy: 0.873,
      isProduction: true
    },
    {
      id: 'citizenship-qa-v1.0.1',
      name: 'Citizenship Q&A',
      version: 'v1.0.1',
      type: 'Question Answering',
      size: '78 MB',
      accuracy: 0.812,
      isProduction: true
    },
    {
      id: 'speech-recognizer-v2.0.0',
      name: 'Italian Speech Recognizer',
      version: 'v2.0.0',
      type: 'Speech Recognition',
      size: '120 MB',
      accuracy: 0.792,
      isProduction: false
    },
    {
      id: 'text-translator-v1.3.5',
      name: 'Italian-English Translator',
      version: 'v1.3.5',
      type: 'Translation',
      size: '95 MB',
      accuracy: 0.915,
      isProduction: true
    }
  ];
  
  return (
    <div className="space-y-4">
      <RadioGroup value={selectedModel} onValueChange={setSelectedModel}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((model) => (
            <Card key={model.id} className={`relative overflow-hidden ${
              selectedModel === model.id ? 'ring-2 ring-primary' : ''
            }`}>
              <CardContent className="pt-4">
                <RadioGroupItem
                  value={model.id}
                  id={model.id}
                  className="absolute top-4 right-4"
                />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={model.id} className="font-medium">
                      {model.name}
                    </Label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{model.version}</Badge>
                    {model.isProduction && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Production
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="text-muted-foreground">Type:</div>
                    <div className="font-medium">{model.type}</div>
                    <div className="text-muted-foreground">Size:</div>
                    <div className="font-medium">{model.size}</div>
                    <div className="text-muted-foreground">Accuracy:</div>
                    <div className="font-medium">{model.accuracy * 100}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline">View Details</Button>
        <Button>Select Model</Button>
      </div>
    </div>
  );
};
