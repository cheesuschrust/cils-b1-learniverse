
import React from 'react';
import { Helmet } from "react-helmet-async";
import { BarChart, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Progress() {
  return (
    <>
      <Helmet>
        <title>Learning Progress | CILS B1 Cittadinanza</title>
        <meta name="description" content="Track your Italian language learning progress" />
      </Helmet>
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Learning Progress</h1>
          <p className="text-muted-foreground mt-2">
            Track your Italian language learning journey
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Calendar className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-medium text-lg mb-2">Study Consistency</h3>
              <p className="text-muted-foreground text-sm">
                Track your daily learning streaks and consistency patterns
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BarChart className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-medium text-lg mb-2">Performance Metrics</h3>
              <p className="text-muted-foreground text-sm">
                View detailed analytics of your scores across different exercise types
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <TrendingUp className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-medium text-lg mb-2">Skill Growth</h3>
              <p className="text-muted-foreground text-sm">
                Monitor your progress in vocabulary, grammar, and comprehension
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6 text-center mt-6">
          <h2 className="text-xl font-semibold mb-4">Enhanced Progress Tracking Coming Soon</h2>
          <p className="text-muted-foreground">
            We're currently building comprehensive progress tracking features to help you 
            monitor your Italian learning journey more effectively.
          </p>
        </div>
      </div>
    </>
  );
}
