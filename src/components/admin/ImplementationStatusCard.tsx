
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { implementationPlanStatus } from '@/data/implementationPlan';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'in-progress':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'pending':
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

const ImplementationStatusCard: React.FC = () => {
  // Calculate overall progress
  const totalProgress = implementationPlanStatus.reduce(
    (acc, section) => acc + section.progress,
    0
  );
  const overallProgress = Math.round(totalProgress / implementationPlanStatus.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Implementation Progress</span>
          <span className="text-lg">{overallProgress}% Complete</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {implementationPlanStatus.map((section, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  {getStatusIcon(section.status)}
                  <span className="ml-2 font-medium">{section.name}</span>
                </div>
                <span className="text-sm">{section.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    section.status === 'completed'
                      ? 'bg-green-500'
                      : section.status === 'in-progress'
                      ? 'bg-blue-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${section.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImplementationStatusCard;
