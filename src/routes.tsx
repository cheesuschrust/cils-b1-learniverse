
import React from 'react';
import Index from './pages/Index';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Writing from './pages/Writing';
import Speaking from './pages/Speaking';
import Listening from './pages/Listening';
import Reading from './pages/Reading';
import Flashcards from './pages/Flashcards';
import MultipleChoice from './pages/MultipleChoice';
import NotFound from './pages/NotFound';
import ItalianCitizenshipTest from './pages/ItalianCitizenshipTest';

const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/index',
    element: <Index />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/writing',
    element: <Writing />
  },
  {
    path: '/speaking',
    element: <Speaking />
  },
  {
    path: '/listening',
    element: <Listening />
  },
  {
    path: '/reading',
    element: <Reading />
  },
  {
    path: '/flashcards',
    element: <Flashcards />
  },
  {
    path: '/multiple-choice',
    element: <MultipleChoice />
  },
  {
    path: '/citizenship',
    element: <ItalianCitizenshipTest />
  },
  {
    path: '/daily-question',
    element: <Home />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
