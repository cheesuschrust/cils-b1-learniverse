
import React from 'react';
import { PageTitle } from '@/components/ui/page-title';
import { Separator } from '@/components/ui/separator';
import VoiceIntegrationSettings from '@/components/admin/VoiceIntegrationSettings';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const VoiceSystemAdminPage: React.FC = () => {
  return (
    <DashboardShell>
      <PageTitle
        heading="Voice System Administration"
        subheading="Configure and manage the text-to-speech and speech recognition system"
      />
      
      <Alert className="my-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Configuration Required</AlertTitle>
        <AlertDescription>
          For premium voice capabilities, set up API keys for ElevenLabs or OpenAI. 
          Browser speech synthesis is available without additional configuration.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>
              The voice system provides text-to-speech and speech recognition capabilities
              for both Italian and English content throughout the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The system supports multiple voice providers:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
              <li><strong>Browser voices</strong> - Free built-in voices available in modern browsers</li>
              <li><strong>ElevenLabs</strong> - Premium high-quality voices with natural intonation</li>
              <li><strong>OpenAI</strong> - Premium voices with multilingual capabilities</li>
            </ul>
            
            <Separator className="my-4" />
            
            <p className="text-sm text-muted-foreground">
              Key features include:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
              <li>Text-to-speech for pronunciation examples and language learning</li>
              <li>Speech recognition for pronunciation practice</li>
              <li>Separate voice settings for Italian and English</li>
              <li>Usage analytics and monitoring</li>
              <li>Fallback mechanisms between providers</li>
            </ul>
          </CardContent>
        </Card>
        
        <VoiceIntegrationSettings />
      </div>
    </DashboardShell>
  );
};

export default VoiceSystemAdminPage;
