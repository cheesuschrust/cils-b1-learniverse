
# Supabase Database Schema

This folder contains the SQL schema for the Supabase database used in the Italian Learning application.

## Tables

The schema defines the following tables:

1. **users** - Stores basic user information, linking to Supabase Auth
2. **user_preferences** - Stores user preferences and settings
3. **user_metrics** - Tracks user learning metrics (questions answered, streak, etc.)
4. **content** - Stores learning content uploaded by users or admins
5. **questions** - Stores individual questions for quizzes
6. **question_sets** - Groups questions into sets for quizzes
7. **question_set_questions** - Links questions to question sets
8. **quiz_attempts** - Records user attempts at quizzes
9. **quiz_answers** - Stores individual answers for each quiz attempt
10. **usage_tracking** - Tracks daily usage of features for implementing limits
11. **daily_questions** - Stores the question of the day

## Setting Up the Database

To set up this schema in your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `schema.sql` 
4. Paste into the SQL Editor and run the query

## Row Level Security (RLS)

The schema includes Row Level Security policies that:

- Allow users to read and modify only their own data
- Allow public access to published content
- Give admins access to all data

## Triggers

The schema includes triggers to:

- Automatically create user records when a new user signs up via Supabase Auth
- Initialize user preferences and metrics

## Free vs Premium Users

- Free users are limited to 1 question per day per content type
- This is tracked in the `usage_tracking` table
- Premium users have unlimited access

## Content Types

The application supports various content types for learning Italian:

- Multiple choice questions
- Flashcards
- Listening exercises
- Writing exercises
- Speaking exercises

Each has its own daily usage limit for free users.
