
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, GitFork, Network, Layers, PuzzlePiece, Zap, Share2, Download, Info } from 'lucide-react';

const AIArchitectureExplainer: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <BrainCircuit className="mr-2 h-6 w-6 text-primary" />
                AI Architecture Overview
              </CardTitle>
              <CardDescription className="max-w-3xl">
                The CILS Italian language learning system leverages multiple AI models working 
                together to provide personalized learning experiences, generate practice materials, 
                and assess learner progress.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="mr-1 h-4 w-4" />
                Documentation
              </Button>
              <Button size="sm" className="flex items-center">
                <GitFork className="mr-1 h-4 w-4" />
                Explore Models
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-6 rounded-lg mb-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-2">
              <Badge variant="outline" className="bg-background">System Architecture</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Interaction Layer */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">User Interaction Layer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background p-2 rounded border flex items-center space-x-2">
                    <Share2 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Chat Interface</span>
                  </div>
                  <div className="bg-background p-2 rounded border flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Speech Recognition</span>
                  </div>
                  <div className="bg-background p-2 rounded border flex items-center space-x-2">
                    <Info className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Learning Dashboard</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Processing Layer */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">AI Processing Layer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background p-2 rounded border flex items-center space-x-2">
                    <Network className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Request Router</span>
                  </div>
                  <div className="bg-background p-2 rounded border flex items-center space-x-2">
                    <PuzzlePiece className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Model Selector</span>
                  </div>
                  <div className="bg-background p-2 rounded border flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Response Generator</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Model Layer */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Model Layer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background p-2 rounded border flex items-center space-x-2">
                    <BrainCircuit className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Language Models</span>
                  </div>
                  <div className="bg-background p-2 rounded border flex items-center space-x-2">
                    <BrainCircuit className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Speech Models</span>
                  </div>
                  <div className="bg-background p-2 rounded border flex items-center space-x-2">
                    <BrainCircuit className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Assessment Models</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-3">Core AI Systems</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <BrainCircuit className="mr-2 h-4 w-4 text-blue-500" />
                  Italian Language Assistant
                </CardTitle>
                <CardDescription>Question answering, translation, grammar help</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">HuggingFace</Badge>
                  <p className="text-sm text-muted-foreground">
                    Fine-tuned on Italian educational content with emphasis on CILS exam preparation.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Confidence:</span> 92%
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <BrainCircuit className="mr-2 h-4 w-4 text-green-500" />
                  Question Generator
                </CardTitle>
                <CardDescription>Personalized practice material creation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Local Model</Badge>
                  <p className="text-sm text-muted-foreground">
                    Creates realistic CILS-style questions and exercises tailored to student level.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Confidence:</span> 87%
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <BrainCircuit className="mr-2 h-4 w-4 text-amber-500" />
                  Speech Recognition
                </CardTitle>
                <CardDescription>Italian speech processing and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">HuggingFace</Badge>
                  <p className="text-sm text-muted-foreground">
                    Transcribes and evaluates spoken Italian with accent detection and feedback.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Confidence:</span> 85%
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <BrainCircuit className="mr-2 h-4 w-4 text-purple-500" />
                  Progress Analyzer
                </CardTitle>
                <CardDescription>Learning progress tracking and suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20">Local Model</Badge>
                  <p className="text-sm text-muted-foreground">
                    Tracks user progress and suggests optimal learning paths for CILS preparation.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Confidence:</span> 89%
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <BrainCircuit className="mr-2 h-4 w-4 text-red-500" />
                  Cultural Context Engine
                </CardTitle>
                <CardDescription>Italian cultural and contextual knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Local Model</Badge>
                  <p className="text-sm text-muted-foreground">
                    Provides cultural context and relevant examples for language learning.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Confidence:</span> 91%
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <BrainCircuit className="mr-2 h-4 w-4 text-indigo-500" />
                  Writing Evaluator
                </CardTitle>
                <CardDescription>Written Italian assessment and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-indigo-500/20">HuggingFace</Badge>
                  <p className="text-sm text-muted-foreground">
                    Evaluates written Italian with detailed feedback on grammar, vocabulary, and style.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Confidence:</span> 86%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
            <h3 className="text-base font-semibold mb-2 text-blue-700 dark:text-blue-300">System Integration</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              All AI models work together through a centralized orchestration layer that routes 
              user queries to the appropriate model based on context, learning goals, and user preferences.
              Models continually improve through federated learning on anonymized user data, with 
              regular performance evaluations to ensure accuracy and relevance to the CILS Italian citizenship exam.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIArchitectureExplainer;
