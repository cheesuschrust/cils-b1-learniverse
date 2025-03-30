
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Award, Headphones, PenTool, Mic, Brain, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const ExamSection = ({ icon, title, description, progress, href }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  progress: number;
  href: string;
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-3 p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="h-2 mt-2" />
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Link to={href} className="w-full">
          <Button variant="ghost" className="w-full text-sm justify-start">Continue Practice</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  
  // These would come from the database in a real app
  const examSections = [
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: "Reading Comprehension",
      description: "Improve your ability to understand written texts and answer questions.",
      progress: 45,
      href: "/reading"
    },
    {
      icon: <PenTool className="h-5 w-5 text-primary" />,
      title: "Writing Skills",
      description: "Practice expressing yourself through various writing exercises.",
      progress: 30,
      href: "/writing"
    },
    {
      icon: <Headphones className="h-5 w-5 text-primary" />,
      title: "Listening Comprehension",
      description: "Enhance your ability to understand spoken Italian.",
      progress: 60,
      href: "/listening"
    },
    {
      icon: <Mic className="h-5 w-5 text-primary" />,
      title: "Speaking Practice",
      description: "Improve your pronunciation and conversational fluency.",
      progress: 20,
      href: "/speaking"
    },
    {
      icon: <Brain className="h-5 w-5 text-primary" />,
      title: "Grammar & Vocabulary",
      description: "Build your Italian language foundation with key grammar rules and vocabulary.",
      progress: 50,
      href: "/grammar"
    },
    {
      icon: <Trophy className="h-5 w-5 text-primary" />,
      title: "Practice Exams",
      description: "Test your knowledge with full CILS B1 practice examinations.",
      progress: 15,
      href: "/practice-exams"
    }
  ];
  
  const nextExamDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000); // 45 days from now
  const daysUntilExam = Math.floor((nextExamDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  const dailyGoal = 30; // minutes
  const todaysProgress = 20; // minutes
  const streak = 7; // days

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Benvenuto, {user?.firstName || 'Studente'}!
          </h1>
          <p className="text-muted-foreground">
            Track your CILS B1 exam preparation progress
          </p>
        </div>
        <Link to="/practice-exams">
          <Button>Take Practice Exam</Button>
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Exam Countdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-primary mr-2" />
              <div className="text-2xl font-bold">{daysUntilExam} days</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Until your CILS B1 exam</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-xs" size="sm">
              Update Exam Date
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-6 w-6 text-primary mr-2" />
              <div className="text-2xl font-bold">{todaysProgress}/{dailyGoal} min</div>
            </div>
            <Progress value={(todaysProgress / dailyGoal) * 100} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Daily study goal</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-xs" size="sm">
              Adjust Goal
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-6 w-6 text-primary mr-2" />
              <div className="text-2xl font-bold">{streak} days</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Keep up the good work!</p>
          </CardContent>
          <CardFooter>
            <Link to="/achievements" className="w-full">
              <Button variant="outline" className="w-full text-xs" size="sm">
                View Achievements
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Exam Sections</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {examSections.map((section, index) => (
            <ExamSection 
              key={index}
              icon={section.icon}
              title={section.title}
              description={section.description}
              progress={section.progress}
              href={section.href}
            />
          ))}
        </div>
      </div>
      
      <div className="bg-primary/5 rounded-lg p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Ready to test your knowledge?</h3>
          <p className="text-sm text-muted-foreground">Take a full practice exam to assess your readiness for the CILS B1 certification.</p>
        </div>
        <Link to="/practice-exams">
          <Button>Start Practice Exam</Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
