
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ModelUsageCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Usage</CardTitle>
        <CardDescription>
          AI models being used in the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <div>
              <div className="font-medium">MixedBread AI Embeddings</div>
              <div className="text-sm text-muted-foreground">Feature extraction</div>
            </div>
            <Badge variant="outline">Active</Badge>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <div>
              <div className="font-medium">Whisper Tiny</div>
              <div className="text-sm text-muted-foreground">Speech recognition</div>
            </div>
            <Badge variant="outline">Active</Badge>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <div>
              <div className="font-medium">Opus MT En-It</div>
              <div className="text-sm text-muted-foreground">Translation</div>
            </div>
            <Badge variant="outline">Active</Badge>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <div>
              <div className="font-medium">DistilBERT Base</div>
              <div className="text-sm text-muted-foreground">Text classification</div>
            </div>
            <Badge variant="outline">Active</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
