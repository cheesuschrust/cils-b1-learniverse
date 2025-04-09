
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, ArrowRight, BookOpen, Star, Clock, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for reading exercises
const readingExercises = [
  {
    id: 1,
    title: 'Tourist Information',
    description: 'Read about popular tourist destinations in Italy',
    difficulty: 'Beginner',
    category: 'Travel',
    questions: 5,
    timeEstimate: '10 minutes',
    completed: true,
    score: 85
  },
  {
    id: 2,
    title: 'Italian Cuisine',
    description: 'Learn about traditional Italian dishes and cooking methods',
    difficulty: 'Beginner',
    category: 'Food',
    questions: 5,
    timeEstimate: '10 minutes',
    completed: true,
    score: 90
  },
  {
    id: 3,
    title: 'Daily Routines',
    description: 'Read about everyday activities in Italian culture',
    difficulty: 'Beginner',
    category: 'Daily Life',
    questions: 8,
    timeEstimate: '15 minutes',
    completed: true,
    score: 75
  },
  {
    id: 4,
    title: 'Italian Newspaper Article',
    description: 'Read and comprehend an authentic newspaper article',
    difficulty: 'Intermediate',
    category: 'Current Events',
    questions: 5,
    timeEstimate: '15 minutes',
    completed: false,
    score: null
  },
  {
    id: 5,
    title: 'Business Communication',
    description: 'Learn vocabulary and phrases used in Italian business settings',
    difficulty: 'Intermediate',
    category: 'Business',
    questions: 8,
    timeEstimate: '20 minutes',
    completed: false,
    score: null
  },
  {
    id: 6,
    title: 'Italian Literature Excerpt',
    description: 'Read a short passage from classic Italian literature',
    difficulty: 'Advanced',
    category: 'Literature',
    questions: 10,
    timeEstimate: '25 minutes',
    completed: false,
    score: null
  }
];

const ReadingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  
  const completedExercises = readingExercises.filter(ex => ex.completed).length;
  const completionPercentage = Math.round((completedExercises / readingExercises.length) * 100);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const categories = ['all', ...Array.from(new Set(readingExercises.map(ex => ex.category.toLowerCase())))];
  
  const filteredExercises = readingExercises
    .filter(ex => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'completed') return ex.completed;
      if (activeFilter === 'incomplete') return !ex.completed;
      return ex.difficulty.toLowerCase() === activeFilter.toLowerCase();
    })
    .filter(ex => {
      if (categoryFilter === 'all') return true;
      return ex.category.toLowerCase() === categoryFilter.toLowerCase();
    });
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reading Exercises</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/reading/history">
              <Clock className="mr-2 h-4 w-4" />
              History
            </Link>
          </Button>
          <Button asChild>
            <Link to="/reading/practice">
              <BookOpen className="mr-2 h-4 w-4" />
              Practice Mode
            </Link>
          </Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Your Reading Progress</CardTitle>
          <CardDescription>Track your completion of all reading exercises</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{completedExercises} of {readingExercises.length} completed</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} />
          </div>
          {isAuthenticated && completedExercises > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Your average score: {Math.round(readingExercises.filter(ex => ex.completed).reduce((acc, ex) => acc + ex.score!, 0) / completedExercises)}%</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mb-6">
        <Tabs defaultValue="all" onValueChange={setActiveFilter}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value={activeFilter}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise) => (
                  <Card key={exercise.id} className={exercise.completed ? 'border-green-200' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{exercise.title}</CardTitle>
                        <Badge className={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Badge>
                      </div>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {exercise.category}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {exercise.questions} questions
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exercise.timeEstimate}
                        </Badge>
                      </div>
                      
                      {exercise.completed && (
                        <div className="flex items-center text-sm mb-4">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">Your score: {exercise.score}%</span>
                        </div>
                      )}
                      
                      {exercise.completed && (
                        <div className="w-full bg-muted h-2 rounded-full mb-2">
                          <div 
                            className={`h-2 rounded-full ${
                              exercise.score! >= 80 ? 'bg-green-500' : 
                              exercise.score! >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${exercise.score}%` }}
                          ></div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link to={`/reading/exercise/${exercise.id}`}>
                          {exercise.completed ? 'Review Exercise' : 'Start Exercise'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="lg:col-span-3 text-center p-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                  <h3 className="text-lg font-medium mb-2">No exercises found</h3>
                  <p className="text-muted-foreground mb-4">Try changing your filters to see more exercises</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {isAuthenticated && (
        <div className="mt-12 text-center pb-8">
          <h2 className="text-2xl font-bold mb-4">Need help with your reading?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Our AI tutor can provide personalized reading practice tailored to your level and interests.
          </p>
          <Button size="lg" asChild>
            <Link to="/ai-tutor">
              Try AI Reading Coach
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReadingPage;
