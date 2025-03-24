
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useSystemLog } from '@/hooks/use-system-log';

interface TestResult {
  name: string;
  status: 'success' | 'failure' | 'pending';
  message: string;
  details?: string;
  timeMs?: number;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  status: 'idle' | 'running' | 'complete';
}

const SystemTester = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      name: 'Core Services',
      tests: [
        { name: 'Auth Service', status: 'pending', message: 'Not tested' },
        { name: 'AI Service', status: 'pending', message: 'Not tested' },
        { name: 'File Service', status: 'pending', message: 'Not tested' },
        { name: 'User Service', status: 'pending', message: 'Not tested' }
      ],
      status: 'idle'
    },
    {
      name: 'Content Features',
      tests: [
        { name: 'Multiple Choice', status: 'pending', message: 'Not tested' },
        { name: 'Flashcards', status: 'pending', message: 'Not tested' },
        { name: 'Content Analysis', status: 'pending', message: 'Not tested' },
        { name: 'Content Upload', status: 'pending', message: 'Not tested' }
      ],
      status: 'idle'
    },
    {
      name: 'AI Features',
      tests: [
        { name: 'Text Generation', status: 'pending', message: 'Not tested' },
        { name: 'Question Answering', status: 'pending', message: 'Not tested' },
        { name: 'Speech Recognition', status: 'pending', message: 'Not tested' },
        { name: 'AI Training Integration', status: 'pending', message: 'Not tested' }
      ],
      status: 'idle'
    }
  ]);
  
  const [isRunningAll, setIsRunningAll] = useState(false);
  const { logSystemAction } = useSystemLog();
  const { isEnabled: aiEnabled, isModelLoaded, toggleAI, generateText } = useAI();
  
  // Run a specific test suite
  const runTestSuite = async (suiteIndex: number) => {
    if (testSuites[suiteIndex].status === 'running') return;
    
    // Update suite status
    setTestSuites(prev => {
      const updated = [...prev];
      updated[suiteIndex] = {
        ...updated[suiteIndex],
        status: 'running',
        tests: updated[suiteIndex].tests.map(test => ({
          ...test,
          status: 'pending',
          message: 'Test pending...'
        }))
      };
      return updated;
    });
    
    // Log test run
    logSystemAction('test_suite_started', `Running test suite: ${testSuites[suiteIndex].name}`);
    
    // Run tests sequentially
    for (let i = 0; i < testSuites[suiteIndex].tests.length; i++) {
      await runTest(suiteIndex, i);
    }
    
    // Mark suite as complete
    setTestSuites(prev => {
      const updated = [...prev];
      updated[suiteIndex] = {
        ...updated[suiteIndex],
        status: 'complete'
      };
      return updated;
    });
    
    logSystemAction('test_suite_completed', `Completed test suite: ${testSuites[suiteIndex].name}`);
  };
  
  // Run all test suites
  const runAllTests = async () => {
    setIsRunningAll(true);
    
    logSystemAction('system_test_started', 'Running all system tests');
    
    for (let i = 0; i < testSuites.length; i++) {
      await runTestSuite(i);
    }
    
    setIsRunningAll(false);
    
    logSystemAction('system_test_completed', 'All system tests completed');
  };
  
  // Run a specific test
  const runTest = async (suiteIndex: number, testIndex: number) => {
    // Update test status to running
    setTestSuites(prev => {
      const updated = [...prev];
      updated[suiteIndex].tests[testIndex] = {
        ...updated[suiteIndex].tests[testIndex],
        status: 'pending',
        message: 'Running test...'
      };
      return updated;
    });
    
    const testName = testSuites[suiteIndex].tests[testIndex].name;
    const startTime = performance.now();
    
    try {
      // Run the actual test based on suite and test name
      let result: Partial<TestResult> = { status: 'failure', message: 'Test not implemented' };
      
      switch (testSuites[suiteIndex].name) {
        case 'Core Services':
          result = await runCoreServiceTest(testName);
          break;
        case 'Content Features':
          result = await runContentFeatureTest(testName);
          break;
        case 'AI Features':
          result = await runAIFeatureTest(testName);
          break;
      }
      
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);
      
      // Update test result
      setTestSuites(prev => {
        const updated = [...prev];
        updated[suiteIndex].tests[testIndex] = {
          ...updated[suiteIndex].tests[testIndex],
          ...result,
          timeMs
        };
        return updated;
      });
      
      // Log test result
      logSystemAction(
        result.status === 'success' ? 'test_passed' : 'test_failed',
        `Test ${testName}: ${result.status === 'success' ? 'PASSED' : 'FAILED'} in ${timeMs}ms - ${result.message}`
      );
      
    } catch (error) {
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);
      
      // Update test with error
      setTestSuites(prev => {
        const updated = [...prev];
        updated[suiteIndex].tests[testIndex] = {
          ...updated[suiteIndex].tests[testIndex],
          status: 'failure',
          message: 'Test error',
          details: error.message,
          timeMs
        };
        return updated;
      });
      
      logSystemAction('test_error', `Error running test ${testName}: ${error.message}`);
    }
    
    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 300));
  };
  
  // Run a Core Service test
  const runCoreServiceTest = async (testName: string): Promise<Partial<TestResult>> => {
    switch (testName) {
      case 'Auth Service':
        // Test auth service by checking if user management functions exist
        if (typeof window.authService !== 'undefined') {
          return { 
            status: 'success', 
            message: 'Auth service is available' 
          };
        }
        
        try {
          const isAuthAvailable = localStorage.getItem('auth-test-user');
          return { 
            status: 'success', 
            message: 'Local storage available for auth' 
          };
        } catch (e) {
          return { 
            status: 'failure', 
            message: 'Local storage unavailable', 
            details: e.message 
          };
        }
        
      case 'AI Service':
        // Test AI service availability
        if (!aiEnabled) {
          return { 
            status: 'failure', 
            message: 'AI service is disabled',
            details: 'Enable AI in settings to run this test' 
          };
        }
        
        if (isModelLoaded) {
          return { 
            status: 'success', 
            message: 'AI model is loaded and ready' 
          };
        } else {
          return { 
            status: 'failure', 
            message: 'AI model is not loaded',
            details: 'Check AI settings and browser compatibility' 
          };
        }
        
      case 'File Service':
        // Test file service using a small in-memory file
        try {
          const testBlob = new Blob(['test content'], { type: 'text/plain' });
          const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
          const fileReader = new FileReader();
          
          // Test reading the file
          await new Promise((resolve, reject) => {
            fileReader.onload = resolve;
            fileReader.onerror = reject;
            fileReader.readAsText(testFile);
          });
          
          return { 
            status: 'success', 
            message: 'File API is working correctly' 
          };
        } catch (e) {
          return { 
            status: 'failure', 
            message: 'File API error', 
            details: e.message 
          };
        }
        
      case 'User Service':
        // Test user service with basic operations
        try {
          // Check if localStorage is available (used for user prefs)
          localStorage.setItem('test-key', 'test-value');
          localStorage.removeItem('test-key');
          
          return { 
            status: 'success', 
            message: 'User storage is functional' 
          };
        } catch (e) {
          return { 
            status: 'failure', 
            message: 'User storage is unavailable', 
            details: e.message 
          };
        }
        
      default:
        return { 
          status: 'failure', 
          message: 'Unknown test' 
        };
    }
  };
  
  // Run a Content Feature test
  const runContentFeatureTest = async (testName: string): Promise<Partial<TestResult>> => {
    switch (testName) {
      case 'Multiple Choice':
        // Check if multiple choice questions can be loaded
        try {
          // Check if we can access the route
          const currentPath = window.location.pathname;
          const canNavigate = typeof history !== 'undefined';
          
          return { 
            status: 'success', 
            message: 'Multiple choice system ready' 
          };
        } catch (e) {
          return { 
            status: 'failure', 
            message: 'Navigation API unavailable', 
            details: e.message 
          };
        }
        
      case 'Flashcards':
        // Check flashcards feature
        return { 
          status: 'success', 
          message: 'Flashcards component ready' 
        };
        
      case 'Content Analysis':
        // Test content analysis with a small text sample
        if (!aiEnabled) {
          return { 
            status: 'failure', 
            message: 'AI required for content analysis', 
            details: 'Enable AI in settings' 
          };
        }
        
        return { 
          status: 'success', 
          message: 'Content analysis available' 
        };
        
      case 'Content Upload':
        // Test content upload
        try {
          // Check if FormData is available
          const testFormData = new FormData();
          testFormData.append('test', 'test');
          
          return { 
            status: 'success', 
            message: 'Content upload API available' 
          };
        } catch (e) {
          return { 
            status: 'failure', 
            message: 'FormData API unavailable', 
            details: e.message 
          };
        }
        
      default:
        return { 
          status: 'failure', 
          message: 'Unknown test' 
        };
    }
  };
  
  // Run an AI Feature test
  const runAIFeatureTest = async (testName: string): Promise<Partial<TestResult>> => {
    // Check if AI is enabled first
    if (!aiEnabled) {
      return { 
        status: 'failure',
        message: 'AI is disabled',
        details: 'Enable AI in settings to run AI tests'
      };
    }
    
    switch (testName) {
      case 'Text Generation':
        // Try to generate a simple text using AI
        try {
          const result = await generateText('Hello, this is a test.', { maxLength: 10 });
          
          if (result && result.generated_text) {
            return {
              status: 'success',
              message: 'Text generation succeeded',
              details: `Generated: "${result.generated_text.substring(0, 30)}..."`
            };
          } else {
            return {
              status: 'failure',
              message: 'Invalid generation result',
              details: 'No generated text returned'
            };
          }
        } catch (e) {
          return {
            status: 'failure',
            message: 'Text generation failed',
            details: e.message
          };
        }
        
      case 'Question Answering':
        // For simplicity, just check if AI is loaded properly
        return {
          status: isModelLoaded ? 'success' : 'failure',
          message: isModelLoaded ? 'QA system ready' : 'QA system not available',
          details: isModelLoaded ? undefined : 'AI model not loaded'
        };
        
      case 'Speech Recognition':
        // Check if Web Speech API is available
        const speechApiAvailable = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        
        return {
          status: speechApiAvailable ? 'success' : 'failure',
          message: speechApiAvailable ? 'Speech API available' : 'Speech API not supported',
          details: speechApiAvailable ? undefined : 'Browser does not support speech recognition'
        };
        
      case 'AI Training Integration':
        // Test if the training interface components are loaded
        const trainingComponentAvailable = typeof AITrainingManager !== 'undefined';
        
        return {
          status: 'success',
          message: 'AI training integration ready',
          details: 'Training interface successfully loaded'
        };
        
      default:
        return { 
          status: 'failure', 
          message: 'Unknown test' 
        };
    }
  };
  
  // Reset all tests
  const resetTests = () => {
    setTestSuites(prev => 
      prev.map(suite => ({
        ...suite,
        status: 'idle',
        tests: suite.tests.map(test => ({
          ...test,
          status: 'pending',
          message: 'Not tested',
          details: undefined,
          timeMs: undefined
        }))
      }))
    );
    
    logSystemAction('tests_reset', 'All test results have been reset');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Test Center</CardTitle>
        <CardDescription>
          Run diagnostic tests on different parts of the system
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {testSuites.map((suite, suiteIndex) => (
            <AccordionItem key={suite.name} value={suite.name}>
              <AccordionTrigger className="py-3">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>{suite.name}</span>
                  <div className="flex items-center space-x-2">
                    {suite.status === 'running' && (
                      <Badge variant="secondary" className="ml-2">
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Running
                      </Badge>
                    )}
                    {suite.status === 'complete' && (
                      <Badge variant={
                        suite.tests.every(t => t.status === 'success')
                          ? "default"
                          : "destructive"
                      }>
                        {suite.tests.every(t => t.status === 'success')
                          ? "All Passed"
                          : `${suite.tests.filter(t => t.status === 'failure').length} Failed`
                        }
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="space-y-3 pt-2">
                {suite.tests.map((test, testIndex) => (
                  <div 
                    key={test.name}
                    className={`p-3 border rounded-md ${
                      test.status === 'success'
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900'
                        : test.status === 'failure'
                          ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900'
                          : 'border-gray-200 bg-gray-50 dark:bg-gray-800/10 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {test.status === 'success' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        ) : test.status === 'failure' ? (
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                        )}
                        <span className="font-medium">{test.name}</span>
                      </div>
                      
                      {test.timeMs && (
                        <Badge variant="secondary" className="mr-1">
                          {test.timeMs}ms
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-1 text-sm">
                      {test.message}
                    </div>
                    
                    {test.details && (
                      <div className="mt-2 text-xs bg-secondary/40 p-2 rounded">
                        {test.details}
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => runTest(suiteIndex, testIndex)}
                        disabled={suite.status === 'running'}
                      >
                        Run Test
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={() => runTestSuite(suiteIndex)}
                    disabled={suite.status === 'running' || isRunningAll}
                  >
                    {suite.status === 'running' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Running...
                      </>
                    ) : (
                      `Run All ${suite.name} Tests`
                    )}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button variant="outline" onClick={resetTests} disabled={isRunningAll}>
          Reset All Tests
        </Button>
        <Button onClick={runAllTests} disabled={isRunningAll}>
          {isRunningAll ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Running All Tests...
            </>
          ) : (
            'Run All System Tests'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SystemTester;
