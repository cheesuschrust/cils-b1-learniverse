
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMultipleChoice } from '@/hooks/useMultipleChoice';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, X, HelpCircle, ArrowRight, RefreshCw, ChevronRight } from 'lucide-react';

const MultipleChoice = () => {
  const {
    availableSets,
    currentSet,
    currentQuestionIndex,
    selectedOption,
    isSubmitted,
    correctAnswers,
    incorrectAnswers,
    isLoading,
    quizFinished,
    showExplanation,
    attempts,
    startQuiz,
    handleOptionSelect,
    handleSubmit,
    handleNext,
    restartQuiz,
    toggleExplanation,
    currentQuestion
  } = useMultipleChoice();

  const [activeTab, setActiveTab] = useState<string>("sets");

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Multiple Choice Quizzes</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Multiple Choice Quizzes</h1>
        <div>
          <Badge variant="secondary">
            {correctAnswers} Correct
          </Badge>{' '}
          <Badge variant="destructive">
            {incorrectAnswers} Incorrect
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="sets" className="flex-1 sm:flex-none">
            Available Sets
          </TabsTrigger>
          {currentSet && (
            <TabsTrigger value="quiz" className="flex-1 sm:flex-none">
              Current Quiz
            </TabsTrigger>
          )}
          <TabsTrigger value="history" className="flex-1 sm:flex-none">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sets">
          <Card>
            <CardHeader>
              <CardTitle>Available Question Sets</CardTitle>
              <CardDescription>Choose a set to start the quiz</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading question sets...</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {availableSets.map((set) => (
                    <Card key={set.id} className="hover:bg-accent transition-colors cursor-pointer" onClick={() => startQuiz(set.id)}>
                      <CardHeader>
                        <CardTitle>{set.title}</CardTitle>
                        <CardDescription>{set.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Category: {set.category}</p>
                        <p className="text-sm text-muted-foreground">Difficulty: {set.difficulty}</p>
                      </CardContent>
                      <CardFooter className="text-right">
                        <Button variant="secondary" size="sm">
                          Start Quiz <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {currentSet && (
          <TabsContent value="quiz">
            {quizFinished ? (
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Finished!</CardTitle>
                  <CardDescription>You have completed the quiz.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    You got {correctAnswers} correct out of {currentSet.questions.length} questions.
                  </p>
                  <Button onClick={restartQuiz}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Restart Quiz
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Question {currentQuestionIndex + 1} / {currentSet.questions.length}</CardTitle>
                  <CardDescription>{currentSet.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentQuestion && (
                    <div className="space-y-4">
                      <p className="text-lg font-semibold">{currentQuestion.question}</p>
                      <div className="grid gap-2">
                        {currentQuestion.options.map((option) => (
                          <Button
                            key={option}
                            variant={selectedOption === option ? 'outline' : 'secondary'}
                            className="justify-start"
                            onClick={() => handleOptionSelect(option)}
                            disabled={isSubmitted}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <Button onClick={handleSubmit} disabled={isSubmitted}>
                          {isSubmitted ? 'Submitted' : 'Submit'}
                        </Button>
                        <Progress value={((currentQuestionIndex + 1) / currentSet.questions.length) * 100} />
                      </div>
                      {isSubmitted && currentQuestion.explanation && (
                        <div className="mt-4">
                          <Button variant="link" onClick={toggleExplanation}>
                            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                          </Button>
                          {showExplanation && (
                            <Card className="mt-2">
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  <HelpCircle className="mr-2 inline-block h-4 w-4" />
                                  Explanation: {currentQuestion.explanation}
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleNext} disabled={!isSubmitted}>
                    Next Question <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        )}

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Quiz History</CardTitle>
              <CardDescription>Review your past quiz attempts</CardDescription>
            </CardHeader>
            <CardContent>
              {attempts.length === 0 ? (
                <p>No quiz attempts yet.</p>
              ) : (
                <ul>
                  {attempts.map((attempt) => (
                    <li key={attempt.id} className="py-2 border-b last:border-b-0">
                      <p>
                        {attempt.questionSetId} - Score: {attempt.score} / {attempt.totalQuestions}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Completed at: {attempt.completedAt.toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultipleChoice;
