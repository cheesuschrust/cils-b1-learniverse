
import React, { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle } from "lucide-react";

interface SkillBreakdownProps {
  sections: {
    name: string;
    icon: React.ReactNode;
    skills: Array<{
      name: string;
      score: number;
    }>;
    strengths: string[];
    weaknesses: string[];
  }[];
}

const SkillBreakdown: React.FC<SkillBreakdownProps> = ({ sections }) => {
  const [activeTab, setActiveTab] = useState(sections[0].name.toLowerCase());
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
        {sections.map((section) => (
          <TabsTrigger 
            key={section.name} 
            value={section.name.toLowerCase()}
            className="flex items-center space-x-2"
          >
            {section.icon}
            <span>{section.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {sections.map((section) => (
        <TabsContent 
          key={section.name} 
          value={section.name.toLowerCase()}
          className="space-y-6 pt-4"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Skill Analysis</h3>
              
              <div className="space-y-3">
                {section.skills.map((skill) => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{skill.name}</span>
                      <span className="font-medium">{skill.score}%</span>
                    </div>
                    <Progress value={skill.score} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <h3 className="text-sm font-medium">Strengths</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {section.strengths.map((strength, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <h3 className="text-sm font-medium">Areas to Improve</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {section.weaknesses.map((weakness, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100">
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-md bg-muted/20 border">
              <h3 className="text-sm font-medium mb-2">CILS B1 {section.name} Requirements</h3>
              <p className="text-sm text-muted-foreground">
                {section.name === 'Listening' && 'Ability to understand main points in clear speech on familiar matters. 30-minute test with two recordings covering everyday situations.'}
                {section.name === 'Reading' && 'Ability to understand texts on familiar topics. 40-minute test with three texts of varying lengths covering common subjects.'}
                {section.name === 'Writing' && 'Ability to write simple connected text on familiar topics. 60-minute test with form completion and short essay (80-100 words).'}
                {section.name === 'Speaking' && 'Ability to deal with most situations likely to arise while traveling. 10-minute interview covering personal information and simple opinions.'}
              </p>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default SkillBreakdown;
