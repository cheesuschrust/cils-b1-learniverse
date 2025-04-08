
import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { BilingualText } from '@/components/language/BilingualText';
import { SpeakableWord } from '@/components/ui/speakable-word';

export interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
  category: string;
  questionItalian?: string;
  answerItalian?: string;
}

interface FAQSectionProps {
  title: string;
  description?: string;
  items: FAQItem[];
  categories?: string[];
  titleItalian?: string;
  descriptionItalian?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({
  title,
  titleItalian,
  description,
  descriptionItalian,
  items,
  categories = [],
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredItems = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'exam':
        return { en: 'Exam', it: 'Esame' };
      case 'platform':
        return { en: 'Platform', it: 'Piattaforma' };
      case 'subscription':
        return { en: 'Subscription', it: 'Abbonamento' };
      case 'technical':
        return { en: 'Technical', it: 'Tecnico' };
      default:
        return { en: category, it: category };
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <BilingualText
          english={title}
          italian={titleItalian || title}
          className="text-2xl font-bold"
        />
        
        {description && (
          <BilingualText
            english={description}
            italian={descriptionItalian || description}
            className="text-muted-foreground"
          />
        )}
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activeCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveCategory(null)}
          >
            <BilingualText
              english="All"
              italian="Tutti"
              className="inline-flex"
            />
          </Badge>
          
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory(category)}
            >
              <BilingualText
                english={getCategoryLabel(category).en}
                italian={getCategoryLabel(category).it}
                className="inline-flex"
              />
            </Badge>
          ))}
        </div>
      )}

      <Accordion type="single" collapsible className="w-full">
        {filteredItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-start text-left">
                <BilingualText
                  english={item.question}
                  italian={item.questionItalian || item.question}
                  className="font-medium"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  {typeof item.answer === 'string' ? (
                    <BilingualText
                      english={item.answer}
                      italian={item.answerItalian || item.answer}
                      showSpeak={true}
                    />
                  ) : (
                    item.answer
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQSection;
