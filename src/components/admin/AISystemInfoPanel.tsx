
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { HelpCircle, Info, AlertCircle, Server, Shield, Cpu, Code } from 'lucide-react';
import { AISystemInfo, getAISystemLimitations } from '@/utils/AISystemInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * AISystemInfoPanel Component
 * 
 * Displays comprehensive information about the AI system used in the application.
 * Includes details about capabilities, limitations, support, and privacy.
 */
const AISystemInfoPanel = () => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              {AISystemInfo.name}
            </CardTitle>
            <CardDescription>
              Version {AISystemInfo.version} • Royalty-free for commercial use
            </CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            System Description
          </h3>
          <p className="text-sm">{AISystemInfo.description}</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
            <Code className="h-4 w-4 mr-1" />
            Capabilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AISystemInfo.capabilities.map((capability, index) => (
              <div key={index} className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                <span className="text-sm">{capability}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Limitations
          </h3>
          <div className="space-y-2">
            {getAISystemLimitations().map((limitation, index) => (
              <div key={index} className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 mr-2 flex-shrink-0"></span>
                <span className="text-sm">{limitation}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Language Support</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-1">Primary Languages</p>
                <div className="flex flex-wrap gap-1">
                  {AISystemInfo.languageSupport.primary.map((lang, index) => (
                    <Badge key={index} variant="secondary">{lang}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Basic Support</p>
                <div className="flex flex-wrap gap-1">
                  {AISystemInfo.languageSupport.basic.map((lang, index) => (
                    <Badge key={index} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Technical Requirements</h3>
            <div className="space-y-2">
              {Object.entries(AISystemInfo.requirements).map(([key, value], index) => (
                <div key={index}>
                  <p className="text-xs font-medium mb-1 capitalize">{key}</p>
                  <p className="text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            Privacy & Security
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(AISystemInfo.privacy).map(([key, value], index) => (
              <div key={index} className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded mr-2">
                  <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-xs text-muted-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted p-4 rounded-md mt-2">
          <div className="flex items-start">
            <Server className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Client-side Processing</h4>
              <p className="text-sm text-muted-foreground mt-1">
                This AI system runs entirely in the browser, providing privacy by processing all data locally on the user's device. No data is sent to external servers for AI processing.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Documentation
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-80 text-sm">
                Internal system documentation is available to administrators. Contains detailed information on configuration, models, and optimization.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="default" size="sm">
          System Status
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AISystemInfoPanel;
