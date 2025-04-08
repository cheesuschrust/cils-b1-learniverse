
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cpu, AlertCircle } from 'lucide-react';

export const AIModelSelector: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('italian-cils-b2-v2');
  
  const models = [
    { id: 'italian-cils-b2-v1', name: 'CILS B2 Model v1.0', status: 'stable' },
    { id: 'italian-cils-b2-v2', name: 'CILS B2 Model v2.0', status: 'active' },
    { id: 'italian-cils-b2-v3-dev', name: 'CILS B2 Model v3.0-dev', status: 'experimental' }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Active AI Model</CardTitle>
        <CardDescription>
          Select the AI model version to use
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <Cpu className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm font-medium">Current: {models.find(m => m.id === selectedModel)?.name}</span>
          </div>
          
          <Select 
            value={selectedModel} 
            onValueChange={setSelectedModel}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                  {model.status === 'experimental' && (
                    <span className="ml-2 text-xs text-amber-500">(Experimental)</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedModel === 'italian-cils-b2-v3-dev' && (
            <div className="flex items-start mt-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-md text-xs">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 dark:text-amber-400">
                This is an experimental model. Performance may be inconsistent and is not recommended for production use.
              </p>
            </div>
          )}
          
          <Button className="w-full mt-2" size="sm">
            Apply Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
