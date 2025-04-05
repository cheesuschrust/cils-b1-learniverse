
import { AISettings } from './ai';

export interface AISettingsProps {
  settings: AISettings;
  onSettingsChange: (settings: AISettings) => void;
  onSave?: () => void;
  onReset?: () => void;
  onClose?: () => void;
  availableModels?: string[];
  isLoading?: boolean;
}
