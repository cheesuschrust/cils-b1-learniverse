
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, CreditCard, Infinity, CheckCircle2 } from "lucide-react";
import UpgradeDialog from "@/components/upgrade/UpgradeDialog";
import { useQuestionLimit } from "@/hooks/useQuestionLimit";

interface UsageLimitsProps {
  showUpgradeButton?: boolean;
}

const UsageLimits: React.FC<UsageLimitsProps> = ({ showUpgradeButton = true }) => {
  const { user } = useAuth();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  
  // Use the hook to get live data for all question types
  const flashcardLimit = useQuestionLimit('flashcards');
  const multipleChoiceLimit = useQuestionLimit('multipleChoice');
  const listeningLimit = useQuestionLimit('listening');
  const writingLimit = useQuestionLimit('writing');
  const speakingLimit = useQuestionLimit('speaking');
  
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
    flashcardLimit.usedQuestions >= 1 || 
    multipleChoiceLimit.usedQuestions >= 1 || 
    listeningLimit.usedQuestions >= 1 ||
    writingLimit.usedQuestions >= 1 ||
    speakingLimit.usedQuestions >= 1;
  
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
              <Badge variant={flashcardLimit.usedQuestions >= 1 ? "destructive" : "outline"}>
                {flashcardLimit.usedQuestions}/1
              </Badge>
            </div>
            <Progress value={flashcardLimit.usedQuestions * 100} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Multiple Choice</span>
              <Badge variant={multipleChoiceLimit.usedQuestions >= 1 ? "destructive" : "outline"}>
                {multipleChoiceLimit.usedQuestions}/1
              </Badge>
            </div>
            <Progress value={multipleChoiceLimit.usedQuestions * 100} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Listening</span>
              <Badge variant={listeningLimit.usedQuestions >= 1 ? "destructive" : "outline"}>
                {listeningLimit.usedQuestions}/1
              </Badge>
            </div>
            <Progress value={listeningLimit.usedQuestions * 100} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Writing</span>
              <Badge variant={writingLimit.usedQuestions >= 1 ? "destructive" : "outline"}>
                {writingLimit.usedQuestions}/1
              </Badge>
            </div>
            <Progress value={writingLimit.usedQuestions * 100} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Speaking</span>
              <Badge variant={speakingLimit.usedQuestions >= 1 ? "destructive" : "outline"}>
                {speakingLimit.usedQuestions}/1
              </Badge>
            </div>
            <Progress value={speakingLimit.usedQuestions * 100} className="h-1" />
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
