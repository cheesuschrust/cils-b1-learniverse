
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Book, 
  ChevronDown, 
  ChevronRight, 
  Search,
  HelpCircle,
  ExternalLink,
  Slash,
  X,
  Brain,
  BookOpen,
  Mic,
  PenTool,
  Award,
  Volume,
  Info
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HelpDocumentationProps {
  defaultTopic?: string;
}

const HelpDocumentation: React.FC<HelpDocumentationProps> = ({ defaultTopic = 'ai' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-6 left-6 z-40 bg-primary/10 hover:bg-primary/20 rounded-full h-12 w-12"
        onClick={toggleHelp}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={toggleHelp}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-background rounded-t-xl p-1 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-2">
                <Button variant="ghost" size="icon" onClick={toggleHelp}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="px-4 pb-6">
                <h2 className="text-2xl font-bold mb-4">Help & Documentation</h2>
                
                <Tabs defaultValue={defaultTopic}>
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="ai" className="flex flex-col items-center gap-1 py-2">
                      <Brain className="h-4 w-4" />
                      <span className="text-xs">AI Assistant</span>
                    </TabsTrigger>
                    <TabsTrigger value="flashcards" className="flex flex-col items-center gap-1 py-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-xs">Flashcards</span>
                    </TabsTrigger>
                    <TabsTrigger value="speaking" className="flex flex-col items-center gap-1 py-2">
                      <Mic className="h-4 w-4" />
                      <span className="text-xs">Speaking</span>
                    </TabsTrigger>
                    <TabsTrigger value="writing" className="flex flex-col items-center gap-1 py-2">
                      <PenTool className="h-4 w-4" />
                      <span className="text-xs">Writing</span>
                    </TabsTrigger>
                    <TabsTrigger value="gamification" className="flex flex-col items-center gap-1 py-2">
                      <Award className="h-4 w-4" />
                      <span className="text-xs">Achievements</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="border rounded-lg p-1">
                    <ScrollArea className="h-[50vh]">
                      <div className="p-4">
                        <TabsContent value="ai" className="mt-0">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Brain className="h-6 w-6 text-primary" />
                              <h3 className="text-xl font-medium">AI Assistant</h3>
                            </div>
                            
                            <p>
                              The AI Assistant helps you learn Italian more effectively by providing personalized 
                              recommendations, generating practice content, and analyzing your progress.
                            </p>
                            
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="what-is-ai">
                                <AccordionTrigger>What can the AI Assistant do?</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 list-disc pl-6">
                                    <li>Generate personalized flashcards based on your learning level</li>
                                    <li>Provide grammar explanations with examples</li>
                                    <li>Analyze your writing and speaking for errors</li>
                                    <li>Create custom practice exercises</li>
                                    <li>Suggest learning paths based on your progress</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="how-to-use">
                                <AccordionTrigger>How to use the AI Assistant</AccordionTrigger>
                                <AccordionContent>
                                  <ol className="space-y-2 list-decimal pl-6">
                                    <li>Navigate to the AI Assistant page from the main menu</li>
                                    <li>Type your question or request in the chat box</li>
                                    <li>Ask for help with grammar, vocabulary, or learning strategies</li>
                                    <li>Request content generation for flashcards or exercises</li>
                                    <li>Get feedback on your Italian writing or pronunciation</li>
                                  </ol>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="ai-settings">
                                <AccordionTrigger>Customizing AI settings</AccordionTrigger>
                                <AccordionContent>
                                  <p className="mb-2">
                                    You can customize the AI Assistant behavior in Settings:
                                  </p>
                                  <ul className="space-y-2 list-disc pl-6">
                                    <li>Adjust response length and detail level</li>
                                    <li>Change the assistant's learning style to match your preferences</li>
                                    <li>Configure voice settings for pronunciation help</li>
                                    <li>Enable or disable specific AI features</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="flashcards" className="mt-0">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-6 w-6 text-primary" />
                              <h3 className="text-xl font-medium">Flashcards</h3>
                            </div>
                            
                            <p>
                              The Flashcards feature helps you memorize vocabulary, phrases and grammar 
                              using a proven spaced repetition system.
                            </p>
                            
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="how-flashcards-work">
                                <AccordionTrigger>How Flashcards Work</AccordionTrigger>
                                <AccordionContent>
                                  <p className="mb-2">
                                    Flashcards use spaced repetition to optimize your learning:
                                  </p>
                                  <ul className="space-y-2 list-disc pl-6">
                                    <li>Cards are shown just before you would forget them</li>
                                    <li>Easy cards appear less frequently</li>
                                    <li>Difficult cards appear more frequently</li>
                                    <li>The system adapts to your learning pace</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="creating-cards">
                                <AccordionTrigger>Creating Flashcard Sets</AccordionTrigger>
                                <AccordionContent>
                                  <ol className="space-y-2 list-decimal pl-6">
                                    <li>Click "Create New Set" on the Flashcards page</li>
                                    <li>Enter a name and description for your set</li>
                                    <li>Add cards with Italian on one side and English on the other</li>
                                    <li>Optionally include example sentences or notes</li>
                                    <li>Use the AI assistant to generate cards based on a topic</li>
                                  </ol>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="study-strategies">
                                <AccordionTrigger>Effective Study Strategies</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 list-disc pl-6">
                                    <li>Study daily to maintain your streak</li>
                                    <li>Review due cards before learning new ones</li>
                                    <li>Create associations to help memorization</li>
                                    <li>Include context in your cards (example sentences)</li>
                                    <li>Use the "hard" option honestly to optimize your learning</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="speaking" className="mt-0">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Mic className="h-6 w-6 text-primary" />
                              <h3 className="text-xl font-medium">Speaking Practice</h3>
                            </div>
                            
                            <p>
                              The Speaking feature helps you improve your Italian pronunciation and conversation
                              skills through interactive exercises.
                            </p>
                            
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="speaking-exercises">
                                <AccordionTrigger>Speaking Exercise Types</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 list-disc pl-6">
                                    <li><strong>Pronunciation Practice:</strong> Repeat words and phrases to improve accent</li>
                                    <li><strong>Conversation Practice:</strong> Respond to prompts in Italian</li>
                                    <li><strong>Role Play:</strong> Practice common conversations in different scenarios</li>
                                    <li><strong>Fluency Drills:</strong> Timed exercises to improve speaking speed</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="microphone-setup">
                                <AccordionTrigger>Microphone Setup</AccordionTrigger>
                                <AccordionContent>
                                  <ol className="space-y-2 list-decimal pl-6">
                                    <li>Ensure your browser has permission to access your microphone</li>
                                    <li>Use headphones to hear pronunciation examples clearly</li>
                                    <li>Speak in a quiet environment for better recognition</li>
                                    <li>Click the microphone icon to start recording your speech</li>
                                    <li>The AI will analyze your pronunciation and provide feedback</li>
                                  </ol>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="pronunciation-tips">
                                <AccordionTrigger>Pronunciation Tips</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 list-disc pl-6">
                                    <li>Listen carefully to native speaker examples</li>
                                    <li>Pay attention to stress and intonation</li>
                                    <li>Practice difficult sounds repeatedly</li>
                                    <li>Record yourself and compare to the example</li>
                                    <li>Use the slow playback option for complex phrases</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="writing" className="mt-0">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <PenTool className="h-6 w-6 text-primary" />
                              <h3 className="text-xl font-medium">Writing Practice</h3>
                            </div>
                            
                            <p>
                              The Writing feature helps you develop your Italian writing skills through
                              exercises, grammar checks, and feedback.
                            </p>
                            
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="writing-exercises">
                                <AccordionTrigger>Writing Exercise Types</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 list-disc pl-6">
                                    <li><strong>Sentence Construction:</strong> Form sentences with given words</li>
                                    <li><strong>Guided Compositions:</strong> Write short texts on given topics</li>
                                    <li><strong>Translation Exercises:</strong> Translate sentences to Italian</li>
                                    <li><strong>Error Correction:</strong> Find and fix mistakes in provided text</li>
                                    <li><strong>Free Writing:</strong> Open-ended practice with feedback</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="grammar-check">
                                <AccordionTrigger>Using the Grammar Checker</AccordionTrigger>
                                <AccordionContent>
                                  <ol className="space-y-2 list-decimal pl-6">
                                    <li>Write your text in the editor</li>
                                    <li>Click "Check Grammar" to analyze your writing</li>
                                    <li>Review highlighted errors and suggestions</li>
                                    <li>Hover over highlighted text to see explanations</li>
                                    <li>Make corrections based on the feedback</li>
                                    <li>Use "Explain" to get detailed grammar explanations</li>
                                  </ol>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="writing-tips">
                                <AccordionTrigger>Effective Writing Practice</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 list-disc pl-6">
                                    <li>Practice regularly, even just a few sentences daily</li>
                                    <li>Start with simple structures and gradually increase complexity</li>
                                    <li>Keep a vocabulary journal for new words you use</li>
                                    <li>Review your corrected texts to learn from mistakes</li>
                                    <li>Use the AI assistant to get writing prompts at your level</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="gamification" className="mt-0">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Award className="h-6 w-6 text-primary" />
                              <h3 className="text-xl font-medium">Achievements & Gamification</h3>
                            </div>
                            
                            <p>
                              Our gamification system makes learning fun by rewarding your progress 
                              with points, levels, badges, and achievements.
                            </p>
                            
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="xp-levels">
                                <AccordionTrigger>XP & Levels</AccordionTrigger>
                                <AccordionContent>
                                  <p className="mb-2">
                                    Earn experience points (XP) as you learn:
                                  </p>
                                  <ul className="space-y-2 list-disc pl-6">
                                    <li>Complete exercises to earn XP</li>
                                    <li>Maintain daily streaks for XP bonuses</li>
                                    <li>Level up as you accumulate XP</li>
                                    <li>Higher levels unlock new features and content</li>
                                    <li>View your progress on your profile and dashboard</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="achievements">
                                <AccordionTrigger>Achievements</AccordionTrigger>
                                <AccordionContent>
                                  <p className="mb-2">
                                    Earn badges and achievements for reaching milestones:
                                  </p>
                                  <ul className="space-y-2 list-disc pl-6">
                                    <li><strong>Streak Master:</strong> Maintain learning streaks</li>
                                    <li><strong>Vocabulary Builder:</strong> Master vocabulary cards</li>
                                    <li><strong>Grammar Expert:</strong> Complete grammar exercises</li>
                                    <li><strong>Conversation Star:</strong> Practice speaking regularly</li>
                                    <li><strong>Writing Virtuoso:</strong> Complete writing exercises</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="challenges">
                                <AccordionTrigger>Weekly Challenges</AccordionTrigger>
                                <AccordionContent>
                                  <p className="mb-2">
                                    Take on special challenges for extra rewards:
                                  </p>
                                  <ul className="space-y-2 list-disc pl-6">
                                    <li>New challenges appear each week</li>
                                    <li>Complete challenges to earn bonus XP and badges</li>
                                    <li>Challenges adapt to your learning level</li>
                                    <li>Special seasonal challenges offer unique rewards</li>
                                    <li>View current challenges on your dashboard</li>
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </TabsContent>
                      </div>
                    </ScrollArea>
                  </div>
                </Tabs>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpDocumentation;
