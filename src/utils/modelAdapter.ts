
import { AIModel } from "@/types/ai";

// Map to standardize AI model names across different providers
export const modelMap: Record<string, string> = {
  // OpenAI models
  "gpt-4o-mini": "small",
  "gpt-4o": "medium",
  "gpt-4.5-turbo": "large",
  
  // Anthropic models
  "claude-instant": "small",
  "claude-2": "medium",
  "claude-3": "large",
  
  // Local models
  "llama-7b": "small",
  "llama-13b": "medium",
  "llama-70b": "large",
};

// Map model names to their capabilities
export const modelCapabilities: Record<string, string[]> = {
  "small": [
    "text generation",
    "translation",
    "basic grammar correction"
  ],
  "medium": [
    "text generation",
    "translation",
    "grammar correction",
    "content summarization",
    "language assessment"
  ],
  "large": [
    "text generation",
    "translation",
    "advanced grammar correction",
    "content summarization",
    "language assessment",
    "flashcard generation",
    "question generation"
  ]
};

// Get standardized model size
export function getModelSize(modelName: string): string {
  return modelMap[modelName] || "medium";
}

// Check if a model supports a specific capability
export function modelSupports(modelName: string, capability: string): boolean {
  const size = getModelSize(modelName);
  return modelCapabilities[size]?.includes(capability) || false;
}

// Get all models of a specific size
export function getModelsBySize(size: string): string[] {
  return Object.entries(modelMap)
    .filter(([_, modelSize]) => modelSize === size)
    .map(([model]) => model);
}

// Get recommended model for a specific capability
export function getRecommendedModel(capability: string): string {
  // Find the smallest model that supports the capability
  for (const size of ["small", "medium", "large"]) {
    if (modelCapabilities[size]?.includes(capability)) {
      const models = getModelsBySize(size);
      return models[0] || "gpt-4o";
    }
  }
  return "gpt-4o"; // Default to a medium model
}
