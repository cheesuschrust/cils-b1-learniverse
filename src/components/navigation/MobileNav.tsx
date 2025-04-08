
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Menu,
  Book,
  Headphones,
  MessageSquare,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

const MobileNav: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  
  const closeSheet = () => setOpen(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] sm:w-[350px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-primary">CILS Prep</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col space-y-4">
          {user ? (
            <>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="practice">
                  <AccordionTrigger>Practice</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2 pl-2">
                      <Link to="/flashcards" onClick={closeSheet}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Book className="mr-2 h-4 w-4" />
                          Flashcards
                        </Button>
                      </Link>
                      <Link to="/practice/reading" onClick={closeSheet}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Book className="mr-2 h-4 w-4" />
                          Reading Practice
                        </Button>
                      </Link>
                      <Link to="/practice/listening" onClick={closeSheet}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Headphones className="mr-2 h-4 w-4" />
                          Listening Practice
                        </Button>
                      </Link>
                      <Link to="/practice/speaking" onClick={closeSheet}>
                        <Button variant="ghost" className="w-full justify-start">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Speaking Practice
                        </Button>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="resources">
                  <AccordionTrigger>Resources</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2 pl-2">
                      <Link to="/resources/grammar" onClick={closeSheet}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Book className="mr-2 h-4 w-4" />
                          Grammar Guide
                        </Button>
                      </Link>
                      <Link to="/resources/vocabulary" onClick={closeSheet}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Book className="mr-2 h-4 w-4" />
                          Vocabulary Lists
                        </Button>
                      </Link>
                      <Link to="/resources/exam-info" onClick={closeSheet}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Book className="mr-2 h-4 w-4" />
                          CILS Exam Info
                        </Button>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/profile" onClick={closeSheet}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    logout();
                    closeSheet();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/about" onClick={closeSheet}>
                <Button variant="ghost" className="w-full justify-start">
                  About
                </Button>
              </Link>
              
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/login" onClick={closeSheet}>
                  <Button variant="ghost" className="w-full justify-start">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={closeSheet}>
                  <Button variant="default" className="w-full justify-start">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
