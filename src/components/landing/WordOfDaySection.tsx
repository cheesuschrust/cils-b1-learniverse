
import React from "react";
import WordOfTheDay from "@/components/learning/WordOfTheDay";

const WordOfDaySection = () => {
  return (
    <section className="py-12 bg-accent/10">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto">
          <WordOfTheDay 
            word="Buongiorno" 
            meaning="Good morning / Good day" 
            example="Buongiorno, come stai oggi?" 
          />
        </div>
      </div>
    </section>
  );
};

export default WordOfDaySection;
