
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Video, HelpCircle, MessageSquare, FileText, ArrowRight } from 'lucide-react';

interface HelpTopicProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const HelpTopic: React.FC<HelpTopicProps> = ({
  title,
  description,
  icon,
  link
}) => {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="min-h-[60px]">{description}</CardDescription>
        <Button variant="link" className="p-0 h-auto mt-2" asChild>
          <a href={link}>
            Learn more <ArrowRight className="h-4 w-4 ml-1" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

const HelpCenter: React.FC = () => {
  const helpTopics = [
    {
      title: "Getting Started",
      description: "Learn the basics of the platform and set up your learning plan",
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      link: "#getting-started"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step tutorials for all platform features",
      icon: <Video className="h-5 w-5 text-primary" />,
      link: "#tutorials"
    },
    {
      title: "Common Questions",
      description: "Browse frequently asked questions and answers",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      link: "#faq"
    },
    {
      title: "Live Support",
      description: "Connect with our support team for personalized help",
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      link: "#chat-support"
    },
    {
      title: "User Guide",
      description: "Detailed documentation for all platform features",
      icon: <FileText className="h-5 w-5 text-primary" />,
      link: "#guide"
    },
    {
      title: "Technical Support",
      description: "Get help with technical issues and troubleshooting",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      link: "#technical"
    }
  ];
  
  return (
    <div>
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search for help articles..." 
            className="pl-10 h-12"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {helpTopics.map((topic, index) => (
          <HelpTopic 
            key={index}
            title={topic.title}
            description={topic.description}
            icon={topic.icon}
            link={topic.link}
          />
        ))}
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Popular Topics</CardTitle>
            <CardDescription>
              Most frequently viewed help articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center text-sm hover:underline">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  How to create custom flashcard sets
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-sm hover:underline">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  Troubleshooting audio recording issues
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-sm hover:underline">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  Understanding your progress statistics
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-sm hover:underline">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  How to export your learning data
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-sm hover:underline">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  Setting up daily learning goals
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;
