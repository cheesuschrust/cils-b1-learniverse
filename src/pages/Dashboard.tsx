
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Book,
  CheckSquare,
  Headphones,
  Pen,
  Calendar,
  Award,
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ProgressCard from "@/components/ui/ProgressCard";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: number;
  type: string;
  title: string;
  date: string;
  result: "correct" | "incorrect" | "completed";
}

// Data for word of the day
interface WordOfTheDay {
  word: string;
  translation: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
}

const Dashboard = () => {
  const [userName, setUserName] = useState("User");
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [wordOfTheDay, setWordOfTheDay] = useState<WordOfTheDay | null>(null);
  const [upcomingLessons, setUpcomingLessons] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Simulate fetching user data on component mount
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      setUserName("Marco");
      
      setRecentActivities([
        {
          id: 1,
          type: "multiple-choice",
          title: "Citizenship Rights Question",
          date: "Today",
          result: "correct",
        },
        {
          id: 2,
          type: "writing",
          title: "Short Essay on Italian Culture",
          date: "Yesterday",
          result: "completed",
        },
        {
          id: 3,
          type: "flashcards",
          title: "Government Vocabulary",
          date: "Yesterday",
          result: "completed",
        },
        {
          id: 4,
          type: "listening",
          title: "News Report Comprehension",
          date: "2 days ago",
          result: "incorrect",
        },
      ]);

      // Set word of the day
      setWordOfTheDay({
        word: "libertà",
        translation: "freedom",
        partOfSpeech: "noun",
        example: "La libertà è un diritto fondamentale.",
        exampleTranslation: "Freedom is a fundamental right."
      });

      // Set upcoming lessons
      setUpcomingLessons([
        {
          id: 1,
          title: "Italian Grammar Basics",
          date: new Date(Date.now() + 86400000),
          duration: 30,
          type: "Grammar"
        },
        {
          id: 2,
          title: "Conversation Practice",
          date: new Date(Date.now() + 86400000 * 2),
          duration: 45,
          type: "Speaking"
        },
        {
          id: 3,
          title: "Italian Culture: Food",
          date: new Date(Date.now() + 86400000 * 3),
          duration: 60,
          type: "Culture"
        }
      ]);
    }, 500);
  }, []);
  
  const progressStats = [
    {
      title: "Flashcards Mastered",
      value: 85,
      maxValue: 200,
      icon: <Book className="h-5 w-5 text-primary" />,
    },
    {
      title: "Multiple Choice Accuracy",
      value: 42,
      maxValue: 50,
      icon: <CheckSquare className="h-5 w-5 text-primary" />,
    },
    {
      title: "Listening Comprehension",
      value: 18,
      maxValue: 30,
      icon: <Headphones className="h-5 w-5 text-primary" />,
    },
    {
      title: "Writing Exercises",
      value: 12,
      maxValue: 20,
      icon: <Pen className="h-5 w-5 text-primary" />,
    },
  ];
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "flashcards":
        return <Book className="h-5 w-5" />;
      case "multiple-choice":
        return <CheckSquare className="h-5 w-5" />;
      case "listening":
        return <Headphones className="h-5 w-5" />;
      case "writing":
        return <Pen className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };
  
  const getResultIcon = (result: string) => {
    switch (result) {
      case "correct":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "incorrect":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "completed":
        return <Clock className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };
  
  // Calculate overall progress based on all categories
  const overallProgress = Math.round(
    ((85 / 200) + (42 / 50) + (18 / 30) + (12 / 20)) / 4 * 100
  );

  // Handle click on "Start Today's Lesson" button
  const handleStartTodaysLesson = () => {
    toast({
      title: "Starting today's lesson",
      description: "Preparing your personalized learning content...",
    });
    // Navigate to the first lesson type based on user's progress
    const lowestProgressCategory = [...progressStats].sort((a, b) => 
      (a.value / a.maxValue) - (b.value / b.maxValue)
    )[0];

    // Determine which page to navigate to based on the category
    let targetPage = "/flashcards";
    if (lowestProgressCategory.title.includes("Multiple Choice")) {
      targetPage = "/multiple-choice";
    } else if (lowestProgressCategory.title.includes("Listening")) {
      targetPage = "/listening";
    } else if (lowestProgressCategory.title.includes("Writing")) {
      targetPage = "/writing";
    }

    setTimeout(() => {
      navigate(targetPage);
    }, 1500);
  };

  // Handle click on "View Calendar" button
  const handleViewCalendar = () => {
    if (upcomingLessons.length === 0) {
      toast({
        title: "No scheduled lessons",
        description: "You don't have any upcoming lessons scheduled yet.",
        variant: "destructive",
      });
      return;
    }

    // Display upcoming lessons in a toast notification
    toast({
      title: "Upcoming Lessons",
      description: (
        <div className="space-y-2 mt-2">
          {upcomingLessons.map((lesson) => (
            <div key={lesson.id} className="text-sm bg-background p-2 rounded-md border">
              <div className="font-medium">{lesson.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(lesson.date).toLocaleDateString()} - {lesson.duration} minutes
              </div>
            </div>
          ))}
        </div>
      ),
      duration: 5000,
    });
  };

  // Handle click on activity items
  const handleActivityClick = (activity: Activity) => {
    let targetPage = "/flashcards";
    
    switch (activity.type) {
      case "multiple-choice":
        targetPage = "/multiple-choice";
        break;
      case "writing":
        targetPage = "/writing";
        break;
      case "listening":
        targetPage = "/listening";
        break;
      default:
        targetPage = "/flashcards";
    }

    toast({
      title: "Opening activity",
      description: `Loading ${activity.title}...`,
    });

    setTimeout(() => {
      navigate(targetPage);
    }, 1000);
  };
  
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and continue your Italian learning journey
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleViewCalendar}>
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button size="sm" onClick={handleStartTodaysLesson}>
            <Zap className="mr-2 h-4 w-4" />
            Start Today's Lesson
          </Button>
        </div>
      </div>
      
      {/* Progress Overview */}
      <div className="mb-8 animate-fade-up">
        <Card className="bg-gradient-to-r from-primary/5 to-accent/20 backdrop-blur-sm border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Your Progress</CardTitle>
            <CardDescription>
              You're making great progress toward CILS B1 readiness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-4">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-secondary/50 stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    <circle
                      className="text-primary stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgress / 100)}`}
                      style={{ 
                        transformOrigin: "center", 
                        transform: "rotate(-90deg)",
                        transition: "stroke-dashoffset 1s ease-in-out" 
                      }}
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{overallProgress}%</span>
                    <span className="text-sm text-muted-foreground">Overall Progress</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <Award className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">
                    You're on track for your CILS B1 exam!
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full lg:w-2/3 mt-6 lg:mt-0">
                {progressStats.map((stat, index) => (
                  <ProgressCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    maxValue={stat.maxValue}
                    icon={stat.icon}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Daily Challenges and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Daily Challenges */}
        <div className="lg:col-span-1 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <Card className="h-full backdrop-blur-sm border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Today's Challenges</span>
                <Calendar className="h-5 w-5 text-primary" />
              </CardTitle>
              <CardDescription>Complete these for extra points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wordOfTheDay && (
                  <div className="p-3 bg-primary/10 rounded-lg mb-6">
                    <h4 className="text-sm font-medium mb-2">Word of the Day</h4>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-lg font-bold">{wordOfTheDay.word}</span>
                        <span className="text-xs text-muted-foreground ml-2">({wordOfTheDay.partOfSpeech})</span>
                        <p className="text-sm">{wordOfTheDay.translation}</p>
                        <p className="text-xs mt-2 italic">{wordOfTheDay.example}</p>
                        <p className="text-xs text-muted-foreground">{wordOfTheDay.exampleTranslation}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="rounded-full w-8 h-8 p-0" 
                        onClick={() => {
                          toast({
                            title: "Word saved to your vocabulary list",
                            description: `"${wordOfTheDay.word}" has been added to your collection.`,
                          });
                        }}
                      >
                        <Book className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-accent/30 mr-3">
                      <Book className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Practice Flashcards</h4>
                      <p className="text-xs text-muted-foreground">
                        Review 10 new vocabulary words
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      toast({
                        title: "Loading flashcards",
                        description: "Preparing your vocabulary practice...",
                      });
                      setTimeout(() => navigate("/flashcards"), 1000);
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-accent/30 mr-3">
                      <CheckSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Multiple Choice Quiz</h4>
                      <p className="text-xs text-muted-foreground">
                        Complete today's daily challenge
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      toast({
                        title: "Loading quiz",
                        description: "Preparing your citizenship quiz...",
                      });
                      setTimeout(() => navigate("/multiple-choice"), 1000);
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-accent/30 mr-3">
                      <Headphones className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Listening Exercise</h4>
                      <p className="text-xs text-muted-foreground">
                        Complete today's listening challenge
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      toast({
                        title: "Loading listening exercise",
                        description: "Preparing your audio comprehension practice...",
                      });
                      setTimeout(() => navigate("/listening"), 1000);
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-accent/30 mr-3">
                      <Pen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Writing Task</h4>
                      <p className="text-xs text-muted-foreground">
                        Write a short paragraph in Italian
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      toast({
                        title: "Loading writing exercise",
                        description: "Preparing your writing assignment...",
                      });
                      setTimeout(() => navigate("/writing"), 1000);
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <Card className="h-full backdrop-blur-sm border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Recent Activity</span>
                <TrendingUp className="h-5 w-5 text-primary" />
              </CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => handleActivityClick(activity)}
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-accent/30 mr-3">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{activity.title}</h4>
                          <div className="flex items-center">
                            <p className="text-xs text-muted-foreground mr-2">
                              {activity.date}
                            </p>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                              {activity.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getResultIcon(activity.result)}
                        <Button size="sm" variant="ghost">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">No recent activities found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Study Sections */}
      <h2 className="text-2xl font-bold mb-6">Continue Studying</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
        <Link to="/flashcards">
          <Card className="h-full transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] backdrop-blur-sm border-accent/20">
            <CardContent className="p-6">
              <div className="p-3 rounded-full bg-accent/30 w-12 h-12 flex items-center justify-center mb-4">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Flashcards</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Build your vocabulary with interactive flashcards
              </p>
              <div className="mt-auto">
                <Button variant="outline" className="w-full flex justify-between items-center">
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/multiple-choice">
          <Card className="h-full transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] backdrop-blur-sm border-accent/20">
            <CardContent className="p-6">
              <div className="p-3 rounded-full bg-accent/30 w-12 h-12 flex items-center justify-center mb-4">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Multiple Choice</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Test your knowledge with citizenship questions
              </p>
              <div className="mt-auto">
                <Button variant="outline" className="w-full flex justify-between items-center">
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/listening">
          <Card className="h-full transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] backdrop-blur-sm border-accent/20">
            <CardContent className="p-6">
              <div className="p-3 rounded-full bg-accent/30 w-12 h-12 flex items-center justify-center mb-4">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Listening</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Improve your audio comprehension skills
              </p>
              <div className="mt-auto">
                <Button variant="outline" className="w-full flex justify-between items-center">
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/writing">
          <Card className="h-full transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] backdrop-blur-sm border-accent/20">
            <CardContent className="p-6">
              <div className="p-3 rounded-full bg-accent/30 w-12 h-12 flex items-center justify-center mb-4">
                <Pen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Writing</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Practice your Italian writing skills
              </p>
              <div className="mt-auto">
                <Button variant="outline" className="w-full flex justify-between items-center">
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
