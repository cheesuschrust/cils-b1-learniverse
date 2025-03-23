
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExamResults = () => {
  const { examId } = useParams();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p>View results for exam {examId}</p>
      </CardContent>
    </Card>
  );
};

export default ExamResults;
