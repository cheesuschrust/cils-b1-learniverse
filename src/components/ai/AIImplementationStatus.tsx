
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Check, Clock, Cpu, Server, Shield } from 'lucide-react';

const AIImplementationStatus: React.FC = () => {
  // Implementation phases and their status
  const phases = [
    { 
      name: 'Client-Side AI', 
      progress: 95, 
      status: 'completed', 
      icon: <Cpu className="h-5 w-5 text-blue-500" />,
      features: [
        { name: 'Embedding Models', completed: true },
        { name: 'Translation Engine', completed: true },
        { name: 'Speech Recognition', completed: true },
        { name: 'Progressive Loading', completed: true },
        { name: 'Offline Functionality', completed: false },
      ]
    },
    { 
      name: 'Server Integration', 
      progress: 75, 
      status: 'in-progress', 
      icon: <Server className="h-5 w-5 text-purple-500" />,
      features: [
        { name: 'Model Orchestration', completed: true },
        { name: 'Backup Processing', completed: true },
        { name: 'Content Generation', completed: false },
        { name: 'API Gateway', completed: true },
        { name: 'Advanced NLP', completed: false },
      ]
    },
    { 
      name: 'User Experience', 
      progress: 60, 
      status: 'in-progress', 
      icon: <BrainCircuit className="h-5 w-5 text-green-500" />,
      features: [
        { name: 'Voice Interaction', completed: true },
        { name: 'Smart Feedback', completed: false },
        { name: 'Adaptive Learning', completed: true },
        { name: 'Personalization', completed: false },
        { name: 'Accessibility', completed: true },
      ]
    },
    { 
      name: 'Privacy & Security', 
      progress: 85, 
      status: 'in-progress', 
      icon: <Shield className="h-5 w-5 text-red-500" />,
      features: [
        { name: 'Local Processing', completed: true },
        { name: 'Data Minimization', completed: true },
        { name: 'Encryption', completed: true },
        { name: 'User Controls', completed: true },
        { name: 'Compliance Audit', completed: false },
      ]
    },
  ];

  // Calculate overall implementation progress
  const overallProgress = phases.reduce((sum, phase) => sum + phase.progress, 0) / phases.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
              AI Implementation Status
            </CardTitle>
            <CardDescription>
              Current progress of AI features implementation
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto">
            {Math.round(overallProgress)}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Overall Implementation</h3>
              <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Implementation phases */}
          <div className="grid gap-4 md:grid-cols-2">
            {phases.map((phase, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {phase.icon}
                    <h3 className="font-medium ml-2">{phase.name}</h3>
                  </div>
                  <Badge 
                    variant={phase.status === 'completed' ? 'default' : 'outline'}
                    className={phase.status === 'completed' ? 'bg-green-500' : ''}
                  >
                    {phase.status === 'completed' ? 'Complete' : 'In Progress'}
                  </Badge>
                </div>
                
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{phase.progress}% complete</span>
                  {phase.status === 'completed' ? 
                    <Check className="h-4 w-4 text-green-500" /> : 
                    <Clock className="h-4 w-4 text-amber-500" />
                  }
                </div>
                
                <Progress value={phase.progress} className="h-1.5 mb-4" />
                
                <div className="space-y-1 text-sm">
                  {phase.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 
                        ${feature.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Check className="h-3 w-3" />
                      </div>
                      <span className={feature.completed ? 'text-foreground' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIImplementationStatus;
