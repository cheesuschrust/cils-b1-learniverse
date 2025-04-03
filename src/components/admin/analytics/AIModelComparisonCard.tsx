
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterPlot, RadarChart } from '@/components/admin/charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AIModelPerformance {
  modelName: string;
  accuracy: number;
  latency: number;
  trainingTime?: number;
  confidenceScore: number;
  dataPoints: number;
  memoryUsage?: number;
  contentTypes: {
    flashcards: number;
    multipleChoice: number;
    reading: number;
    writing: number;
    speaking: number;
  };
}

interface AIModelComparisonCardProps {
  models: AIModelPerformance[];
  className?: string;
  onModelSelect?: (modelName: string) => void;
}

const AIModelComparisonCard: React.FC<AIModelComparisonCardProps> = ({
  models,
  className = '',
  onModelSelect
}) => {
  const [selectedModels, setSelectedModels] = React.useState<string[]>(
    models.slice(0, 2).map(m => m.modelName)
  );
  const { toast } = useToast();
  
  const filteredModels = models.filter(m => selectedModels.includes(m.modelName));
  
  // Transform data for scatter plot
  const scatterData = models.map(model => ({
    modelName: model.modelName,
    accuracy: model.accuracy,
    latency: model.latency,
    size: model.dataPoints / 100,
    confidenceScore: model.confidenceScore
  }));
  
  // Transform data for radar chart
  const radarData = filteredModels.map(model => ({
    modelName: model.modelName,
    ...model.contentTypes
  }));
  
  const transformedRadarData = Object.keys(filteredModels[0]?.contentTypes || {}).map(key => {
    const dataPoint: Record<string, any> = { category: key };
    filteredModels.forEach(model => {
      dataPoint[model.modelName] = model.contentTypes[key as keyof typeof model.contentTypes];
    });
    return dataPoint;
  });
  
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
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">AI Model Performance Comparison</CardTitle>
        <CardDescription>
          Compare performance metrics across different AI model versions
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-2">
          {models.map(model => (
            <div 
              key={model.modelName}
              onClick={() => handleModelToggle(model.modelName)}
              className={`px-3 py-1 text-sm rounded-full transition-colors cursor-pointer ${
                selectedModels.includes(model.modelName) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {model.modelName}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="accuracy">
          <TabsList className="mb-4">
            <TabsTrigger value="accuracy">Accuracy vs. Latency</TabsTrigger>
            <TabsTrigger value="content">Content Type Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accuracy">
            <ScatterPlot 
              data={scatterData}
              xDataKey="accuracy"
              yDataKey="latency"
              zDataKey="size"
              nameKey="modelName"
              xAxisLabel="Accuracy (%)"
              yAxisLabel="Latency (ms)"
              height={300}
            />
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Bubble size represents the number of data points used for evaluation</p>
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <RadarChart 
              data={transformedRadarData}
              dataKeys={filteredModels.map(m => m.modelName)}
              nameKey="category"
              height={300}
            />
          </TabsContent>
        </Tabs>
        
        {onModelSelect && (
          <div className="mt-4">
            <Select 
              onValueChange={onModelSelect}
              defaultValue={models[0]?.modelName}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model to deploy" />
              </SelectTrigger>
              <SelectContent>
                {models.map(model => (
                  <SelectItem key={model.modelName} value={model.modelName}>
                    {model.modelName} - Accuracy: {model.accuracy.toFixed(1)}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIModelComparisonCard;
