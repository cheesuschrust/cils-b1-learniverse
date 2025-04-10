
import React from 'react';

export const Toaster: React.FC = () => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4 w-full max-w-xs sm:max-w-md">
      {/* Toast notifications will appear here via portals */}
    </div>
  );
};
