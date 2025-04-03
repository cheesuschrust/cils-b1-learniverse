
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BubbleChart } from '@/components/admin/charts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, RefreshCw } from 'lucide-react';

interface ModelEvaluationMetric {
  modelName: string;
  version: string;
  accuracy: number;
  latency: number;
  dataSize: number;
  trainTime: number;
  costPerThousand: number;
  date: string;
}

interface AIModelEvaluationCardProps {
  metrics?: ModelEvaluationMetric[];
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

const DEFAULT_METRICS: ModelEvaluationMetric[] = [
  {
    modelName: "GPT-4o",
    version: "1.0",
    accuracy: 92.5,
    latency: 450,
    dataSize: 5000,
    trainTime: 48.2,
    costPerThousand: 8.2,
    date: "2025-03-12"
  },
  {
    modelName: "GPT-4o",
    version: "1.1",
    accuracy: 94.1,
    latency: 420,
    dataSize: 7500,
    trainTime: 52.5,
    costPerThousand: 7.9,
    date: "2025-03-20"
  },
  {
    modelName: "Custom-Italian-T5",
    version: "2.0",
    accuracy: 89.3,
    latency: 180,
    dataSize: 3200,
    trainTime: 36.7,
    costPerThousand: 3.5,
    date: "2025-03-15"
  },
  {
    modelName: "Custom-Italian-T5",
    version: "2.1",
    accuracy: 91.4,
    latency: 185,
    dataSize: 4100,
    trainTime: 39.2,
    costPerThousand: 3.2,
    date: "2025-03-25"
  },
  {
    modelName: "Mistral-Italian",
    version: "1.0",
    accuracy: 87.8,
    latency: 210,
    dataSize: 2800,
    trainTime: 28.5,
    costPerThousand: 2.8,
    date: "2025-03-10"
  },
  {
    modelName: "Mistral-Italian",
    version: "1.1",
    accuracy: 90.2,
    latency: 195,
    dataSize: 3600,
    trainTime: 32.3,
    costPerThousand: 2.6,
    date: "2025-03-22"
  }
];

const AIModelEvaluationCard: React.FC<AIModelEvaluationCardProps> = ({
  metrics = DEFAULT_METRICS,
  isLoading = false,
  onRefresh,
  className = ''
}) => {
  const [xMetric, setXMetric] = useState<string>('accuracy');
  const [yMetric, setYMetric] = useState<string>('latency');
  const [zMetric, setZMetric] = useState<string>('dataSize');
  const { toast } = useToast();
  
  const metricOptions = [
    { value: 'accuracy', label: 'Accuracy (%)', unit: '%' },
    { value: 'latency', label: 'Latency (ms)', unit: 'ms' },
    { value: 'dataSize', label: 'Training Data Size', unit: '' },
    { value: 'trainTime', label: 'Training Time (hrs)', unit: ' hrs' },
    { value: 'costPerThousand', label: 'Cost per 1K tokens ($)', unit: '$' },
  ];
  
  const getMetricUnit = (metricName: string) => {
    const metric = metricOptions.find(m => m.value === metricName);
    return metric?.unit || '';
  };
  
  const handleExportData = () => {
    toast({
      title: "Data exported",
      description: "Model evaluation metrics have been exported to CSV"
    });
  };
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      toast({
        title: "Data refreshed",
        description: "Model evaluation metrics have been updated"
      });
    }
  };
  
  // Group models by their name for the chart
  const modelNames = [...new Set(metrics.map(m => m.modelName))];
  const chartGroups = modelNames.map(name => ({ name }));
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <CardTitle>AI Model Performance Evaluation</CardTitle>
            <CardDescription>Compare different AI models across various metrics</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1 block">X-Axis Metric</label>
            <Select defaultValue={xMetric} onValueChange={setXMetric}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metricOptions.map(option => (
                  <SelectItem key={`x-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1 block">Y-Axis Metric</label>
            <Select defaultValue={yMetric} onValueChange={setYMetric}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metricOptions.map(option => (
                  <SelectItem key={`y-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1 block">Bubble Size</label>
            <Select defaultValue={zMetric} onValueChange={setZMetric}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metricOptions.map(option => (
                  <SelectItem key={`z-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <BubbleChart
          data={metrics}
          xAxis={{ 
            dataKey: xMetric, 
            name: metricOptions.find(m => m.value === xMetric)?.label,
            unit: getMetricUnit(xMetric)
          }}
          yAxis={{ 
            dataKey: yMetric, 
            name: metricOptions.find(m => m.value === yMetric)?.label,
            unit: getMetricUnit(yMetric)
          }}
          zAxis={{ 
            dataKey: zMetric, 
            name: metricOptions.find(m => m.value === zMetric)?.label,
            range: [40, 400] 
          }}
          groups={chartGroups}
          height={400}
        />
        
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Version</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accuracy</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Latency</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data Size</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {metrics.map((metric, idx) => (
                <tr key={`${metric.modelName}-${metric.version}-${idx}`}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{metric.modelName}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{metric.version}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{metric.accuracy}%</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{metric.latency} ms</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{metric.dataSize.toLocaleString()}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">${metric.costPerThousand.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIModelEvaluationCard;
