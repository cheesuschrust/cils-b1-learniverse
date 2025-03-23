
import React from 'react';
import { Helmet } from 'react-helmet-async';
import LearningCalendar from '@/components/calendar/LearningCalendar';

const Calendar = () => {
  return (
    <>
      <Helmet>
        <title>Learning Calendar | Language Learning Platform</title>
      </Helmet>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Your Learning Calendar</h1>
        <div className="bg-card rounded-lg shadow-sm p-6">
          <LearningCalendar />
        </div>
      </div>
    </>
  );
};

export default Calendar;
