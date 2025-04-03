
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Lightbulb, BookOpen, MessageSquare, Headphones, Edit } from 'lucide-react';

interface SkillScore {
  name: string;
  score: number;
  icon: React.ReactNode;
  passingScore: number;
  lastImprovement?: string;
  color: string;
}

interface SkillBreakdownProps {
  skills: SkillScore[];
  onSkillSelect?: (skillName: string) => void;
  showRecommendations?: boolean;
}

const SkillBreakdown: React.FC<SkillBreakdownProps> = ({
  skills,
  onSkillSelect,
  showRecommendations = true
}) => {
  // Find the lowest scoring skill
  const lowestSkill = skills.reduce(
    (lowest, current) => 
      current.score < lowest.score ? current : lowest,
    skills[0]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
        <CardDescription>Your progress across different CILS exam sections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {skills.map((skill) => {
            const isPassing = skill.score >= skill.passingScore;
            
            return (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md ${skill.color}`}>
                      {skill.icon}
                    </div>
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={isPassing ? "outline" : "secondary"} className={isPassing ? "text-green-600" : "text-orange-500"}>
                      {isPassing ? "Passing" : `${skill.passingScore - skill.score}% to pass`}
                    </Badge>
                    <span className="font-medium">{skill.score}%</span>
                  </div>
                </div>
                
                <Progress 
                  value={skill.score} 
                  max={100}
                  className="h-2"
                  fill={isPassing ? "bg-green-500" : "bg-amber-500"}
                />
                
                {skill.lastImprovement && (
                  <p className="text-xs text-muted-foreground">
                    Last improvement: {skill.lastImprovement}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        
        {showRecommendations && lowestSkill && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-amber-600" />
              </div>
              <h3 className="font-medium">Recommended Focus Area</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              We recommend focusing on improving your <span className="font-medium">{lowestSkill.name}</span> skills to increase your overall readiness.
            </p>
            {onSkillSelect && (
              <Button 
                onClick={() => onSkillSelect(lowestSkill.name.toLowerCase())}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Practice {lowestSkill.name}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillBreakdown;
