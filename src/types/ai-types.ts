
export type AIGeneratedQuestion = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: string;
  difficulty: string;
  isCitizenshipRelevant: boolean;
  questionType: string;
};

export type QuestionGenerationParams = {
  topics: string[];
  contentTypes: string[];
  difficulty: string;
  count: number;
  isCitizenshipFocused?: boolean;
};

export type ItalianQuestionGenerationParams = {
  contentTypes: string[];
  difficulty: string;
  count: number;
  topics?: string[];
  isCitizenshipFocused?: boolean;
};

export type AIProcessingOptions = {
  format?: string;
  translateTo?: string;
  simplifyText?: boolean;
  level?: string;
};

export type VoiceOptions = {
  voice?: string;
  rate?: number;
  pitch?: number;
  lang?: string;
};

export type VoicePreference = {
  language: string;
  englishVoiceURI?: string;
  italianVoiceURI?: string;
  voiceRate?: number;
  voicePitch?: number;
};
