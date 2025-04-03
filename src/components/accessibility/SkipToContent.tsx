
import React from 'react';
import { Button } from '@/components/ui/button';

export function SkipToContent() {
  return (
    <Button
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2"
      variant="default"
      onClick={() => {
        const content = document.getElementById('content');
        if (content) {
          content.focus();
          content.setAttribute('tabIndex', '-1');
        }
      }}
    >
      Skip to main content
    </Button>
  );
}
