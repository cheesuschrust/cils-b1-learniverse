
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { isFeatureEnabled } from '@/utils/featureFlags';

const SupportChat: React.FC = () => {
  const aiAssistantEnabled = isFeatureEnabled('aiAssistant');
  
  if (!aiAssistantEnabled) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Support Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-muted-foreground mb-2">
              AI-powered support chat is temporarily unavailable.
            </p>
            <p className="text-sm">
              Please check back later or contact support via email at support@example.com
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Only import and render the EnhancedChatbot if the feature is enabled
  // This helps prevent build issues related to the AI components
  const EnhancedChatbot = React.lazy(() => import('@/components/chatbot/EnhancedChatbot'));
  
  return (
    <React.Suspense fallback={<div>Loading support chat...</div>}>
      <EnhancedChatbot />
    </React.Suspense>
  );
};

export default SupportChat;
