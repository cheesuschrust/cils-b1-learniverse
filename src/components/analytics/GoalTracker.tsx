
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Target, Trophy } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useToast } from '@/components/ui/use-toast';

interface GoalTrackerProps {
  goals: Array<{
    id: string;
    title: string;
    description?: string;
    goal_type: string;
    target_value: number;
    start_date: string;
    end_date?: string;
    progress: number;
    created_at: string;
  }>;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ goals }) => {
  const { saveGoal, refreshData } = useAnalytics();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    goalType: 'questions_answered',
    targetValue: 50,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd')
  });

  const activeGoals = goals.filter(goal => goal.progress < 100);
  const completedGoals = goals.filter(goal => goal.progress >= 100);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await saveGoal({
        goalType: formState.goalType,
        targetValue: Number(formState.targetValue),
        startDate: formState.startDate,
        endDate: formState.endDate,
        title: formState.title,
        description: formState.description
      });
      
      toast({
        title: "Goal created",
        description: "Your new learning goal has been created successfully."
      });
      
      setDialogOpen(false);
      setFormState({
        title: '',
        description: '',
        goalType: 'questions_answered',
        targetValue: 50,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd')
      });
      
      refreshData();
    } catch (error) {
      toast({
        title: "Error creating goal",
        description: "There was a problem creating your goal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getGoalTypeLabel = (type: string): string => {
    switch (type) {
      case 'questions_answered':
        return 'Questions Answered';
      case 'mastery_score':
        return 'Mastery Score';
      case 'study_days':
        return 'Study Days';
      default:
        return type;
    }
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'questions_answered':
        return <Target className="h-5 w-5 text-blue-500" />;
      case 'mastery_score':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'study_days':
        return <Calendar className="h-5 w-5 text-green-500" />;
      default:
        return <Target className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Learning Goals</h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Learning Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input 
                  id="title" 
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  placeholder="E.g., Master Italian Verbs"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  placeholder="What do you want to achieve with this goal?"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="goalType">Goal Type</Label>
                <Select 
                  value={formState.goalType} 
                  onValueChange={(value) => handleSelectChange('goalType', value)}
                >
                  <SelectTrigger id="goalType">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="questions_answered">Questions Answered</SelectItem>
                    <SelectItem value="mastery_score">Mastery Score (%)</SelectItem>
                    <SelectItem value="study_days">Study Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="targetValue">Target Value</Label>
                <Input 
                  id="targetValue" 
                  name="targetValue"
                  type="number"
                  min="1"
                  max={formState.goalType === 'mastery_score' ? 100 : 1000}
                  value={formState.targetValue}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    name="startDate"
                    type="date"
                    value={formState.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate" 
                    name="endDate"
                    type="date"
                    value={formState.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Goal</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10 space-y-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium">No Learning Goals Yet</h3>
            <p className="text-center text-muted-foreground">
              Create your first learning goal to track your progress and stay motivated.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active Goals ({activeGoals.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed Goals ({completedGoals.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <div className="grid gap-6 sm:grid-cols-2">
              {activeGoals.length === 0 ? (
                <Card className="sm:col-span-2">
                  <CardContent className="flex items-center justify-center p-10">
                    <p className="text-muted-foreground">No active goals. Create a new goal to get started!</p>
                  </CardContent>
                </Card>
              ) : (
                activeGoals.map(goal => (
                  <Card key={goal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{goal.title}</CardTitle>
                          <CardDescription>
                            {getGoalTypeLabel(goal.goal_type)}
                          </CardDescription>
                        </div>
                        {getGoalIcon(goal.goal_type)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {goal.description}
                        </p>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-medium">{goal.progress}%</span>
                        </div>
                        <Progress 
                          value={goal.progress} 
                          className="h-2"
                          indicatorClassName={getProgressColor(goal.progress)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Target</p>
                          <p className="font-medium">{goal.target_value} {goal.goal_type === 'mastery_score' ? '%' : ''}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deadline</p>
                          <p className="font-medium">{formatDate(goal.end_date || '')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="grid gap-6 sm:grid-cols-2">
              {completedGoals.length === 0 ? (
                <Card className="sm:col-span-2">
                  <CardContent className="flex items-center justify-center p-10">
                    <p className="text-muted-foreground">You haven't completed any goals yet.</p>
                  </CardContent>
                </Card>
              ) : (
                completedGoals.map(goal => (
                  <Card key={goal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{goal.title}</CardTitle>
                          <CardDescription>
                            {getGoalTypeLabel(goal.goal_type)}
                          </CardDescription>
                        </div>
                        {getGoalIcon(goal.goal_type)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Completed</span>
                          <span className="text-sm font-medium">100%</span>
                        </div>
                        <Progress value={100} className="h-2 bg-green-500" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Target</p>
                          <p className="font-medium">{goal.target_value} {goal.goal_type === 'mastery_score' ? '%' : ''}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Completed On</p>
                          <p className="font-medium">{formatDate(goal.end_date || '')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </>
  );
};

export default GoalTracker;
