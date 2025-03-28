
import { AIModel } from "@/types/ai";

/**
 * Adapts an AIModel to a size value for use in components
 * that expect a size rather than a model name
 */
export const adaptModelToSize = (model: AIModel): 'small' | 'medium' | 'large' => {
  // Map external model names to our internal size classifications
  if (['gpt-4o-mini', 'mistral-small', 'gpt-3.5-turbo'].includes(model)) return 'small';
  if (['gpt-4o', 'claude-instant', 'mistral-medium'].includes(model)) return 'medium';
  if (['gpt-4', 'claude-2', 'mistral-large'].includes(model)) return 'large';
  return 'medium'; // Default
};

/**
 * Adapts a size value to a model name
 */
export const adaptSizeToModel = (size: 'small' | 'medium' | 'large'): AIModel => {
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
export const adaptFlexibleModelFormat = (modelOrSize: AIModel | 'small' | 'medium' | 'large'): AIModel => {
  if (['small', 'medium', 'large'].includes(modelOrSize as string)) {
    return adaptSizeToModel(modelOrSize as 'small' | 'medium' | 'large');
  }
  return modelOrSize as AIModel;
};
