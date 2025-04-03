
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, BubbleChart } from '@/components/admin/charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Download, BarChart, PieChart } from 'lucide-react';

type MetricDimension = {
  id: string;
  name: string;
  description?: string;
}

interface AIModelData {
  modelName: string;
  version: string;
  metrics: Record<string, number>;
  trainingDate: Date;
  datasetSize: number;
}

interface AIModelEvaluationCardProps {
  models: AIModelData[];
  className?: string;
  onModelSelect?: (modelName: string, version: string) => void;
}

const AIModelEvaluationCard: React.FC<AIModelEvaluationCardProps> = ({
  models,
  className = '',
  onModelSelect
}) => {
  const { toast } = useToast();
  const [selectedModels, setSelectedModels] = useState<string[]>(
    models.length > 0 ? [models[0].modelName] : []
  );
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'accuracy', 'latency', 'confidenceScore', 'f1Score'
  ]);
  
  const allMetrics: MetricDimension[] = [
    { id: 'accuracy', name: 'Accuracy', description: 'Overall correctness of predictions' },
    { id: 'latency', name: 'Response Time', description: 'Average response time in milliseconds' },
    { id: 'confidenceScore', name: 'Confidence', description: 'Model\'s certainty in its predictions' },
    { id: 'f1Score', name: 'F1 Score', description: 'Harmonic mean of precision and recall' },
    { id: 'precision', name: 'Precision', description: 'Fraction of relevant instances among retrieved instances' },
    { id: 'recall', name: 'Recall', description: 'Fraction of relevant instances that were retrieved' },
    { id: 'dataEfficiency', name: 'Data Efficiency', description: 'Performance relative to training data size' },
    { id: 'memoryUsage', name: 'Memory Usage', description: 'RAM consumed during inference (MB)' }
  ];
  
  const filteredModels = models.filter(model => 
    selectedModels.includes(model.modelName)
  );
  
  // Transform data for radar chart
  const transformedRadarData = selectedMetrics.map(metricId => {
    const dataPoint: Record<string, any> = { 
      category: allMetrics.find(m => m.id === metricId)?.name || metricId 
    };
    
    filteredModels.forEach(model => {
      dataPoint[`${model.modelName} v${model.version}`] = 
        model.metrics[metricId] || 0;
    });
    
    return dataPoint;
  });
  
  // Transform data for bubble chart
  const bubbleData = models.map(model => ({
    modelName: `${model.modelName} v${model.version}`,
    xAxis: model.metrics.accuracy || 0,
    yAxis: model.metrics.latency || 0,
    zAxis: model.datasetSize || 1000,
    trainingDate: model.trainingDate
  }));
  
  const handleModelToggle = (modelName: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelName)) {
        if (prev.length > 1) {
          return prev.filter(m => m !== modelName);
        }
        toast({
          title: "Cannot remove model",
          description: "At least one model must be selected for comparison.",
          variant: "warning"
        });
        return prev;
      } else {
        return [...prev, modelName];
      }
    });
  };
  
  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricId)) {
        if (prev.length > 1) {
          return prev.filter(m => m !== metricId);
        }
        return prev;
      } else if (prev.length < 6) { // Limit to 6 metrics for readability
        return [...prev, metricId];
      } else {
        toast({
          title: "Too many metrics selected",
          description: "You can select up to 6 metrics for comparison.",
          variant: "warning"
        });
        return prev;
      }
    });
  };
  
  const handleDownload = () => {
    // Create CSV content
    const headers = ['Model', 'Version', 'Training Date', 'Dataset Size', ...allMetrics.map(m => m.name)];
    const rows = models.map(model => [
      model.modelName,
      model.version,
      model.trainingDate.toISOString().split('T')[0],
      model.datasetSize.toString(),
      ...allMetrics.map(metric => (model.metrics[metric.id] || 0).toString())
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ai-model-comparison-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Report Downloaded",
      description: "AI Model comparison data has been exported to CSV.",
      variant: "success"
    });
  };
  
  const getUniqueModelNames = () => {
    const uniqueNames = Array.from(new Set(models.map(model => model.modelName)));
    return uniqueNames;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <CardTitle className="text-lg">AI Model Performance Evaluation</CardTitle>
            <CardDescription>
              Compare metrics across different AI model versions
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="text-sm font-medium mb-1 mr-2">Models:</div>
          {getUniqueModelNames().map(modelName => (
            <div 
              key={modelName}
              onClick={() => handleModelToggle(modelName)}
              className={`px-3 py-1 text-sm rounded-full transition-colors cursor-pointer ${
                selectedModels.includes(modelName) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {modelName}
            </div>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="text-sm font-medium mb-1 mr-2">Metrics:</div>
          {allMetrics.slice(0, 8).map(metric => (
            <div 
              key={metric.id}
              onClick={() => handleMetricToggle(metric.id)}
              title={metric.description}
              className={`px-3 py-1 text-sm rounded-full transition-colors cursor-pointer ${
                selectedMetrics.includes(metric.id) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {metric.name}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="radar">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="radar" className="flex items-center">
              <PieChart className="mr-2 h-4 w-4" />
              Radar Comparison
            </TabsTrigger>
            <TabsTrigger value="scatter" className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Accuracy vs. Speed
            </TabsTrigger>
            <TabsTrigger value="data">Data Table</TabsTrigger>
          </TabsList>
          
          <TabsContent value="radar">
            {filteredModels.length > 0 && selectedMetrics.length > 0 ? (
              <RadarChart 
                data={transformedRadarData}
                dataKeys={filteredModels.map(m => `${m.modelName} v${m.version}`)}
                nameKey="category"
                height={350}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Select at least one model and one metric to visualize
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="scatter">
            <BubbleChart
              data={bubbleData}
              xAxis={{ dataKey: "xAxis", name: "Accuracy (%)" }}
              yAxis={{ dataKey: "yAxis", name: "Response Time (ms)" }}
              zAxis={{ dataKey: "zAxis", name: "Dataset Size", range: [40, 200] }}
              groups={getUniqueModelNames().map((name, index) => ({ name }))}
              height={350}
            />
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Bubble size represents the number of examples in the training dataset</p>
            </div>
          </TabsContent>
          
          <TabsContent value="data">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Training Date</TableHead>
                    <TableHead>Dataset Size</TableHead>
                    {selectedMetrics.map(metricId => (
                      <TableHead key={metricId}>
                        {allMetrics.find(m => m.id === metricId)?.name || metricId}
                      </TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModels.map(model => (
                    <TableRow key={`${model.modelName}-${model.version}`}>
                      <TableCell className="font-medium">{model.modelName}</TableCell>
                      <TableCell>v{model.version}</TableCell>
                      <TableCell>{model.trainingDate.toLocaleDateString()}</TableCell>
                      <TableCell>{model.datasetSize.toLocaleString()}</TableCell>
                      {selectedMetrics.map(metricId => (
                        <TableCell key={metricId}>
                          {model.metrics[metricId]?.toFixed(2) || 'N/A'}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        {onModelSelect && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onModelSelect(model.modelName, model.version)}
                          >
                            Select
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        {onModelSelect && (
          <div className="mt-6 border-t pt-4">
            <div className="text-sm font-medium mb-2">Deploy AI Model</div>
            <div className="flex space-x-4">
              <Select 
                onValueChange={(value) => {
                  const [modelName, version] = value.split('|');
                  onModelSelect(modelName, version);
                }}
                defaultValue={`${models[0]?.modelName}|${models[0]?.version}`}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select model to deploy" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem 
                      key={`${model.modelName}-${model.version}`} 
                      value={`${model.modelName}|${model.version}`}
                    >
                      {model.modelName} v{model.version} - Accuracy: {model.metrics.accuracy?.toFixed(1)}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button className="ml-2">
                Deploy Selected Model
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIModelEvaluationCard;
