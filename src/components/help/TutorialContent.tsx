
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Video, ExternalLink, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

export interface TutorialStep {
  id: string;
  title: string;
  titleItalian?: string;
  content: string;
  contentItalian?: string;
  type?: 'text' | 'video' | 'exercise';
  completed?: boolean;
  videoUrl?: string;
  imageUrl?: string;
}

export interface TutorialContentProps {
  title: string;
  titleItalian?: string;
  description: string;
  descriptionItalian?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  author?: string;
  lastUpdated?: Date;
  steps: TutorialStep[];
  relatedTutorials?: Array<{
    id: string;
    title: string;
    titleItalian?: string;
    link: string;
  }>;
  downloadable?: boolean;
  downloadUrl?: string;
}

const TutorialContent: React.FC<TutorialContentProps> = ({
  title,
  titleItalian,
  description,
  descriptionItalian,
  difficulty,
  estimatedTime,
  author,
  lastUpdated,
  steps,
  relatedTutorials,
  downloadable,
  downloadUrl
}) => {
  const { language } = useLanguage();
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return '';
    }
  };
  
  const getDifficultyLabel = () => {
    if (language === 'italian') {
      switch (difficulty) {
        case 'beginner': return 'Principiante';
        case 'intermediate': return 'Intermedio';
        case 'advanced': return 'Avanzato';
        default: return '';
      }
    }
    return difficulty;
  };
  
  const getLocalizedTitle = () => {
    return language === 'italian' && titleItalian ? titleItalian : title;
  };
  
  const getLocalizedDescription = () => {
    return language === 'italian' && descriptionItalian ? descriptionItalian : description;
  };
  
  const getStepContent = (step: TutorialStep) => {
    return language === 'italian' && step.contentItalian ? step.contentItalian : step.content;
  };
  
  const getStepTitle = (step: TutorialStep) => {
    return language === 'italian' && step.titleItalian ? step.titleItalian : step.title;
  };
  
  const getFormattedDate = (date?: Date) => {
    if (!date) return '';
    
    return new Intl.DateTimeFormat(language === 'italian' ? 'it-IT' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge className={getDifficultyColor()}>
            {getDifficultyLabel()}
          </Badge>
          <Badge variant="outline">
            {estimatedTime}
          </Badge>
          {downloadable && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <BilingualText 
                english="Downloadable" 
                italian="Scaricabile" 
              />
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl font-bold mb-3">{getLocalizedTitle()}</h1>
        <p className="text-muted-foreground mb-4">{getLocalizedDescription()}</p>
        
        {(author || lastUpdated) && (
          <div className="flex gap-4 text-sm text-muted-foreground mb-6">
            {author && (
              <div>
                <BilingualText english="By" italian="Di" />: {author}
              </div>
            )}
            {lastUpdated && (
              <div>
                <BilingualText english="Last updated" italian="Ultimo aggiornamento" />: {getFormattedDate(lastUpdated)}
              </div>
            )}
          </div>
        )}
        
        {downloadable && downloadUrl && (
          <Button variant="outline" className="mb-6" asChild>
            <a href={downloadUrl} download>
              <Download className="mr-2 h-4 w-4" />
              <BilingualText 
                english="Download Tutorial PDF" 
                italian="Scarica Tutorial PDF" 
              />
            </a>
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <Card key={step.id} className={step.completed ? "border-green-200" : ""}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <CardTitle className="text-xl">
                  {getStepTitle(step)}
                </CardTitle>
                {step.completed && (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>{getStepContent(step)}</div>
                
                {step.imageUrl && (
                  <div className="my-4">
                    <img 
                      src={step.imageUrl} 
                      alt={getStepTitle(step)} 
                      className="rounded-md max-w-full"
                    />
                  </div>
                )}
                
                {step.type === 'video' && step.videoUrl && (
                  <div className="mt-4">
                    <Button variant="outline" className="flex items-center" asChild>
                      <a href={step.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Video className="mr-2 h-4 w-4" />
                        <BilingualText 
                          english="Watch Video" 
                          italian="Guarda il Video" 
                        />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {relatedTutorials && relatedTutorials.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            <BilingualText 
              english="Related Tutorials" 
              italian="Tutorial Correlati" 
            />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTutorials.map(tutorial => (
              <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">
                    {language === 'italian' && tutorial.titleItalian ? 
                      tutorial.titleItalian : tutorial.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={tutorial.link}>
                      <BilingualText 
                        english="View Tutorial" 
                        italian="Vedi Tutorial" 
                      />
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialContent;
