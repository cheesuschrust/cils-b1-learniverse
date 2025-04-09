
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Server, Globe, Database, Shield, Zap } from 'lucide-react';

const AIArchitectureExplainer: React.FC = () => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Cpu className="mr-2 h-5 w-5 text-primary" />
          AI Architecture Overview
        </CardTitle>
        <CardDescription>
          Technical overview of our hybrid AI implementation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Client-side AI */}
          <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/30">
            <h3 className="font-semibold text-lg flex items-center mb-2">
              <Cpu className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Client-Side AI Architecture
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our platform leverages modern browser capabilities to run AI models directly on your device,
              providing privacy, offline functionality, and reduced server load.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-md p-3 shadow-sm">
                <h4 className="font-medium text-sm mb-1 flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-amber-500" /> 
                  WebAssembly Acceleration
                </h4>
                <p className="text-xs text-muted-foreground">
                  AI models are compiled to WebAssembly (WASM) for near-native performance in the browser.
                  This allows complex NLP tasks to run with minimal latency.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-md p-3 shadow-sm">
                <h4 className="font-medium text-sm mb-1 flex items-center">
                  <Globe className="h-4 w-4 mr-1 text-green-500" /> 
                  Progressive Loading
                </h4>
                <p className="text-xs text-muted-foreground">
                  Models are loaded progressively and cached using IndexedDB, allowing the application
                  to function even when offline after initial download.
                </p>
              </div>
            </div>
          </div>
          
          {/* Server-side AI */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold text-lg flex items-center mb-2">
              <Server className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Server-Side AI Components
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              For more complex or resource-intensive AI tasks, we utilize server-side processing 
              with larger, more sophisticated models.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-md p-3">
                <h4 className="font-medium text-sm mb-1 flex items-center">
                  <Database className="h-4 w-4 mr-1 text-blue-500" /> 
                  API Orchestration
                </h4>
                <p className="text-xs text-muted-foreground">
                  Our API gateway intelligently routes requests to the appropriate AI service
                  based on the task complexity, required accuracy, and response time needs.
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-md p-3">
                <h4 className="font-medium text-sm mb-1 flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-red-500" /> 
                  Privacy-Preserving Processing
                </h4>
                <p className="text-xs text-muted-foreground">
                  When server-side processing is required, we employ privacy-preserving techniques 
                  to ensure user data is protected and minimally exposed.
                </p>
              </div>
            </div>
          </div>
          
          {/* Integration diagram */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold text-lg mb-3">System Architecture Diagram</h3>
            
            <div className="relative bg-muted/30 rounded-lg p-6 overflow-hidden">
              {/* Client */}
              <div className="border rounded-lg bg-white dark:bg-slate-800 p-3 mb-4 relative z-10 shadow-sm">
                <h4 className="text-sm font-medium mb-2">Client Browser</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="border rounded p-2 bg-blue-50 dark:bg-blue-900/30 text-center">
                    WebAssembly<br/>Runtime
                  </div>
                  <div className="border rounded p-2 bg-green-50 dark:bg-green-900/30 text-center">
                    IndexedDB<br/>Cache
                  </div>
                  <div className="border rounded p-2 bg-amber-50 dark:bg-amber-900/30 text-center">
                    Web Speech<br/>API
                  </div>
                </div>
              </div>
              
              {/* Connection line */}
              <div className="h-8 w-0.5 bg-muted-foreground/30 mx-auto -mt-1 mb-1"></div>
              <div className="w-4 h-4 rounded-full border border-muted-foreground/30 bg-muted-foreground/10 mx-auto -mt-2 mb-2 flex items-center justify-center">
                <span className="text-[0.6rem]">API</span>
              </div>
              <div className="h-8 w-0.5 bg-muted-foreground/30 mx-auto -mt-1 mb-1"></div>
              
              {/* Server */}
              <div className="border rounded-lg bg-white dark:bg-slate-800 p-3 relative z-10 shadow-sm">
                <h4 className="text-sm font-medium mb-2">Server Infrastructure</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="border rounded p-2 bg-purple-50 dark:bg-purple-900/30 text-center">
                    Advanced<br/>NLP Models
                  </div>
                  <div className="border rounded p-2 bg-red-50 dark:bg-red-900/30 text-center">
                    Content<br/>Generation
                  </div>
                  <div className="border rounded p-2 bg-indigo-50 dark:bg-indigo-900/30 text-center">
                    Model<br/>Orchestration
                  </div>
                </div>
              </div>
              
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-5">
                <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-blue-500"></div>
                <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-green-500"></div>
                <div className="absolute bottom-1/4 left-1/5 w-20 h-20 rounded-full bg-purple-500"></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIArchitectureExplainer;
