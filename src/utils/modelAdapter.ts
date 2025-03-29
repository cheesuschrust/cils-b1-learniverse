
import { AIModel, AIModelSize } from '@/types/ai';

interface ModelMapping {
  [key: string]: AIModel;
}

/**
 * Maps external AI model names to our internal model types
 */
export const mapExternalModelToInternal = (externalModel: string): AIModel => {
  const modelMap: ModelMapping = {
    // OpenAI models
    'gpt-3.5-turbo': 'small',
    'gpt-3.5-turbo-16k': 'small',
    'gpt-4o-mini': 'small',
    'gpt-4': 'large',
    'gpt-4o': 'medium',
    
    // Claude models
    'claude-instant': 'medium',
    'claude-2': 'large',
    
    // Mistral models
    'mistral-tiny': 'small',
    'mistral-small': 'small',
    'mistral-medium': 'medium',
    'mistral-large': 'large',
    
    // Default to medium model if unknown
    'default': 'medium',
  };
  
  return modelMap[externalModel] || modelMap.default;
};

/**
 * Get the appropriate model name for the provider based on the desired size
 */
export function getModelForProvider(provider: string, size: AIModelSize): AIModel {
  const providerModelMap: Record<string, Record<AIModelSize, AIModel>> = {
    'openai': {
      'small': 'gpt-4o-mini',
      'medium': 'gpt-4o',
      'large': 'gpt-4'
    },
    'anthropic': {
      'small': 'gpt-4o-mini',  // Fallback if no small model
      'medium': 'claude-instant',
      'large': 'claude-2'
    },
    'mistral': {
      'small': 'mistral-small',
      'medium': 'mistral-medium',
      'large': 'mistral-large'
    },
    'default': {
      'small': 'gpt-3.5-turbo',
      'medium': 'gpt-4o',
      'large': 'gpt-4'
    }
  };
  
  const providerMap = providerModelMap[provider] || providerModelMap.default;
  return providerMap[size];
}

// Export default for module compatibility
export default {
  mapExternalModelToInternal,
  getModelForProvider
};
