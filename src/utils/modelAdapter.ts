
import { AIModel, AIModelSize } from "@/types/ai";

/**
 * Adapts an AIModel to a size value for use in components
 * that expect a size rather than a model name
 */
export const adaptModelToSize = (model: AIModel | string): AIModelSize => {
  // Map external model names to our internal size classifications
  if (['gpt-4o-mini', 'mistral-small', 'gpt-3.5-turbo', 'small'].includes(model)) return 'small';
  if (['gpt-4o', 'claude-instant', 'mistral-medium', 'medium'].includes(model)) return 'medium';
  if (['gpt-4', 'claude-2', 'mistral-large', 'large'].includes(model)) return 'large';
  return 'medium'; // Default
};

/**
 * Adapts a size value to a model name
 */
export const adaptSizeToModel = (size: AIModelSize | string): AIModel => {
  switch (size) {
    case 'small': 
      return 'gpt-4o-mini';
    case 'medium': 
      return 'gpt-4o';
    case 'large': 
      return 'gpt-4';
    default:
      return 'gpt-4o';
  }
};

/**
 * Flexible adapter for handling both AIModel and size strings
 */
export const adaptFlexibleModelFormat = (modelOrSize: AIModel | AIModelSize | string): AIModel => {
  if (['small', 'medium', 'large'].includes(modelOrSize)) {
    return adaptSizeToModel(modelOrSize as AIModelSize);
  }
  return modelOrSize as AIModel;
};

/**
 * Normalizes model name to ensure consistency
 */
export const normalizeModelName = (model: string): AIModel => {
  const modelMap: Record<string, AIModel> = {
    'small': 'gpt-4o-mini',
    'medium': 'gpt-4o',
    'large': 'gpt-4',
    'gpt-4o-mini': 'gpt-4o-mini',
    'gpt-4o': 'gpt-4o',
    'gpt-4': 'gpt-4',
    'gpt-3.5-turbo': 'gpt-3.5-turbo',
    'mistral-small': 'mistral-small',
    'mistral-medium': 'mistral-medium',
    'mistral-large': 'mistral-large',
    'claude-instant': 'claude-instant',
    'claude-2': 'claude-2'
  };
  
  return modelMap[model] || 'gpt-4o';
};
