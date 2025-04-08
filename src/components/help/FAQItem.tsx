
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface FAQItemProps {
  id: string;
  question: string;
  questionItalian?: string;
  answer: string;
  answerItalian?: string;
  category?: string;
}

interface FAQItemsProps {
  items: FAQItemProps[];
}

const FAQItem: React.FC<{ item: FAQItemProps }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  
  const getQuestion = () => {
    if (language === 'italian' && item.questionItalian) {
      return item.questionItalian;
    }
    return item.question;
  };
  
  const getAnswer = () => {
    if (language === 'italian' && item.answerItalian) {
      return item.answerItalian;
    }
    return item.answer;
  };
  
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full text-left px-4 py-3 flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="font-medium">{getQuestion()}</h3>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-primary flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 text-muted-foreground">
          <p>{getAnswer()}</p>
        </div>
      )}
    </div>
  );
};

const FAQItems: React.FC<FAQItemsProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No FAQ items available.
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      {items.map((item) => (
        <FAQItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export { FAQItem };
export default FAQItems;
