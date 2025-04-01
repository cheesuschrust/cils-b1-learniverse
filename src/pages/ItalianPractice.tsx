
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ItalianPracticeComponent } from '@/components/ItalianPracticeComponent';
import { useAuth } from '@/contexts/AuthContext';
import { ItalianTestSection, ItalianLevel } from '@/types/core-types';

const sectionDescriptions: Record<ItalianTestSection, string> = {
  grammar: "Practice Italian grammar rules and sentence structures",
  vocabulary: "Expand your Italian vocabulary, especially citizenship-related terms",
  culture: "Learn about Italian culture, traditions, and citizenship knowledge",
  listening: "Improve your Italian listening comprehension skills",
  reading: "Enhance your ability to read and understand Italian texts",
  writing: "Practice writing in Italian with proper grammar and structure",
  speaking: "Develop your Italian speaking skills with pronunciation exercises",
  citizenship: "Specific preparation for the citizenship language requirements"
};

const ItalianPractice: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState<ItalianTestSection>('grammar');
  const [selectedLevel, setSelectedLevel] = useState<ItalianLevel>('intermediate');
  
  const handleSectionChange = (section: ItalianTestSection) => {
    setSelectedSection(section);
  };
  
  const handleLevelChange = (level: ItalianLevel) => {
    setSelectedLevel(level);
  };
  
  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Italian Practice</h1>
          <p className="text-muted-foreground">
            Practice and improve your Italian language skills
          </p>
        </div>
        
        <Button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Practice Options</CardTitle>
            <CardDescription>
              Select section and difficulty level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Section</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(sectionDescriptions) as ItalianTestSection[]).map((section) => (
                    <Button
                      key={section}
                      variant={selectedSection === section ? "default" : "outline"}
                      onClick={() => handleSectionChange(section)}
                      className="justify-start"
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Difficulty</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedLevel === 'beginner' ? "default" : "outline"}
                    onClick={() => handleLevelChange('beginner')}
                  >
                    Beginner
                  </Button>
                  <Button
                    variant={selectedLevel === 'intermediate' ? "default" : "outline"}
                    onClick={() => handleLevelChange('intermediate')}
                  >
                    Intermediate
                  </Button>
                  <Button
                    variant={selectedLevel === 'advanced' ? "default" : "outline"}
                    onClick={() => handleLevelChange('advanced')}
                  >
                    Advanced
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {sectionDescriptions[selectedSection]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)} Practice - {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}
            </CardTitle>
            <CardDescription>
              Complete the exercises to improve your skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ItalianPracticeComponent 
              initialSection={selectedSection}
              level={selectedLevel}
              userId={user?.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ItalianPractice;
