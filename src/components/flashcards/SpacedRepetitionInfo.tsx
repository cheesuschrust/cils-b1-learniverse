
import React from 'react';
import { Flashcard } from '@/types/flashcard';

export interface SpacedRepetitionInfoProps {
  flashcard?: Flashcard;
}

const SpacedRepetitionInfo: React.FC<SpacedRepetitionInfoProps> = ({ flashcard }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Spaced Repetition</h3>
      <p className="text-sm text-muted-foreground">
        Spaced repetition is a learning technique that incorporates increasing intervals of time between subsequent review of previously learned material to exploit the psychological spacing effect.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm">
        <div className="bg-primary/5 p-3 rounded-md">
          <h4 className="font-medium mb-1">Easy (Level 3-5)</h4>
          <p className="text-muted-foreground">
            Review every 4-16 days
          </p>
        </div>
        <div className="bg-primary/5 p-3 rounded-md">
          <h4 className="font-medium mb-1">Medium (Level 2)</h4>
          <p className="text-muted-foreground">
            Review every 2-4 days
          </p>
        </div>
        <div className="bg-primary/5 p-3 rounded-md">
          <h4 className="font-medium mb-1">Hard (Level 0-1)</h4>
          <p className="text-muted-foreground">
            Review every 1-2 days
          </p>
        </div>
      </div>
      
      {flashcard && (
        <div className="mt-4 p-3 border rounded-md">
          <h4 className="font-medium mb-1">Current Card Status</h4>
          <p className="text-sm">Level: {flashcard.level} | Next Review: {flashcard.nextReview?.toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default SpacedRepetitionInfo;
