
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Lightbulb } from 'lucide-react';

export interface SkillScore {
  name: string;
  score: number;
  targetScore: number;
  recentImprovement?: number;
  icon?: React.ReactNode;
  status: 'passed' | 'needs-improvement' | 'critical';
  recommendations?: string[];
}

interface SkillBreakdownProps {
  skills: SkillScore[];
  examLabel?: string;
}

const SkillBreakdown: React.FC<SkillBreakdownProps> = ({ 
  skills, 
  examLabel = 'CILS B1 Citizenship Exam' 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'needs-improvement':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'needs-improvement':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'passed':
        return 'Passed';
      case 'needs-improvement':
        return 'Needs Practice';
      case 'critical':
        return 'Critical';
      default:
        return 'Unknown';
    }
  };
  
  const calculateOverallReadiness = () => {
    const passedSkills = skills.filter(skill => skill.status === 'passed').length;
    const totalSkills = skills.length;
    const percentage = Math.round((passedSkills / totalSkills) * 100);
    
    if (percentage >= 80) return { status: 'ready', label: 'Ready for Exam' };
    if (percentage >= 50) return { status: 'almost', label: 'Almost Ready' };
    return { status: 'not-ready', label: 'Not Ready Yet' };
  };
  
  const readiness = calculateOverallReadiness();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Skills Breakdown</CardTitle>
        <CardDescription>
          Your proficiency by exam area for {examLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  {skill.icon}
                  <span className="font-medium">{skill.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{skill.score}%</span>
                  {skill.recentImprovement && skill.recentImprovement > 0 && (
                    <Badge variant="outline" className="text-green-600 bg-green-50">
                      +{skill.recentImprovement}%
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Progress 
                  value={skill.score} 
                  max={100} 
                  className="h-2 flex-1" 
                />
                <Badge
                  variant="outline"
                  className={`${getStatusColor(skill.status)} text-xs flex items-center gap-1`}
                >
                  {getStatusIcon(skill.status)}
                  <span>{getStatusLabel(skill.status)}</span>
                </Badge>
              </div>
              
              {skill.status !== 'passed' && skill.recommendations && skill.recommendations.length > 0 && (
                <div className="mt-1 ml-1 text-sm text-muted-foreground flex items-start gap-1">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{skill.recommendations[0]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className={`mt-6 p-4 border rounded-lg ${
          readiness.status === 'ready' ? 'bg-green-50 border-green-200' :
          readiness.status === 'almost' ? 'bg-amber-50 border-amber-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {readiness.status === 'ready' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : readiness.status === 'almost' ? (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">Exam Readiness</p>
                <p className="text-sm text-muted-foreground">Overall assessment</p>
              </div>
            </div>
            <Badge className={
              readiness.status === 'ready' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
              readiness.status === 'almost' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
              'bg-red-100 text-red-800 hover:bg-red-200'
            }>
              {readiness.label}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Target score:</span> {skills[0]?.targetScore}% or higher in each skill area
        </p>
      </CardFooter>
    </Card>
  );
};

export default SkillBreakdown;
