
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AITrainingManager from './AITrainingManager';
import { useAI } from '@/hooks/useAI';
import { Badge } from '@/components/ui/badge';
import { Brain, Database, ArrowUpCircle } from 'lucide-react';

// This component wraps the AITrainingManager with additional UI elements and functionality
const AITrainingManagerWrapper = () => {
  const [activeTab, setActiveTab] = useState('examples');
  const { status, isModelLoaded } = useAI();
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Training Dashboard
              </CardTitle>
              <CardDescription>
                Manage training examples and fine-tune AI models for better content analysis
              </CardDescription>
            </div>
            <Badge variant={isModelLoaded ? "default" : "outline"} className="capitalize">
              {isModelLoaded ? "AI Active" : "AI Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="examples" className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Training Examples
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center">
                <ArrowUpCircle className="h-4 w-4 mr-2" />
                Upload Training Data
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="examples">
              <AITrainingManager />
            </TabsContent>
            
            <TabsContent value="upload">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p>Bulk training data upload functionality will be available soon.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This feature will allow administrators to upload CSV files with training examples for various content types.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default AITrainingManagerWrapper;
