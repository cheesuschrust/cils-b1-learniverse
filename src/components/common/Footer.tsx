
import React from 'react';
import { Github, Twitter, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t py-8 px-4">
      <div className="container grid gap-8 md:grid-cols-4">
        <div className="flex flex-col space-y-2">
          <h3 className="font-medium text-lg">CILS B1 Learniverse</h3>
          <p className="text-sm text-muted-foreground">
            Your Italian language learning platform for the CILS B1 citizenship exam. Practice, learn, and succeed.
          </p>
          <div className="flex space-x-3 mt-3">
            <a href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://instagram.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="mailto:contact@example.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="font-medium">Learning</h3>
          <Link to="/app/flashcards" className="text-sm text-muted-foreground hover:text-foreground">Flashcards</Link>
          <Link to="/app/lessons" className="text-sm text-muted-foreground hover:text-foreground">Lessons</Link>
          <Link to="/app/speaking" className="text-sm text-muted-foreground hover:text-foreground">Speaking Practice</Link>
          <Link to="/app/listening" className="text-sm text-muted-foreground hover:text-foreground">Listening Exercises</Link>
          <Link to="/app/writing" className="text-sm text-muted-foreground hover:text-foreground">Writing Exercises</Link>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="font-medium">Resources</h3>
          <Link to="/support-center" className="text-sm text-muted-foreground hover:text-foreground">Support Center</Link>
          <Link to="/app/communities" className="text-sm text-muted-foreground hover:text-foreground">Communities</Link>
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link>
          <a href="/docs/cils-exam-guide.pdf" className="text-sm text-muted-foreground hover:text-foreground">CILS Exam Guide</a>
          <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="font-medium">Legal</h3>
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</Link>
          <Link to="/gdpr" className="text-sm text-muted-foreground hover:text-foreground">GDPR Compliance</Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link>
        </div>
      </div>
      
      <div className="container mt-8 pt-4 border-t text-sm text-muted-foreground flex flex-col sm:flex-row justify-between">
        <div>
          © {new Date().getFullYear()} CILS B1 Learniverse. All rights reserved.
        </div>
        <div className="mt-2 sm:mt-0">
          Made with ❤️ for Italian language learners worldwide
        </div>
      </div>
    </footer>
  );
};

export default Footer;
