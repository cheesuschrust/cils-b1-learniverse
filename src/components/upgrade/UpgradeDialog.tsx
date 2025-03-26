
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PremiumUpgrade from './PremiumUpgrade';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpgradeDialog: React.FC<UpgradeDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <PremiumUpgrade 
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;
