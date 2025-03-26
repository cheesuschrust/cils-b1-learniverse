
export type ContentType = 
  | 'writing'
  | 'speaking'
  | 'listening'
  | 'reading'
  | 'grammar'
  | 'vocabulary'
  | 'pronunciation'
  | 'conversation'
  | 'translation';

export function getContentTypeLabel(type: ContentType): string {
  switch (type) {
    case 'writing': return 'Writing';
    case 'speaking': return 'Speaking';
    case 'listening': return 'Listening';
    case 'reading': return 'Reading';
    case 'grammar': return 'Grammar';
    case 'vocabulary': return 'Vocabulary';
    case 'pronunciation': return 'Pronunciation';
    case 'conversation': return 'Conversation';
    case 'translation': return 'Translation';
    default: return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

export function getAllContentTypes(): ContentType[] {
  return [
    'writing',
    'speaking',
    'listening',
    'reading',
    'grammar',
    'vocabulary',
    'pronunciation',
    'conversation',
    'translation'
  ];
}

export function getContentTypeFeedbackQuestions(type: ContentType): string[] {
  switch (type) {
    case 'writing':
      return [
        'Was the grammar correctly identified?',
        'Were the suggestions helpful?',
        'Did the feedback address style issues?'
      ];
    case 'speaking':
      return [
        'Was pronunciation feedback accurate?',
        'Did it correctly identify accent issues?',
        'Were the suggestions for improvement helpful?'
      ];
    case 'listening':
      return [
        'Was comprehension accurately assessed?',
        'Were the explanations clear?',
        'Did it identify key listening challenges?'
      ];
    case 'reading':
      return [
        'Was text difficulty accurately assessed?',
        'Were vocabulary explanations helpful?',
        'Was cultural context provided when needed?'
      ];
    case 'grammar':
      return [
        'Were grammar errors correctly identified?',
        'Were explanations of rules clear?',
        'Were the correction suggestions appropriate?'
      ];
    case 'vocabulary':
      return [
        'Were definitions accurate?',
        'Were examples of usage provided?',
        'Was word difficulty level appropriate?'
      ];
    case 'pronunciation':
      return [
        'Were pronunciation errors correctly identified?',
        'Was feedback specific enough?',
        'Were audio examples helpful?'
      ];
    case 'conversation':
      return [
        'Was the conversation natural?',
        'Did responses make sense in context?',
        'Was cultural appropriateness maintained?'
      ];
    case 'translation':
      return [
        'Was the translation accurate?',
        'Was context preserved in translation?',
        'Were idioms translated appropriately?'
      ];
    default:
      return [
        'Was the feedback helpful?',
        'Was the assessment accurate?',
        'Would you like more detailed explanations?'
      ];
  }
}

export function getContentTypeDefaultThreshold(type: ContentType): number {
  switch (type) {
    case 'grammar': return 90;
    case 'vocabulary': return 85;
    case 'pronunciation': return 80;
    case 'writing': return 75;
    case 'speaking': return 70;
    case 'listening': return 75;
    case 'reading': return 80;
    case 'conversation': return 70;
    case 'translation': return 85;
    default: return 75;
  }
}
