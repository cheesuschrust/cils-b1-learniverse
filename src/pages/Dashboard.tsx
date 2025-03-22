
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
  Mic
} from "lucide-react";
import ProgressCard from "@/components/ui/ProgressCard";
import { useToast } from "@/components/ui/use-toast";
import DashboardHeader from "@/components/ui/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";

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

// User progress interface
interface UserProgress {
  flashcards: { value: number, maxValue: number },
  multipleChoice: { value: number, maxValue: number },
  listening: { value: number, maxValue: number },
  writing: { value: number, maxValue: number },
}

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [wordOfTheDay, setWordOfTheDay] = useState<WordOfTheDay | null>(null);
  const [upcomingLessons, setUpcomingLessons] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    flashcards: { value: 0, maxValue: 200 },
    multipleChoice: { value: 0, maxValue: 50 },
    listening: { value: 0, maxValue: 30 },
    writing: { value: 0, maxValue: 20 },
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Helper function to get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "flashcards":
        return <Book className="h-4 w-4 text-primary" />;
      case "multiple-choice":
        return <CheckSquare className="h-4 w-4 text-primary" />;
      case "listening":
        return <Headphones className="h-4 w-4 text-primary" />;
      case "writing":
        return <Pen className="h-4 w-4 text-primary" />;
      case "speaking":
        return <Mic className="h-4 w-4 text-primary" />;
      default:
        return <Book className="h-4 w-4 text-primary" />;
    }
  };
  
  // Helper function to get result icon
  const getResultIcon = (result: "correct" | "incorrect" | "completed") => {
    switch (result) {
      case "correct":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "incorrect":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "completed":
        return <Clock className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };
  
  // Handler for viewing calendar
  const handleViewCalendar = () => {
    navigate("/calendar");
  };
  
  // Fetch user data and progress on component mount
  useEffect(() => {
    if (user) {
      setUserName(user.firstName || user.email.split('@')[0]);
      
      // Fetch user progress from API or local storage
      // In a real app, this would be an API call
      const fetchUserProgress = async () => {
        try {
          // Mock API call - in a real app this would fetch from backend
          // Here we're just simulating with localStorage for demo purposes
          const storedProgress = localStorage.getItem('userProgress');
          
          if (storedProgress) {
            setUserProgress(JSON.parse(storedProgress));
          } else {
            // Initialize with default progress for new users
            const initialProgress = {
              flashcards: { value: 5, maxValue: 200 },
              multipleChoice: { value: 3, maxValue: 50 },
              listening: { value: 1, maxValue: 30 },
              writing: { value: 0, maxValue: 20 },
            };
            
            setUserProgress(initialProgress);
            localStorage.setItem('userProgress', JSON.stringify(initialProgress));
          }
        } catch (error) {
          console.error("Error fetching user progress:", error);
        }
      };
      
      fetchUserProgress();
      
      // Fetch recent activities
      const fetchRecentActivities = async () => {
        try {
          // Mock API call
          const storedActivities = localStorage.getItem('recentActivities');
          
          if (storedActivities) {
            setRecentActivities(JSON.parse(storedActivities));
          } else {
            // Default activities for new users
            const initialActivities: Activity[] = [
              {
                id: 1,
                type: "multiple-choice",
                title: "Citizenship Rights Question",
                date: "Today",
                result: "correct",
              }
            ];
            
            setRecentActivities(initialActivities);
            localStorage.setItem('recentActivities', JSON.stringify(initialActivities));
          }
        } catch (error) {
          console.error("Error fetching recent activities:", error);
        }
      };
      
      fetchRecentActivities();
    } else {
      // Fallback for users who aren't logged in - this shouldn't happen with ProtectedRoute
      setUserName("User");
    }
    
    // Set word of the day - this would typically come from a backend API
    setWordOfTheDay({
      word: "libertà",
      translation: "freedom",
      partOfSpeech: "noun",
      example: "La libertà è un diritto fondamentale.",
      exampleTranslation: "Freedom is a fundamental right."
    });

    // Set upcoming lessons - these would typically come from a calendar API
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
      }
    ]);
  }, [user]);
  
  // Update progress stats based on user progress state
  const progressStats = [
    {
      title: "Flashcards Mastered",
      value: userProgress.flashcards.value,
      maxValue: userProgress.flashcards.maxValue,
      icon: <Book className="h-5 w-5 text-primary" />,
    },
    {
      title: "Multiple Choice Accuracy",
      value: userProgress.multipleChoice.value,
      maxValue: userProgress.multipleChoice.maxValue,
      icon: <CheckSquare className="h-5 w-5 text-primary" />,
    },
    {
      title: "Listening Comprehension",
      value: userProgress.listening.value,
      maxValue: userProgress.listening.maxValue,
      icon: <Headphones className="h-5 w-5 text-primary" />,
    },
    {
      title: "Writing Exercises",
      value: userProgress.writing.value,
      maxValue: userProgress.writing.maxValue,
      icon: <Pen className="h-5 w-5 text-primary" />,
    },
  ];
  
  // Function to record user activity and progress
  const recordActivity = (activityType: string, title: string, result: "correct" | "incorrect" | "completed") => {
    // Create new activity
    const newActivity = {
      id: Date.now(),
      type: activityType,
      title,
      date: "Today",
      result,
    };
    
    // Update recent activities
    const updatedActivities = [newActivity, ...recentActivities].slice(0, 10);
    setRecentActivities(updatedActivities);
    localStorage.setItem('recentActivities', JSON.stringify(updatedActivities));
    
    // Update progress based on activity type and result
    if (result === "correct" || result === "completed") {
      const updatedProgress = {...userProgress};
      
      switch (activityType) {
        case "flashcards":
          updatedProgress.flashcards.value = Math.min(
            updatedProgress.flashcards.value + 1,
            updatedProgress.flashcards.maxValue
          );
          break;
        case "multiple-choice":
          updatedProgress.multipleChoice.value = Math.min(
            updatedProgress.multipleChoice.value + 1,
            updatedProgress.multipleChoice.maxValue
          );
          break;
        case "listening":
          updatedProgress.listening.value = Math.min(
            updatedProgress.listening.value + 1,
            updatedProgress.listening.maxValue
          );
          break;
        case "writing":
          updatedProgress.writing.value = Math.min(
            updatedProgress.writing.value + 1,
            updatedProgress.writing.maxValue
          );
          break;
      }
      
      setUserProgress(updatedProgress);
      localStorage.setItem('userProgress', JSON.stringify(updatedProgress));
    }
  };
  
  // Calculate overall progress based on user progress data
  const overallProgress = Math.round(
    (
      (userProgress.flashcards.value / userProgress.flashcards.maxValue) +
      (userProgress.multipleChoice.value / userProgress.multipleChoice.maxValue) +
      (userProgress.listening.value / userProgress.listening.maxValue) +
      (userProgress.writing.value / userProgress.writing.maxValue)
    ) / 4 * 100
  );

  // Handle click on "Start Today's Lesson" button with progress tracking
  const handleStartTodaysLesson = () => {
    toast({
      title: "Starting today's lesson",
      description: "Preparing your personalized learning content...",
    });
    
    // Find the category with lowest progress to focus on
    const lowestProgressCategory = [...progressStats].sort((a, b) => 
      (a.value / a.maxValue) - (b.value / b.maxValue)
    )[0];

    // Determine which page to navigate to based on the category
    let targetPage = "/flashcards";
    let activityType = "flashcards";
    
    if (lowestProgressCategory.title.includes("Multiple Choice")) {
      targetPage = "/multiple-choice";
      activityType = "multiple-choice";
    } else if (lowestProgressCategory.title.includes("Listening")) {
      targetPage = "/listening";
      activityType = "listening";
    } else if (lowestProgressCategory.title.includes("Writing")) {
      targetPage = "/writing";
      activityType = "writing";
    }

    // Record that user started a lesson
    recordActivity(
      activityType,
      `${lowestProgressCategory.title} Exercise`,
      "completed"
    );

    setTimeout(() => {
      navigate(targetPage);
    }, 1500);
  };

  // Handle click on activity items with progress tracking
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
    <div className="container mx-auto px-4 sm:px-6 py-8 pt-20 md:pt-24">
      <DashboardHeader 
        userName={userName}
        onViewCalendar={handleViewCalendar}
        onStartLesson={handleStartTodaysLesson}
      />
      
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full lg:w-2/3 mt-6 lg:mt-0">
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

                {/* Challenge items */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
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
