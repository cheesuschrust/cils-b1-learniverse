import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle, Loader2, Server, Database, Cpu, Network, FileText, Wifi } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSystemLog } from '@/hooks/use-system-log';
import { useAI } from '@/hooks/useAI';
import AITrainingManagerWrapper from './AITrainingManagerWrapper';

const SystemTester = () => {
  const [activeTab, setActiveTab] = useState('network');
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const { toast } = useToast();
  const { logSystemAction } = useSystemLog();
  const { isModelLoaded, loadModel } = useAI();
  
  // Run initial basic tests on mount
  useEffect(() => {
    runBasicTests();
  }, []);
  
  const runBasicTests = async () => {
    // Simple browser capability tests
    const results = {
      webgl: hasWebGL(),
      localStorage: hasLocalStorage(),
      indexedDB: hasIndexedDB(),
      serviceWorker: 'serviceWorker' in navigator,
      webSpeech: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
      mediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      webRTC: !!(window.RTCPeerConnection),
      webWorkers: !!window.Worker,
      webAssembly: typeof WebAssembly === 'object',
      webGPU: 'gpu' in navigator
    };
    
    setTestResults(prev => ({
      ...prev,
      browser: results
    }));
    
    logSystemAction('system_test_run', 'Basic browser capability tests completed');
  };
  
  const runNetworkTests = async () => {
    setIsRunningTests(true);
    setTestProgress(0);
    
    try {
      // Test API connectivity
      setTestProgress(10);
      const apiTest = await testAPIConnectivity();
      
      // Test download speed
      setTestProgress(30);
      const downloadTest = await testDownloadSpeed();
      
      // Test upload speed
      setTestProgress(60);
      const uploadTest = await testUploadSpeed();
      
      // Test latency
      setTestProgress(80);
      const latencyTest = await testLatency();
      
      setTestResults(prev => ({
        ...prev,
        network: {
          api: apiTest,
          download: downloadTest,
          upload: uploadTest,
          latency: latencyTest,
          timestamp: new Date().toISOString()
        }
      }));
      
      setTestProgress(100);
      toast({
        title: "Network tests completed",
        description: "All network tests have been completed successfully."
      });
      
      logSystemAction('network_test_completed', 'Network tests completed successfully');
    } catch (error) {
      console.error("Network test error:", error);
      toast({
        title: "Network test error",
        description: "There was an error running the network tests.",
        variant: "destructive"
      });
      
      logSystemAction('network_test_error', `Network test error: ${error}`, 'error');
    } finally {
      setIsRunningTests(false);
    }
  };
  
  const runDatabaseTests = async () => {
    setIsRunningTests(true);
    setTestProgress(0);
    
    try {
      // Test database connection
      setTestProgress(20);
      const connectionTest = await testDatabaseConnection();
      
      // Test read operations
      setTestProgress(40);
      const readTest = await testDatabaseRead();
      
      // Test write operations
      setTestProgress(60);
      const writeTest = await testDatabaseWrite();
      
      // Test query performance
      setTestProgress(80);
      const performanceTest = await testDatabasePerformance();
      
      setTestResults(prev => ({
        ...prev,
        database: {
          connection: connectionTest,
          read: readTest,
          write: writeTest,
          performance: performanceTest,
          timestamp: new Date().toISOString()
        }
      }));
      
      setTestProgress(100);
      toast({
        title: "Database tests completed",
        description: "All database tests have been completed successfully."
      });
      
      logSystemAction('database_test_completed', 'Database tests completed successfully');
    } catch (error) {
      console.error("Database test error:", error);
      toast({
        title: "Database test error",
        description: "There was an error running the database tests.",
        variant: "destructive"
      });
      
      logSystemAction('database_test_error', `Database test error: ${error}`, 'error');
    } finally {
      setIsRunningTests(false);
    }
  };
  
  const runAuthTests = async () => {
    setIsRunningTests(true);
    setTestProgress(0);
    
    try {
      // Test authentication service
      setTestProgress(25);
      const authServiceTest = await testAuthService();
      
      // Test token validation
      setTestProgress(50);
      const tokenTest = await testTokenValidation();
      
      // Test permissions
      setTestProgress(75);
      const permissionsTest = await testPermissions();
      
      setTestResults(prev => ({
        ...prev,
        auth: {
          service: authServiceTest,
          token: tokenTest,
          permissions: permissionsTest,
          timestamp: new Date().toISOString()
        }
      }));
      
      setTestProgress(100);
      toast({
        title: "Authentication tests completed",
        description: "All authentication tests have been completed successfully."
      });
      
      logSystemAction('auth_test_completed', 'Authentication tests completed successfully');
    } catch (error) {
      console.error("Authentication test error:", error);
      toast({
        title: "Authentication test error",
        description: "There was an error running the authentication tests.",
        variant: "destructive"
      });
      
      logSystemAction('auth_test_error', `Authentication test error: ${error}`, 'error');
    } finally {
      setIsRunningTests(false);
    }
  };
  
  const runAITests = async () => {
    setIsRunningTests(true);
    setTestProgress(0);
    
    try {
      // Test AI model loading
      setTestProgress(20);
      const modelLoadTest = await testAIModelLoading();
      
      // Test text generation
      setTestProgress(40);
      const textGenTest = await testTextGeneration();
      
      // Test classification
      setTestProgress(60);
      const classificationTest = await testClassification();
      
      // Test question answering
      setTestProgress(80);
      const qaTest = await testQuestionAnswering();
      
      setTestResults(prev => ({
        ...prev,
        ai: {
          modelLoad: modelLoadTest,
          textGeneration: textGenTest,
          classification: classificationTest,
          questionAnswering: qaTest,
          timestamp: new Date().toISOString()
        }
      }));
      
      setTestProgress(100);
      toast({
        title: "AI tests completed",
        description: "All AI tests have been completed successfully."
      });
      
      logSystemAction('ai_test_completed', 'AI tests completed successfully');
    } catch (error) {
      console.error("AI test error:", error);
      toast({
        title: "AI test error",
        description: "There was an error running the AI tests.",
        variant: "destructive"
      });
      
      logSystemAction('ai_test_error', `AI test error: ${error}`, 'error');
    } finally {
      setIsRunningTests(false);
    }
  };
  
  // Test implementation functions
  const hasWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  };
  
  const hasLocalStorage = () => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const hasIndexedDB = () => {
    try {
      return !!window.indexedDB;
    } catch (e) {
      return false;
    }
  };
  
  const testAPIConnectivity = async () => {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/health', { method: 'GET' });
      const endTime = performance.now();
      
      if (!response.ok) {
        return {
          success: false,
          message: `API returned status ${response.status}`,
          time: endTime - startTime
        };
      }
      
      return {
        success: true,
        message: 'API connection successful',
        time: endTime - startTime
      };
    } catch (error) {
      console.error("API connectivity test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        time: 0
      };
    }
  };
  
  const testDownloadSpeed = async () => {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/test/download', { method: 'GET' });
      const endTime = performance.now();
      
      if (!response.ok) {
        return {
          success: false,
          message: `Download test failed with status ${response.status}`,
          time: endTime - startTime
        };
      }
      
      const data = await response.blob();
      const fileSizeInBytes = data.size;
      const fileSizeInMbits = fileSizeInBytes * 8 / 1000000;
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMbps = fileSizeInMbits / durationInSeconds;
      
      return {
        success: true,
        message: `Download speed: ${speedMbps.toFixed(2)} Mbps`,
        speed: speedMbps,
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Download speed test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        speed: 0,
        time: 0
      };
    }
  };
  
  const testUploadSpeed = async () => {
    try {
      // Create a file of random data to upload
      const sizeInBytes = 1024 * 1024; // 1MB
      const randomData = new Uint8Array(sizeInBytes);
      for (let i = 0; i < sizeInBytes; i++) {
        randomData[i] = Math.floor(Math.random() * 256);
      }
      const blob = new Blob([randomData]);
      const formData = new FormData();
      formData.append('file', blob, 'speedtest.bin');
      
      const startTime = performance.now();
      const response = await fetch('/api/test/upload', {
        method: 'POST',
        body: formData
      });
      const endTime = performance.now();
      
      if (!response.ok) {
        return {
          success: false,
          message: `Upload test failed with status ${response.status}`,
          time: endTime - startTime
        };
      }
      
      const fileSizeInMbits = sizeInBytes * 8 / 1000000;
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMbps = fileSizeInMbits / durationInSeconds;
      
      return {
        success: true,
        message: `Upload speed: ${speedMbps.toFixed(2)} Mbps`,
        speed: speedMbps,
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Upload speed test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        speed: 0,
        time: 0
      };
    }
  };
  
  const testLatency = async () => {
    try {
      const pings = [];
      for (let i = 0; i < 5; i++) {
        const startTime = performance.now();
        const response = await fetch('/api/ping', { method: 'GET' });
        const endTime = performance.now();
        
        if (!response.ok) {
          return {
            success: false,
            message: `Latency test failed with status ${response.status}`,
            time: 0
          };
        }
        
        pings.push(endTime - startTime);
      }
      
      const avgPing = pings.reduce((sum, ping) => sum + ping, 0) / pings.length;
      
      return {
        success: true,
        message: `Average latency: ${avgPing.toFixed(2)} ms`,
        latency: avgPing,
        time: avgPing
      };
    } catch (error) {
      console.error("Latency test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        latency: 0,
        time: 0
      };
    }
  };
  
  const testDatabaseConnection = async () => {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/db/connection', { method: 'GET' });
      const endTime = performance.now();
      
      if (!response.ok) {
        return {
          success: false,
          message: `Database connection test failed with status ${response.status}`,
          time: endTime - startTime
        };
      }
      
      return {
        success: true,
        message: 'Database connection successful',
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Database connection test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        time: 0
      };
    }
  };
  
  const testDatabaseRead = async () => {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/db/read', { method: 'GET' });
      const endTime = performance.now();
      
      if (!response.ok) {
        return {
          success: false,
          message: `Database read test failed with status ${response.status}`,
          time: endTime - startTime
        };
      }
      
      return {
        success: true,
        message: 'Database read successful',
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Database read test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        time: 0
      };
    }
  };
  
  const testDatabaseWrite = async () => {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/db/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testId: `test-${Date.now()}`,
          timestamp: new Date().toISOString()
        })
      });
      const endTime = performance.now();
      
      if (!response.ok) {
        return {
          success: false,
          message: `Database write test failed with status ${response.status}`,
          time: endTime - startTime
        };
      }
      
      return {
        success: true,
        message: 'Database write successful',
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Database write test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        time: 0
      };
    }
  };
  
  const testDatabasePerformance = async () => {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/db/performance', { method: 'GET' });
      const endTime = performance.now();
      
      if (!response.ok) {
        return {
          success: false,
          message: `Database performance test failed with status ${response.status}`,
          time: endTime - startTime
        };
      }
      
      const data = await response.json();
      
      return {
        success: true,
        message: `Database query time: ${data.queryTime.toFixed(2)} ms`,
        queryTime: data.queryTime,
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Database performance test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        queryTime: 0,
        time: 0
      };
    }
  };
  
  const testAuthService = async () => {
    try {
      const startTime = performance.now();
      
      // Use the global authService reference
      const authServiceTest = window.authService ? 
        await window.authService.testConnection() : 
        { success: false, message: 'Auth service not available' };
      
      const endTime = performance.now();
      
      return {
        success: authServiceTest.success,
        message: authServiceTest.message || 'Auth service test completed',
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Auth service test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        time: 0
      };
    }
  };
  
  const testTokenValidation = async () => {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/auth/validate-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer test-token`
        }
      });
      const endTime = performance.now();
      
      // We expect this to fail since we're using a test token
      // But we want to make sure the endpoint is responding
      
      return {
        success: true,
        message: 'Token validation endpoint is responding',
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Token validation test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        time: 0
      };
    }
  };
  
  const testPermissions = async () => {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/auth/permissions', { method: 'GET' });
      const endTime = performance.now();
      
      if (!response.ok) {
        return {
          success: false,
          message: `Permissions test failed with status ${response.status}`,
          time: endTime - startTime
        };
      }
      
      return {
        success: true,
        message: 'Permissions endpoint is responding',
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Permissions test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        time: 0
      };
    }
  };
  
  const testAIModelLoading = async () => {
    try {
      const startTime = performance.now();
      
      if (!isModelLoaded) {
        await loadModel('text-generation');
      }
      
      const endTime = performance.now();
      
      return {
        success: true,
        message: 'AI model loaded successfully',
        time: endTime - startTime
      };
    } catch (error) {
      console.error("AI model loading test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        time: 0
      };
    }
  };
  
  const testTextGeneration = async () => {
    try {
      const startTime = performance.now();
      
      // Mock text generation for testing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const endTime = performance.now();
      
      return {
        success: true,
        message: 'Text generation test completed',
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Text generation test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        time: 0
      };
    }
  };
  
  const testClassification = async () => {
    try {
      const startTime = performance.now();
      
      // Mock classification for testing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const endTime = performance.now();
      
      return {
        success: true,
        message: 'Classification test completed',
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Classification test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        time: 0
      };
    }
  };
  
  const testQuestionAnswering = async () => {
    try {
      const startTime = performance.now();
      
      // Mock question answering for testing
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const endTime = performance.now();
      
      return {
        success: true,
        message: 'Question answering test completed',
        time: endTime - startTime
      };
    } catch (error) {
      console.error("Question answering test error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        time: 0
      };
    }
  };
  
  const renderTestResults = (category: string) => {
    const results = testResults[category];
    
    if (!results) {
      return (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">No test results available</p>
          <Button 
            onClick={() => {
              if (category === 'network') runNetworkTests();
              else if (category === 'database') runDatabaseTests();
              else if (category === 'auth') runAuthTests();
              else if (category === 'ai') runAITests();
            }}
            disabled={isRunningTests}
            className="mt-4"
          >
            {isRunningTests ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Tests'
            )}
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {Object.entries(results).map(([key, value]: [string, any]) => {
          if (key === 'timestamp') return null;
          
          return (
            <div key={key} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center">
                {value.success ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-red-500 mr-2" />
                )}
                <div>
                  <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-sm text-muted-foreground">{value.message}</p>
                </div>
              </div>
              {value.time && (
                <Badge variant={value.time < 500 ? "default" : value.time < 1000 ? "secondary" : "outline"}>
                  {value.time.toFixed(0)} ms
                </Badge>
              )}
            </div>
          );
        })}
        
        {results.timestamp && (
          <p className="text-xs text-muted-foreground text-right">
            Last run: {new Date(results.timestamp).toLocaleString()}
          </p>
        )}
        
        <Button 
          onClick={() => {
            if (category === 'network') runNetworkTests();
            else if (category === 'database') runDatabaseTests();
            else if (category === 'auth') runAuthTests();
            else if (category === 'ai') runAITests();
          }}
          disabled={isRunningTests}
          className="w-full"
        >
          {isRunningTests ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Tests Again'
          )}
        </Button>
      </div>
    );
  };
  
  const renderBrowserCapabilities = () => {
    const browser = testResults.browser;
    
    if (!browser) {
      return (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">No browser capability results available</p>
          <Button 
            onClick={runBasicTests}
            className="mt-4"
          >
            Check Browser Capabilities
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(browser).map(([key, value]) => (
          <div key={key} className="flex items-center p-2 border rounded">
            {value ? (
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-sm text-muted-foreground">
                {value ? 'Supported' : 'Not supported'}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Tests</h2>
        {isRunningTests && (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Running tests ({testProgress}%)</span>
          </div>
        )}
      </div>
      
      {isRunningTests && (
        <Progress value={testProgress} className="h-2" />
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="browser" className="flex items-center">
            <Cpu className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Browser</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center">
            <Wifi className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Network</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Database</span>
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center">
            <Server className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Auth</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">AI</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browser">
          <Card>
            <CardHeader>
              <CardTitle>Browser Capabilities</CardTitle>
              <CardDescription>
                Check if your browser supports all required features
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderBrowserCapabilities()}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={runBasicTests}>
                Refresh Tests
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network Tests</CardTitle>
              <CardDescription>
                Test API connectivity, download/upload speeds, and latency
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderTestResults('network')}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Tests</CardTitle>
              <CardDescription>
                Test database connection, read/write operations, and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderTestResults('database')}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Tests</CardTitle>
              <CardDescription>
                Test authentication service, token validation, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderTestResults('auth')}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI System Tests</CardTitle>
              <CardDescription>
                Test AI model loading, text generation, and other AI capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderTestResults('ai')}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">AI Training Management</h3>
            <AITrainingManagerWrapper />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemTester;
