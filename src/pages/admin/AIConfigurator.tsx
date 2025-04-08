
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAIModel } from '@/contexts/AIModelContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Trash, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Brain,
  Cpu,
  Key,
  Save,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface ModelFormData {
  id: string;
  name: string;
  provider: string;
  type: string;
  endpoint: string;
  apiKey?: string;
  isActive: boolean;
}

const AIConfigurator = () => {
  const { models, providers, addModel, updateModel, deleteModel } = useAIModel();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('models');
  const [editingModel, setEditingModel] = useState<ModelFormData | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  const defaultModelForm: ModelFormData = {
    id: '',
    name: '',
    provider: '',
    type: '',
    endpoint: '',
    apiKey: '',
    isActive: true
  };
  
  const [modelForm, setModelForm] = useState<ModelFormData>(defaultModelForm);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModelForm({ ...modelForm, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setModelForm({ ...modelForm, [name]: value });
  };
  
  const handleSwitchChange = (name: string, value: boolean) => {
    setModelForm({ ...modelForm, [name]: value });
  };
  
  const resetForm = () => {
    setModelForm(defaultModelForm);
    setEditingModel(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a random ID if this is a new model
    if (!modelForm.id) {
      modelForm.id = Math.random().toString(36).substring(2, 9);
    }
    
    if (editingModel) {
      updateModel(modelForm.id, modelForm);
      toast({
        title: "Model Updated",
        description: `${modelForm.name} has been updated successfully.`,
      });
    } else {
      addModel(modelForm);
      toast({
        title: "Model Added",
        description: `${modelForm.name} has been added successfully.`,
      });
    }
    
    resetForm();
  };
  
  const handleEdit = (model: ModelFormData) => {
    setEditingModel(model);
    setModelForm(model);
    setActiveTab('add-model');
  };
  
  const handleDelete = (id: string) => {
    deleteModel(id);
    toast({
      title: "Model Deleted",
      description: "The AI model has been deleted successfully.",
    });
  };
  
  const testConnection = async () => {
    setIsConfiguring(true);
    try {
      // Simulate testing connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to the AI model endpoint.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the AI model endpoint. Please check your settings.",
        variant: "destructive",
      });
    } finally {
      setIsConfiguring(false);
    }
  };
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container mx-auto py-10 space-y-8">
        <Helmet>
          <title>AI Model Configuration | Admin</title>
        </Helmet>
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">AI Model Configuration</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="models">Configured Models</TabsTrigger>
            <TabsTrigger value="add-model">
              {editingModel ? "Edit Model" : "Add New Model"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Models</CardTitle>
                <CardDescription>
                  Manage AI models used in the platform for various functions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {models.length > 0 ? (
                        models.map(model => (
                          <TableRow key={model.id}>
                            <TableCell className="font-medium">{model.name}</TableCell>
                            <TableCell>{model.provider}</TableCell>
                            <TableCell>{model.type}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{model.endpoint}</TableCell>
                            <TableCell>
                              {model.isActive ? (
                                <div className="flex items-center space-x-1 text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Active</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1 text-gray-500">
                                  <XCircle className="h-4 w-4" />
                                  <span>Inactive</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEdit(model)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the AI model configuration. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDelete(model.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No AI models configured. Click "Add New Model" to get started.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab('add-model')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Model
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Provider Settings</CardTitle>
                <CardDescription>
                  Configure global settings for AI providers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {providers.map(provider => (
                    <div key={provider.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {provider.isConfigured 
                              ? 'API key is configured' 
                              : 'API key is not configured'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {provider.isConfigured ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>Configured</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-amber-500">
                              <Settings className="h-4 w-4" />
                              <span>Not Configured</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {provider.apiKeyRequired && (
                          <div className="space-y-2">
                            <Label htmlFor={`${provider.id}-api-key`}>API Key</Label>
                            <div className="flex space-x-2">
                              <Input 
                                id={`${provider.id}-api-key`} 
                                type="password" 
                                placeholder={provider.isConfigured ? "••••••••••••••••" : "Enter API key"}
                              />
                              <Button variant="outline" size="icon">
                                <Key className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Required for authentication with {provider.name} services.
                            </p>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label>Available Model Types</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {provider.modelTypes.map(type => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox id={`${provider.id}-${type}`} />
                                <Label htmlFor={`${provider.id}-${type}`} className="text-sm">
                                  {type}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Test Connection
                        </Button>
                        <Button>
                          <Save className="mr-2 h-4 w-4" />
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add-model">
            <Card>
              <CardHeader>
                <CardTitle>{editingModel ? "Edit AI Model" : "Add New AI Model"}</CardTitle>
                <CardDescription>
                  {editingModel 
                    ? "Update the configuration for this AI model." 
                    : "Configure a new AI model to be used in the platform."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Model Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={modelForm.name}
                        onChange={handleInputChange}
                        placeholder="E.g., HuggingFace Chat Model"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        A descriptive name for this AI model.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider</Label>
                      <Select 
                        value={modelForm.provider} 
                        onValueChange={(value) => handleSelectChange('provider', value)}
                      >
                        <SelectTrigger id="provider">
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.map(provider => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        The AI service provider.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Model Type</Label>
                      <Select 
                        value={modelForm.type} 
                        onValueChange={(value) => handleSelectChange('type', value)}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {modelForm.provider && providers.find(p => p.id === modelForm.provider)?.modelTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        The type of AI functionality this model provides.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endpoint">Model Endpoint</Label>
                      <Input 
                        id="endpoint" 
                        name="endpoint"
                        value={modelForm.endpoint}
                        onChange={handleInputChange}
                        placeholder="E.g., https://api-inference.huggingface.co/models/..."
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        The API endpoint URL for this model.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key (Optional)</Label>
                      <Input 
                        id="apiKey" 
                        name="apiKey"
                        type="password"
                        value={modelForm.apiKey || ''}
                        onChange={handleInputChange}
                        placeholder="Leave blank to use provider's global API key"
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave blank to use the provider's global API key.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isActive">Active Status</Label>
                        <Switch 
                          id="isActive"
                          checked={modelForm.isActive}
                          onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enable or disable this model. Disabled models won't be used.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        resetForm();
                        setActiveTab('models');
                      }}
                    >
                      Cancel
                    </Button>
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={testConnection}
                        disabled={isConfiguring || !modelForm.endpoint}
                      >
                        {isConfiguring ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <Cpu className="mr-2 h-4 w-4" />
                            Test Connection
                          </>
                        )}
                      </Button>
                      <Button type="submit">
                        <Brain className="mr-2 h-4 w-4" />
                        {editingModel ? "Update Model" : "Add Model"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AIConfigurator;
