
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const UserDocumentation: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="getting-started">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[500px] pr-4">
            <TabsContent value="getting-started" className="space-y-4">
              <h2 className="text-2xl font-bold">Getting Started with Italian Learning</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Welcome to the Platform</h3>
                  <p>
                    This Italian learning platform is designed to help you master Italian through a variety of interactive exercises and tools. Whether you're a beginner or looking to advance your skills, our platform provides comprehensive resources for your language learning journey.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Setting Up Your Account</h3>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>Complete your profile with your language learning goals</li>
                    <li>Take the placement test to determine your current level</li>
                    <li>Set your learning schedule and daily targets</li>
                    <li>Configure notification preferences</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Your First Lesson</h3>
                  <p>
                    Start with the recommended lessons based on your level. Each lesson combines multiple learning methods:
                  </p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Vocabulary flashcards</li>
                    <li>Grammar explanations</li>
                    <li>Listening exercises</li>
                    <li>Speaking practice</li>
                    <li>Writing activities</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Learning Path</h3>
                  <p>
                    Our platform uses spaced repetition and adaptive learning to create a personalized learning path. As you progress, the system will adjust the difficulty and focus areas based on your performance.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <h2 className="text-2xl font-bold">Platform Features</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Flashcards</h3>
                  <p>
                    Our advanced flashcard system uses spaced repetition to optimize your vocabulary learning. You can:
                  </p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Create custom flashcard sets</li>
                    <li>Import/export flashcards</li>
                    <li>Practice with audio pronunciation</li>
                    <li>Track mastery progress for each word</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Multiple Choice Quizzes</h3>
                  <p>
                    Test your knowledge with adaptive quizzes that focus on grammar, vocabulary, and comprehension. The difficulty adjusts based on your performance.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Speaking Practice</h3>
                  <p>
                    Improve your pronunciation with our AI-powered speaking exercises:
                  </p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Pronunciation assessment</li>
                    <li>Conversation simulations</li>
                    <li>Vocabulary pronunciation practice</li>
                    <li>Real-time feedback</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Listening Exercises</h3>
                  <p>
                    Enhance your comprehension with audio exercises featuring native speakers:
                  </p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Dialogues with transcripts</li>
                    <li>Dictation exercises</li>
                    <li>Comprehension questions</li>
                    <li>Variable playback speed</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Writing Practice</h3>
                  <p>
                    Develop your writing skills with exercises that include:
                  </p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Grammar-focused activities</li>
                    <li>Sentence construction</li>
                    <li>Freestyle writing with AI feedback</li>
                    <li>Error correction</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Progress Tracking</h3>
                  <p>
                    Monitor your learning journey with detailed analytics:
                  </p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Daily streak tracking</li>
                    <li>Mastery level by topic</li>
                    <li>Time spent learning</li>
                    <li>Weak areas identification</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="faq" className="space-y-4">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">How does the spaced repetition system work?</h3>
                  <p>
                    Our spaced repetition system schedules flashcards for review at optimal intervals. Cards you find difficult appear more frequently, while mastered cards appear less often. This algorithm is based on cognitive science research on memory retention.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Can I use the platform offline?</h3>
                  <p>
                    Some features are available offline through our progressive web app. You can download flashcard sets for offline study, but interactive features like speaking practice require an internet connection.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">How accurate is the speech recognition?</h3>
                  <p>
                    Our speech recognition system is trained on native Italian speakers and can accurately assess pronunciation for most words and phrases. However, it may have limitations with certain regional accents or complex sentences.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Can I import my own content?</h3>
                  <p>
                    Yes! You can import flashcards from CSV, JSON, or TXT files. You can also upload audio files for listening practice and text documents for reading exercises.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">How do I reset my progress?</h3>
                  <p>
                    You can reset progress for individual lessons or exercises from your profile settings. If you want to reset all progress, contact support for assistance.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Is my data secure?</h3>
                  <p>
                    We take data security seriously. All your learning data is encrypted and stored securely. Your personal information is never shared with third parties without your consent.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="troubleshooting" className="space-y-4">
              <h2 className="text-2xl font-bold">Troubleshooting</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Audio Not Working</h3>
                  <p>If you're experiencing issues with audio playback or recording:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Check your browser permissions for microphone access</li>
                    <li>Ensure your device's sound is not muted</li>
                    <li>Try using headphones to rule out speaker issues</li>
                    <li>Update your browser to the latest version</li>
                    <li>Try a different device if problems persist</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Content Not Loading</h3>
                  <p>If exercises or content isn't loading properly:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Check your internet connection</li>
                    <li>Clear your browser cache</li>
                    <li>Disable browser extensions that might interfere</li>
                    <li>Try logging out and back in</li>
                    <li>Contact support if the issue persists</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Progress Not Saving</h3>
                  <p>If your progress isn't being saved:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Check that you're logged in</li>
                    <li>Ensure you have a stable internet connection</li>
                    <li>Complete the entire exercise before closing</li>
                    <li>Check for browser storage restrictions</li>
                    <li>Contact support with details of the affected exercises</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Account Issues</h3>
                  <p>For problems with your account:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Use the password reset function if you can't log in</li>
                    <li>Check your email for verification messages</li>
                    <li>Ensure your subscription is active (for premium features)</li>
                    <li>Update your profile information if it's outdated</li>
                    <li>Contact support for assistance with account recovery</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Contacting Support</h3>
                  <p>
                    If you need additional help, our support team is available through:
                  </p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>In-app support chat</li>
                    <li>Email at support@italianlearning.example.com</li>
                    <li>Support tickets (for registered users)</li>
                    <li>Response times are typically within 24 hours</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserDocumentation;
