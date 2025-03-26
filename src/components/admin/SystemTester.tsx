
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, RefreshCw, Server, Cpu, Database, HardDrive } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/components/ui/use-toast';

const SystemTester: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    [key: string]: { status: 'idle' | 'running' | 'success' | 'error'; message?: string }
  }>({
    database: { status: 'idle' },
    aiModel: { status: 'idle' },
    storage: { status: 'idle' },
    network: { status: 'idle' },
  });
  
  const [progress, setProgress] = useState(0);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const { prepareModel } = useAI(); // Changed from loadModel to prepareModel
  const { toast } = useToast();
  
  const runTests = async () => {
    setIsRunningTests(true);
    setProgress(0);
    
    // Reset all test statuses
    setTestResults({
      database: { status: 'running' },
      aiModel: { status: 'idle' },
      storage: { status: 'idle' },
      network: { status: 'idle' },
    });
    
    // Simulate database test
    await simulateTest('database', 25);
    
    // Simulate AI model test
    setTestResults(prev => ({
      ...prev,
      aiModel: { status: 'running' }
    }));
    
    try {
      // Check if AI model can be loaded/prepared
      await prepareModel();
      await simulateTest('aiModel', 50);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        aiModel: { 
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error loading AI model'
        }
      }));
      setProgress(50);
    }
    
    // Simulate storage test
    await simulateTest('storage', 75);
    
    // Simulate network test
    await simulateTest('network', 100);
    
    setIsRunningTests(false);
    
    // Show toast with results
    const failedTests = Object.entries(testResults)
      .filter(([_, value]) => value.status === 'error')
      .map(([key]) => key);
    
    if (failedTests.length > 0) {
      toast({
        title: "Some tests failed",
        description: `Failed tests: ${failedTests.join(', ')}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "All tests passed",
        description: "System is running optimally",
        variant: "default",
      });
    }
  };
  
  const simulateTest = async (test: string, targetProgress: number) => {
    return new Promise<void>(resolve => {
      setTestResults(prev => ({
        ...prev,
        [test]: { status: 'running' }
      }));
      
      setTimeout(() => {
        // Simulate a success with 80% probability, error with 20%
        const isSuccess = Math.random() > 0.2;
        
        setTestResults(prev => ({
          ...prev,
          [test]: { 
            status: isSuccess ? 'success' : 'error',
            message: isSuccess ? undefined : `${test} test failed: connection timeout`
          }
        }));
        
        setProgress(targetProgress);
        resolve();
      }, 1500);
    });
  };
  
  const getTestIcon = (test: string, status: string) => {
    if (status === 'running') return <RefreshCw className="h-5 w-5 animate-spin" />;
    if (status === 'success') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'error') return <AlertCircle className="h-5 w-5 text-red-500" />;
    
    // Default icons based on test type
    switch (test) {
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'aiModel':
        return <Cpu className="h-5 w-5" />;
      case 'storage':
        return <HardDrive className="h-5 w-5" />;
      case 'network':
        return <Server className="h-5 w-5" />;
      default:
        return <Server className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Diagnostics</CardTitle>
          <CardDescription>
            Run tests to verify system components are working correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Test Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
            
            <div className="space-y-4 mt-6">
              {Object.entries(testResults).map(([test, { status, message }]) => (
                <div key={test} className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getTestIcon(test, status)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="font-medium capitalize">{test} Test</div>
                    <div className="text-sm text-muted-foreground">
                      {status === 'idle' && 'Ready to test'}
                      {status === 'running' && 'Testing...'}
                      {status === 'success' && 'Test passed successfully'}
                      {status === 'error' && message}
                    </div>
                  </div>
                  <div className="text-xs uppercase font-medium">
                    {status === 'success' && (
                      <span className="text-green-500">PASS</span>
                    )}
                    {status === 'error' && (
                      <span className="text-red-500">FAIL</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {Object.values(testResults).some(result => result.status === 'error') && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Some tests have failed. Please check the logs for more details or contact support.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={runTests} 
              disabled={isRunningTests}
              className="w-full mt-4"
            >
              {isRunningTests ? 'Running Tests...' : 'Run System Tests'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemTester;
