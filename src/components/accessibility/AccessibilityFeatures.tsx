
import React from 'react';
import { Eye } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const AccessibilityFeatures: React.FC = () => {
  const { 
    highContrastMode, 
    setHighContrastMode, 
    animationsEnabled, 
    setAnimationsEnabled,
    fontSize,
    setFontSize
  } = useUserPreferences();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-8 h-8 p-0">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Accessibility options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Accessibility Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <div className="flex items-center justify-between mb-3">
            <Label htmlFor="high-contrast">High Contrast</Label>
            <Switch 
              id="high-contrast"
              checked={highContrastMode}
              onCheckedChange={setHighContrastMode}
            />
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <Label htmlFor="reduce-motion">Reduce Motion</Label>
            <Switch 
              id="reduce-motion"
              checked={!animationsEnabled}
              onCheckedChange={(checked) => setAnimationsEnabled(!checked)}
            />
          </div>
          
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="font-size">Font Size</Label>
              <span className="text-xs">
                {fontSize === 'small' ? 'Small' : fontSize === 'medium' ? 'Medium' : 'Large'}
              </span>
            </div>
            <Slider 
              id="font-size"
              defaultValue={[
                fontSize === 'small' ? 1 : fontSize === 'medium' ? 2 : 3
              ]} 
              max={3} 
              min={1} 
              step={1} 
              onValueChange={(value) => {
                const size = value[0] === 1 ? 'small' : value[0] === 2 ? 'medium' : 'large';
                setFontSize(size);
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccessibilityFeatures;
