
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  CpuIcon, ServerIcon, GlobeIcon, CheckCircleIcon, 
  ClockIcon, UserIcon, BrainCircuitIcon, FileCodeIcon 
} from 'lucide-react';

const AIImplementationTimeline: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Implementation Timeline</CardTitle>
        <CardDescription>
          Phases of AI implementation and future roadmap
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="mb-4">
            <TabsTrigger value="complete">Completed</TabsTrigger>
            <TabsTrigger value="current">Current Phase</TabsTrigger>
            <TabsTrigger value="future">Future Roadmap</TabsTrigger>
          </TabsList>
          
          <TabsContent value="complete" className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold">Phase 1: Client-Side Foundational Models</h3>
                <Badge className="ml-2 bg-green-100 text-green-800">Completed</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Integration of small, efficient models that run entirely in the browser:
              </p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start text-sm">
                  <CpuIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <span className="font-medium">MixedBread Embeddings (50MB)</span>
                    <p className="text-muted-foreground">Semantic similarity for matching text</p>
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <GlobeIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <span className="font-medium">Opus MT Translation (85MB)</span>
                    <p className="text-muted-foreground">Bidirectional Italian/English translation</p>
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <UserIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <span className="font-medium">Whisper Tiny (75MB)</span>
                    <p className="text-muted-foreground">Speech recognition for pronunciation practice</p>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="current" className="space-y-4">
            <div className="rounded-lg border p-4 bg-blue-50">
              <div className="flex items-center">
                <BrainCircuitIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold">Phase 2: Enhanced Learning Features</h3>
                <Badge className="ml-2 bg-blue-100 text-blue-800">In Progress</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Extending AI capabilities with personalized learning:
              </p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start text-sm">
                  <FileCodeIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <span className="font-medium">Custom flashcard generation</span>
                    <p className="text-muted-foreground">Creating personalized flashcards based on user's level</p>
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <ServerIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <span className="font-medium">Personalized pronunciation feedback</span>
                    <p className="text-muted-foreground">AI-powered feedback on pronunciation accuracy</p>
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <ClockIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <span className="font-medium">Adaptive learning path</span>
                    <p className="text-muted-foreground">Adjusts difficulty based on performance</p>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="future" className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center">
                <BrainCircuitIcon className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold">Phase 3: Advanced AI Integration</h3>
                <Badge className="ml-2 bg-purple-100 text-purple-800">Planned</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Future AI features on our roadmap:
              </p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start text-sm">
                  <ServerIcon className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
                  <div>
                    <span className="font-medium">Conversational practice partner</span>
                    <p className="text-muted-foreground">AI conversation partner for Italian practice</p>
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <CpuIcon className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
                  <div>
                    <span className="font-medium">Writing correction and feedback</span>
                    <p className="text-muted-foreground">Grammar and style improvements for written Italian</p>
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <UserIcon className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
                  <div>
                    <span className="font-medium">Cultural context assistant</span>
                    <p className="text-muted-foreground">Providing cultural context for language learning</p>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIImplementationTimeline;
