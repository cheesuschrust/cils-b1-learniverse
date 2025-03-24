
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Database, Brain } from 'lucide-react';

const AITrainingManagerWrapper = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Training Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="datasets">
          <TabsList className="mb-4">
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="finetuning">Fine-tuning</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
          </TabsList>
          
          <TabsContent value="datasets" className="space-y-4">
            <div className="text-center p-6 border-2 border-dashed rounded-md">
              <Database className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Training Datasets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload datasets to improve the AI model for your specific needs
              </p>
              <Button className="flex mx-auto">
                <Upload className="h-4 w-4 mr-2" />
                Upload Dataset
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="finetuning">
            <div className="text-center p-6">
              <Brain className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Fine-tuning Not Available</h3>
              <p className="text-sm text-muted-foreground">
                Fine-tuning capabilities will be available in a future update
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="models">
            <div className="text-center p-6">
              <Database className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Custom Models</h3>
              <p className="text-sm text-muted-foreground">
                Custom models will appear here after fine-tuning
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AITrainingManagerWrapper;
