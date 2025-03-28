
import { AIPreferences, AISettings } from './ai';

export interface AISettingsProps {
  initialSettings?: AISettings;
  onSettingsChange?: (settings: AISettings) => void;
  onClose?: () => void;
}
