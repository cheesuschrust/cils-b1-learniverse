
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Activity, Lock } from 'lucide-react';
import { HelpTooltip } from '@/components/help/HelpTooltip';
import { useToast } from '@/hooks/use-toast';

interface AISecurityMonitorProps {
  modelId?: string;
  onUpdateSecuritySettings?: (settings: AISecuritySettings) => void;
}

interface AISecuritySettings {
  anomalyDetectionThreshold: number;
  enableRealTimeMonitoring: boolean;
  enableAutomaticBlocking: boolean;
  sensitiveOperationsRequireMFA: boolean;
  dataEncryptionLevel: 'standard' | 'enhanced' | 'maximum';
}

const AISecurityMonitor: React.FC<AISecurityMonitorProps> = ({ 
  modelId, 
  onUpdateSecuritySettings 
}) => {
  const [securitySettings, setSecuritySettings] = useState<AISecuritySettings>({
    anomalyDetectionThreshold: 75,
    enableRealTimeMonitoring: true,
    enableAutomaticBlocking: false,
    sensitiveOperationsRequireMFA: true,
    dataEncryptionLevel: 'enhanced'
  });
  
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [securityEvents, setSecurityEvents] = useState<Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
    description: string;
    status: 'detected' | 'investigating' | 'resolved' | 'blocked';
  }>>([]);
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate loading security events
    const mockSecurityEvents = [
      {
        id: '1',
        type: 'anomalous_request_pattern',
        severity: 'medium' as const,
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        description: 'Unusual request pattern detected from IP 192.168.1.105',
        status: 'investigating' as const
      },
      {
        id: '2',
        type: 'unauthorized_model_access',
        severity: 'high' as const,
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        description: 'Attempted access to restricted AI model parameters',
        status: 'blocked' as const
      },
      {
        id: '3',
        type: 'prompt_injection_attempt',
        severity: 'high' as const,
        timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
        description: 'Potential prompt injection detected in user request',
        status: 'resolved' as const
      }
    ];
    
    setSecurityEvents(mockSecurityEvents);
    
    // Calculate security score based on settings
    calculateSecurityScore();
  }, []);
  
  useEffect(() => {
    calculateSecurityScore();
  }, [securitySettings]);
  
  const calculateSecurityScore = () => {
    // Simple algorithm to calculate security score based on settings
    let score = 0;
    
    // Base score from threshold (higher threshold = higher score)
    score += (securitySettings.anomalyDetectionThreshold / 100) * 25;
    
    // Add points for each security feature enabled
    if (securitySettings.enableRealTimeMonitoring) score += 20;
    if (securitySettings.enableAutomaticBlocking) score += 15;
    if (securitySettings.sensitiveOperationsRequireMFA) score += 20;
    
    // Add points based on encryption level
    if (securitySettings.dataEncryptionLevel === 'standard') score += 10;
    if (securitySettings.dataEncryptionLevel === 'enhanced') score += 15;
    if (securitySettings.dataEncryptionLevel === 'maximum') score += 20;
    
    setSecurityScore(Math.min(Math.round(score), 100));
  };
  
  const handleSettingChange = (
    setting: keyof AISecuritySettings, 
    value: any
  ) => {
    const newSettings = {
      ...securitySettings,
      [setting]: value
    };
    
    setSecuritySettings(newSettings);
    
    if (onUpdateSecuritySettings) {
      onUpdateSecuritySettings(newSettings);
    }
    
    toast({
      title: "Security setting updated",
      description: `The ${setting} setting has been updated.`,
    });
  };
  
  const handleThresholdChange = (value: number[]) => {
    handleSettingChange('anomalyDetectionThreshold', value[0]);
  };
  
  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'detected':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Detected</Badge>;
      case 'investigating':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Investigating</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'blocked':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Blocked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                AI Security Monitor
                <HelpTooltip 
                  content="Monitor and configure AI security settings to protect your models and data."
                />
              </CardTitle>
              <CardDescription>
                Protect your AI models from unauthorized access and potential attacks
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Security Score:</div>
              <div className="relative h-8 w-8">
                <div 
                  className="absolute inset-0 flex items-center justify-center rounded-full border-2"
                  style={{ 
                    borderColor: securityScore >= 80 ? 'green' : securityScore >= 60 ? 'orange' : 'red',
                  }}
                >
                  <span className="text-xs font-semibold">{securityScore}</span>
                </div>
              </div>
              {securityScore >= 80 ? (
                <ShieldCheck className="h-5 w-5 text-green-500" />
              ) : securityScore >= 60 ? (
                <Shield className="h-5 w-5 text-orange-500" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="events">
            <TabsList className="mb-4">
              <TabsTrigger value="events" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Security Events
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Lock className="h-4 w-4" />
                Security Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="events">
              <div className="space-y-4">
                {securityEvents.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">
                    No security events detected
                  </div>
                ) : (
                  securityEvents.map(event => (
                    <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${getSeverityColor(event.severity)}`} />
                          <span className="font-medium">{event.type.replace(/_/g, ' ')}</span>
                        </div>
                        {getStatusBadge(event.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </div>
                    </div>
                  ))
                )}
                
                {securitySettings.enableRealTimeMonitoring && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertTriangle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Real-time monitoring active</AlertTitle>
                    <AlertDescription>
                      Your AI system is being actively monitored for security threats.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-medium flex items-center">
                      Anomaly Detection Threshold
                      <HelpTooltip 
                        content="Set how sensitive the anomaly detection should be. Higher values mean fewer false positives but might miss some threats."
                        className="ml-1" 
                      />
                    </label>
                    <span className="text-sm">{securitySettings.anomalyDetectionThreshold}%</span>
                  </div>
                  <Slider
                    value={[securitySettings.anomalyDetectionThreshold]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={handleThresholdChange}
                    className="py-2"
                  />
                </div>
                
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="font-medium flex items-center">
                        Real-time Security Monitoring
                        <HelpTooltip 
                          content="Continuously monitor all AI model requests for suspicious patterns."
                          className="ml-1" 
                        />
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Monitor requests to your AI models in real-time
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.enableRealTimeMonitoring}
                      onCheckedChange={(checked) => 
                        handleSettingChange('enableRealTimeMonitoring', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="font-medium flex items-center">
                        Automatic Blocking
                        <HelpTooltip 
                          content="Automatically block users who trigger high-severity security alerts."
                          className="ml-1" 
                        />
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Automatically block suspicious activities
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.enableAutomaticBlocking}
                      onCheckedChange={(checked) => 
                        handleSettingChange('enableAutomaticBlocking', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="font-medium flex items-center">
                        MFA for Sensitive Operations
                        <HelpTooltip 
                          content="Require multi-factor authentication for operations that modify AI models or access sensitive data."
                          className="ml-1" 
                        />
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Add extra verification for critical AI operations
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.sensitiveOperationsRequireMFA}
                      onCheckedChange={(checked) => 
                        handleSettingChange('sensitiveOperationsRequireMFA', checked)
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="font-medium flex items-center">
                    Data Encryption Level
                    <HelpTooltip 
                      content="Choose the level of encryption for AI training data and model parameters."
                      className="ml-1" 
                    />
                  </label>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary"
                        checked={securitySettings.dataEncryptionLevel === 'standard'}
                        onChange={() => handleSettingChange('dataEncryptionLevel', 'standard')}
                      />
                      <span>Standard (AES-128)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary"
                        checked={securitySettings.dataEncryptionLevel === 'enhanced'}
                        onChange={() => handleSettingChange('dataEncryptionLevel', 'enhanced')}
                      />
                      <span>Enhanced (AES-256)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary"
                        checked={securitySettings.dataEncryptionLevel === 'maximum'}
                        onChange={() => handleSettingChange('dataEncryptionLevel', 'maximum')}
                      />
                      <span>Maximum (AES-256 with key rotation)</span>
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline">Reset to Defaults</Button>
          <Button onClick={() => {
            toast({
              title: "Security settings saved",
              description: "Your AI security settings have been updated successfully.",
            });
          }}>
            Save Security Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AISecurityMonitor;
