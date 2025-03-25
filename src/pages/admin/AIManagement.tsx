
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AISystemInfoPanel from '@/components/admin/AISystemInfoPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AISystemInfo } from '@/utils/AISystemInfo';

/**
 * AIManagement Page
 * 
 * Administrative interface for managing AI settings, models, and monitoring
 * performance across the application.
 */
const AIManagement = () => {
  return (
    <>
      <Helmet>
        <title>AI Management - Admin</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">AI Management</h1>
        <p className="text-muted-foreground mb-6">
          Monitor and configure AI systems and model settings
        </p>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <AISystemInfoPanel />
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">System Usage</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Text Generation</p>
                          <p className="text-sm">3,247 requests</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Speech Recognition</p>
                          <p className="text-sm">1,865 requests</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '52%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Translation</p>
                          <p className="text-sm">942 requests</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '35%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Question Generation</p>
                          <p className="text-sm">2,106 requests</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Model Status</CardTitle>
                    <CardDescription>Currently active models</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-md">
                        <p className="text-sm font-medium">Text Generation</p>
                        <p className="text-xs">v2.1 • Active</p>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-md">
                        <p className="text-sm font-medium">Speech Recognition</p>
                        <p className="text-xs">v1.8 • Active</p>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-amber-50 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded-md">
                        <p className="text-sm font-medium">Translation</p>
                        <p className="text-xs">v2.0 • Update Available</p>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-md">
                        <p className="text-sm font-medium">Flashcard Generation</p>
                        <p className="text-xs">v1.5 • Active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>System Capabilities</CardTitle>
                <CardDescription>
                  Core AI capabilities available in this system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Content Generation</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Creates educational content like questions, flashcards, and exercises.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center justify-between mb-1">
                        <span>Accuracy</span>
                        <span>85%</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-1">
                        <span>Speed</span>
                        <span>Fast</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Speech Processing</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Recognizes and evaluates spoken language for practice exercises.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center justify-between mb-1">
                        <span>Accuracy</span>
                        <span>78%</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-1">
                        <span>Speed</span>
                        <span>Medium</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Translation</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Translates text between English and Italian with context awareness.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center justify-between mb-1">
                        <span>Accuracy</span>
                        <span>82%</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '82%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-1">
                        <span>Speed</span>
                        <span>Fast</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Text Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Analyzes text for difficulty level, grammar, and vocabulary.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center justify-between mb-1">
                        <span>Accuracy</span>
                        <span>90%</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-1">
                        <span>Speed</span>
                        <span>Very Fast</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Writing Assistance</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Helps with grammar, vocabulary, and style in written exercises.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center justify-between mb-1">
                        <span>Accuracy</span>
                        <span>75%</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-1">
                        <span>Speed</span>
                        <span>Medium</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Learning Personalization</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Adapts content difficulty based on user performance.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center justify-between mb-1">
                        <span>Accuracy</span>
                        <span>80%</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-1">
                        <span>Speed</span>
                        <span>Slow</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models">
            <Card>
              <CardHeader>
                <CardTitle>AI Models</CardTitle>
                <CardDescription>
                  Configure and manage AI models used by the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-left p-3 text-sm font-medium">Model Name</th>
                          <th className="text-left p-3 text-sm font-medium">Type</th>
                          <th className="text-left p-3 text-sm font-medium">Version</th>
                          <th className="text-left p-3 text-sm font-medium">Size</th>
                          <th className="text-left p-3 text-sm font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="p-3 text-sm">TextGeneration</td>
                          <td className="p-3 text-sm">Transformer</td>
                          <td className="p-3 text-sm">2.1.0</td>
                          <td className="p-3 text-sm">128MB</td>
                          <td className="p-3 text-sm"><span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded text-xs">Active</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 text-sm">SpeechRecognition</td>
                          <td className="p-3 text-sm">RNN</td>
                          <td className="p-3 text-sm">1.8.3</td>
                          <td className="p-3 text-sm">64MB</td>
                          <td className="p-3 text-sm"><span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded text-xs">Active</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 text-sm">Translation</td>
                          <td className="p-3 text-sm">Transformer</td>
                          <td className="p-3 text-sm">2.0.1</td>
                          <td className="p-3 text-sm">96MB</td>
                          <td className="p-3 text-sm"><span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded text-xs">Update Available</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 text-sm">FlashcardGeneration</td>
                          <td className="p-3 text-sm">MLP</td>
                          <td className="p-3 text-sm">1.5.2</td>
                          <td className="p-3 text-sm">32MB</td>
                          <td className="p-3 text-sm"><span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded text-xs">Active</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 text-sm">TextClassification</td>
                          <td className="p-3 text-sm">CNN</td>
                          <td className="p-3 text-sm">1.2.0</td>
                          <td className="p-3 text-sm">16MB</td>
                          <td className="p-3 text-sm"><span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded text-xs">Active</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Model Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Cache Results</p>
                            <p className="text-sm text-muted-foreground">Store AI outputs for faster response</p>
                          </div>
                          <div className="flex items-center h-6">
                            <input type="checkbox" id="cache-results" className="h-4 w-4" defaultChecked />
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Batch Processing</p>
                            <p className="text-sm text-muted-foreground">Process multiple requests at once</p>
                          </div>
                          <div className="flex items-center h-6">
                            <input type="checkbox" id="batch-processing" className="h-4 w-4" defaultChecked />
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Save User Corrections</p>
                            <p className="text-sm text-muted-foreground">Learn from user feedback</p>
                          </div>
                          <div className="flex items-center h-6">
                            <input type="checkbox" id="user-corrections" className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-1">Response Time</p>
                          <select className="w-full border rounded p-2">
                            <option>Balanced (Default)</option>
                            <option>Fast (Lower quality)</option>
                            <option>Thorough (Higher quality)</option>
                          </select>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-1">Model Size</p>
                          <select className="w-full border rounded p-2">
                            <option>Medium (Default)</option>
                            <option>Small (Faster, less accurate)</option>
                            <option>Large (Slower, more accurate)</option>
                          </select>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-1">Language Preference</p>
                          <select className="w-full border rounded p-2">
                            <option>Italian & English</option>
                            <option>Italian Primary</option>
                            <option>English Primary</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Monitoring</CardTitle>
                <CardDescription>
                  Track AI system performance and resource usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Average Response Time</p>
                      <p className="text-2xl font-bold">235ms</p>
                      <p className="text-xs text-green-600">↓ 12% from last month</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">98.3%</p>
                      <p className="text-xs text-green-600">↑ 1.2% from last month</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Daily Requests</p>
                      <p className="text-2xl font-bold">4,287</p>
                      <p className="text-xs text-amber-600">↑ 17% from last month</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Error Rate</p>
                      <p className="text-2xl font-bold">1.7%</p>
                      <p className="text-xs text-green-600">↓ 0.3% from last month</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Performance by Feature</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Multiple Choice Questions</p>
                          <p className="text-sm">96% accuracy</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '96%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Speech Recognition</p>
                          <p className="text-sm">88% accuracy</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Translation</p>
                          <p className="text-sm">92% accuracy</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Writing Evaluation</p>
                          <p className="text-sm">85% accuracy</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Vocabulary Suggestions</p>
                          <p className="text-sm">94% accuracy</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">System Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium mb-1">CPU Usage</p>
                        <div className="flex items-center space-x-4">
                          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '32%' }}></div>
                          </div>
                          <span className="text-sm font-medium">32%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Memory Usage</p>
                        <div className="flex items-center space-x-4">
                          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <span className="text-sm font-medium">45%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Browser Cache Usage</p>
                        <div className="flex items-center space-x-4">
                          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <span className="text-sm font-medium">65%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Web Worker Utilization</p>
                        <div className="flex items-center space-x-4">
                          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: '28%' }}></div>
                          </div>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chatbot Tab */}
          <TabsContent value="chatbot">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Configuration</CardTitle>
                <CardDescription>
                  Configure and manage the LinguaBot chatbot assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Enable Chatbot</p>
                          <p className="text-sm text-muted-foreground">Show chatbot to users</p>
                        </div>
                        <div className="flex items-center h-6">
                          <input type="checkbox" id="enable-chatbot" className="h-4 w-4" defaultChecked />
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-1">Chatbot Name</p>
                        <input type="text" className="w-full border rounded p-2" defaultValue="LinguaBot" />
                      </div>
                      
                      <div>
                        <p className="font-medium mb-1">Welcome Message</p>
                        <textarea 
                          className="w-full border rounded p-2 min-h-[80px]" 
                          defaultValue="Ciao! I'm LinguaBot, your Italian learning assistant. How can I help you today?"
                        />
                      </div>
                      
                      <div>
                        <p className="font-medium mb-1">Fallback Message</p>
                        <textarea 
                          className="w-full border rounded p-2 min-h-[80px]" 
                          defaultValue="I'm sorry, I don't have enough information to answer that question. Would you like to speak with our support team?"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-1">Personality</p>
                        <select className="w-full border rounded p-2">
                          <option>Friendly (Default)</option>
                          <option>Formal</option>
                          <option>Educational</option>
                        </select>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-1">Response Time</p>
                        <select className="w-full border rounded p-2">
                          <option>Balanced (Default)</option>
                          <option>Fast</option>
                          <option>Thorough</option>
                        </select>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-1">Default Language</p>
                        <select className="w-full border rounded p-2">
                          <option>Auto-detect</option>
                          <option>English</option>
                          <option>Italian</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Suggest Related Questions</p>
                          <p className="text-sm text-muted-foreground">Show question suggestions</p>
                        </div>
                        <div className="flex items-center h-6">
                          <input type="checkbox" id="suggest-questions" className="h-4 w-4" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Allow Feedback</p>
                          <p className="text-sm text-muted-foreground">Let users rate responses</p>
                        </div>
                        <div className="flex items-center h-6">
                          <input type="checkbox" id="allow-feedback" className="h-4 w-4" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Enable Learning</p>
                          <p className="text-sm text-muted-foreground">Improve from user interactions</p>
                        </div>
                        <div className="flex items-center h-6">
                          <input type="checkbox" id="enable-learning" className="h-4 w-4" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Chatbot Analytics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground">Total Conversations</p>
                        <p className="text-2xl font-bold">1,547</p>
                        <p className="text-xs text-green-600">↑ 23% from last month</p>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground">Avg. Conversation Length</p>
                        <p className="text-2xl font-bold">4.8 messages</p>
                        <p className="text-xs text-green-600">↑ 0.7 from last month</p>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground">Positive Feedback Rate</p>
                        <p className="text-2xl font-bold">78%</p>
                        <p className="text-xs text-green-600">↑ 5% from last month</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Common Topics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 border rounded-md">
                        <p className="font-medium">Subscription Help</p>
                        <p className="text-sm text-muted-foreground">245 conversations</p>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <p className="font-medium">Exercise Help</p>
                        <p className="text-sm text-muted-foreground">187 conversations</p>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <p className="font-medium">Technical Issues</p>
                        <p className="text-sm text-muted-foreground">156 conversations</p>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <p className="font-medium">Grammar Questions</p>
                        <p className="text-sm text-muted-foreground">142 conversations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AIManagement;
