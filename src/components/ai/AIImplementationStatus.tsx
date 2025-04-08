
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIModelImplementation {
  id: string;
  name: string;
  type: 'huggingface' | 'qwen' | 'openai' | 'other';
  pages: string[];
  features: string[];
  downloadRequired: boolean;
  clientSide: boolean;
  serverSide: boolean;
  continuousLearning: boolean;
  inference: boolean;
  status: 'implemented' | 'in-progress' | 'planned';
  sizeInMB: number;
  description: string;
}

const aiModels: AIModelImplementation[] = [
  {
    id: 'mxbai-embed-xsmall',
    name: 'MixedBread AI Embeddings (XSmall)',
    type: 'huggingface',
    pages: ['Flashcards', 'Speaking Practice', 'Writing Assessment'],
    features: ['Text Embeddings', 'Semantic Similarity', 'Content Analysis'],
    downloadRequired: true,
    clientSide: true,
    serverSide: false,
    continuousLearning: false,
    inference: true,
    status: 'implemented',
    sizeInMB: 50,
    description: 'Small text embedding model used for comparing text similarity and semantic analysis. Downloaded and cached in the browser.'
  },
  {
    id: 'whisper-tiny',
    name: 'Whisper (Tiny)',
    type: 'huggingface',
    pages: ['Speaking Practice', 'Pronunciation Assessment', 'Voice Recording'],
    features: ['Speech Recognition', 'Audio Transcription'],
    downloadRequired: true,
    clientSide: true,
    serverSide: false,
    continuousLearning: false,
    inference: true,
    status: 'implemented',
    sizeInMB: 75,
    description: 'Automatic speech recognition model used for transcribing user speech into text. Downloaded and cached in the browser.'
  },
  {
    id: 'opus-mt-en-it',
    name: 'Opus MT English-Italian',
    type: 'huggingface',
    pages: ['Translation Tool', 'Content Generator', 'Flashcards'],
    features: ['Translation (EN to IT)', 'Content Generation'],
    downloadRequired: true,
    clientSide: true,
    serverSide: false,
    continuousLearning: false,
    inference: true,
    status: 'implemented',
    sizeInMB: 85,
    description: 'Translation model specialized in English to Italian translation. Downloaded and cached in the browser.'
  },
  {
    id: 'opus-mt-it-en',
    name: 'Opus MT Italian-English',
    type: 'huggingface',
    pages: ['Translation Tool', 'Content Generator', 'Exercise Generator'],
    features: ['Translation (IT to EN)', 'Content Analysis'],
    downloadRequired: true,
    clientSide: true,
    serverSide: false,
    continuousLearning: false,
    inference: true,
    status: 'implemented',
    sizeInMB: 85,
    description: 'Translation model specialized in Italian to English translation. Downloaded and cached in the browser.'
  },
  {
    id: 'distilbert-base',
    name: 'DistilBERT Base Uncased',
    type: 'huggingface',
    pages: ['Content Classification', 'Grammar Analysis', 'Writing Assessment'],
    features: ['Text Classification', 'Sentiment Analysis', 'Topic Classification'],
    downloadRequired: true,
    clientSide: true,
    serverSide: false,
    continuousLearning: false,
    inference: true,
    status: 'implemented',
    sizeInMB: 260,
    description: 'Text classification model used for analyzing content, identifying grammar patterns and assessing writing. Downloaded and cached in the browser.'
  },
  {
    id: 'qwen-7b-chat',
    name: 'Qwen 7B Chat',
    type: 'qwen',
    pages: ['AI Assistant', 'Content Generation', 'Question Generation'],
    features: ['Text Generation', 'Question Answering', 'Conversation'],
    downloadRequired: false,
    clientSide: false,
    serverSide: true,
    continuousLearning: false,
    inference: true,
    status: 'in-progress',
    sizeInMB: 14000,
    description: 'Server-side language model used for generating conversations, content, and questions. Hosted on serverless edge functions.'
  },
  {
    id: 'italian-finetuned-llm',
    name: 'Italian-finetuned LLM',
    type: 'other',
    pages: ['Italian Conversation', 'Cultural Content', 'Citizenship Test Prep'],
    features: ['Italian Conversation', 'Cultural Content', 'Test Generation'],
    downloadRequired: false,
    clientSide: false,
    serverSide: true,
    continuousLearning: true,
    inference: true,
    status: 'planned',
    sizeInMB: 7000,
    description: 'Specialized language model fine-tuned for Italian language learning and citizenship test preparation. Hosted on cloud infrastructure with continuous learning.'
  }
];

const AIImplementationStatus: React.FC = () => {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>AI Models Implementation</CardTitle>
        <CardDescription>
          Overview of AI models used in the application, their features, and implementation status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Client/Server</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aiModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{model.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{model.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      model.type === 'huggingface' ? 'outline' : 
                      model.type === 'qwen' ? 'secondary' : 
                      model.type === 'openai' ? 'destructive' : 'default'
                    }>
                      {model.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {model.pages.map((page) => (
                        <Badge key={page} variant="outline" className="text-xs">
                          {page}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {model.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {model.clientSide ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Client {model.downloadRequired ? '(Downloaded)' : '(API)'}
                        </Badge>
                      ) : null}
                      {model.serverSide ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Server
                        </Badge>
                      ) : null}
                      {model.continuousLearning ? (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          Learning
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Inference Only
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {model.sizeInMB >= 1000 ? `${(model.sizeInMB / 1000).toFixed(1)} GB` : `${model.sizeInMB} MB`}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      model.status === 'implemented' ? 'success' : 
                      model.status === 'in-progress' ? 'warning' : 'outline'
                    }>
                      {model.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AIImplementationStatus;
