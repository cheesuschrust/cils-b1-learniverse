
/**
 * Additional type definitions and utilities
 */

// Re-export essential types to prevent circular dependencies
import { User } from './interface-fixes';

// AI Settings Props interface
export interface AISettingsProps {
  initialSettings?: any;
  onSettingsChange?: (settings: any) => void;
  onClose?: () => void;
}
