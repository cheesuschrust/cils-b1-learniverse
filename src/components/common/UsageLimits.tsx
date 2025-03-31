
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, CreditCard, Infinity, CheckCircle2 } from "lucide-react";
import UpgradeDialog from "@/components/upgrade/UpgradeDialog";

interface UsageLimitsProps {
  showUpgradeButton?: boolean;
}

const UsageLimits: React.FC<UsageLimitsProps> = ({ showUpgradeButton = true }) => {
  const { user } = useAuth();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  
  // Define usage limits for each question type
  const flashcardLimit = { 
    usedToday: user?.dailyQuestionCounts?.flashcards || 0,
    dailyLimit: user?.subscription === "premium" ? Infinity : 1,
    remaining: user?.subscription === "premium" ? Infinity : Math.max(0, 1 - (user?.dailyQuestionCounts?.flashcards || 0)),
    hasReachedLimit: user?.subscription !== "premium" && (user?.dailyQuestionCounts?.flashcards || 0) >= 1
  };
  
  const multipleChoiceLimit = {
    usedToday: user?.dailyQuestionCounts?.multipleChoice || 0,
    dailyLimit: user?.subscription === "premium" ? Infinity : 1,
    remaining: user?.subscription === "premium" ? Infinity : Math.max(0, 1 - (user?.dailyQuestionCounts?.multipleChoice || 0)),
    hasReachedLimit: user?.subscription !== "premium" && (user?.dailyQuestionCounts?.multipleChoice || 0) >= 1
  };
  
  const listeningLimit = {
    usedToday: user?.dailyQuestionCounts?.listening || 0,
    dailyLimit: user?.subscription === "premium" ? Infinity : 1,
    remaining: user?.subscription === "premium" ? Infinity : Math.max(0, 1 - (user?.dailyQuestionCounts?.listening || 0)),
    hasReachedLimit: user?.subscription !== "premium" && (user?.dailyQuestionCounts?.listening || 0) >= 1
  };
  
  const writingLimit = {
    usedToday: user?.dailyQuestionCounts?.writing || 0,
    dailyLimit: user?.subscription === "premium" ? Infinity : 1,
    remaining: user?.subscription === "premium" ? Infinity : Math.max(0, 1 - (user?.dailyQuestionCounts?.writing || 0)),
    hasReachedLimit: user?.subscription !== "premium" && (user?.dailyQuestionCounts?.writing || 0) >= 1
  };
  
  const speakingLimit = {
    usedToday: user?.dailyQuestionCounts?.speaking || 0,
    dailyLimit: user?.subscription === "premium" ? Infinity : 1,
    remaining: user?.subscription === "premium" ? Infinity : Math.max(0, 1 - (user?.dailyQuestionCounts?.speaking || 0)),
    hasReachedLimit: user?.subscription !== "premium" && (user?.dailyQuestionCounts?.speaking || 0) >= 1
  };
  
  if (!user) {
    return null;
  }
  
  const isPremium = user.subscription === "premium";
  
  if (isPremium) {
    return (
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Infinity className="h-4 w-4 mr-2 text-amber-500" />
            Premium Access
          </CardTitle>
          <CardDescription>Unlimited questions daily</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-amber-800 dark:text-amber-300 text-sm">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Enjoy unlimited access to all content
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const hasReachedAnyLimit = 
    flashcardLimit.usedToday >= 1 || 
    multipleChoiceLimit.usedToday >= 1 || 
    listeningLimit.usedToday >= 1 ||
    writingLimit.usedToday >= 1 ||
    speakingLimit.usedToday >= 1;
  
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            Free Plan Limits
          </CardTitle>
          <CardDescription>1 question per category daily</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Flashcards</span>
              <Badge variant={flashcardLimit.usedToday >= 1 ? "destructive" : "outline"}>
                {flashcardLimit.usedToday}/1
              </Badge>
            </div>
            <Progress value={flashcardLimit.usedToday * 100} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Multiple Choice</span>
              <Badge variant={multipleChoiceLimit.usedToday >= 1 ? "destructive" : "outline"}>
                {multipleChoiceLimit.usedToday}/1
              </Badge>
            </div>
            <Progress value={multipleChoiceLimit.usedToday * 100} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Listening</span>
              <Badge variant={listeningLimit.usedToday >= 1 ? "destructive" : "outline"}>
                {listeningLimit.usedToday}/1
              </Badge>
            </div>
            <Progress value={listeningLimit.usedToday * 100} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Writing</span>
              <Badge variant={writingLimit.usedToday >= 1 ? "destructive" : "outline"}>
                {writingLimit.usedToday}/1
              </Badge>
            </div>
            <Progress value={writingLimit.usedToday * 100} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Speaking</span>
              <Badge variant={speakingLimit.usedToday >= 1 ? "destructive" : "outline"}>
                {speakingLimit.usedToday}/1
              </Badge>
            </div>
            <Progress value={speakingLimit.usedToday * 100} className="h-1" />
          </div>
          
          {hasReachedAnyLimit && (
            <Alert variant="destructive" className="mt-3">
              <AlertTitle>Daily limit reached</AlertTitle>
              <AlertDescription>
                You've used all your free questions for today. New questions will be available tomorrow.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        {showUpgradeButton && (
          <CardFooter>
            <Button className="w-full" size="sm" variant="default" onClick={() => setUpgradeDialogOpen(true)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </CardFooter>
        )}
      </Card>

      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
      />
    </>
  );
};

export default UsageLimits;
