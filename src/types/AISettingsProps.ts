
import { AISettings } from './ai';

export interface AISettingsProps {
  initialSettings?: AISettings;
  onSettingsChange?: (settings: AISettings) => void;
  onClose?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  availableModels?: string[];
  isLoading?: boolean;
  settings?: AISettings;
}
