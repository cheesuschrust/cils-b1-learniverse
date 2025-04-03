
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useKeyboardNavigation from '@/hooks/use-keyboard-navigation';
import { Keyboard } from 'lucide-react';

export function KeyboardShortcutsModal() {
  const { isHelpModalOpen, closeHelpModal, shortcuts } = useKeyboardNavigation();
  
  return (
    <Dialog open={isHelpModalOpen} onOpenChange={closeHelpModal}>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate the application more efficiently.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div className="font-medium">{shortcut.description}</div>
              <kbd className="px-2 py-1 bg-muted rounded shadow-sm text-sm font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button onClick={closeHelpModal}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default KeyboardShortcutsModal;
