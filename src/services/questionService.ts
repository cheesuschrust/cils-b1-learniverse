
import { MultipleChoiceQuestion } from '@/types/question';
import { generateText } from '@/services/AIService';

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

// Function to generate multiple choice questions using AI
export const generateQuestionSet = async (
  category: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  language: 'english' | 'italian' = 'english',
  count: number = 5
): Promise<GeneratedQuestion[]> => {
  try {
    const prompt = `
Generate ${count} ${difficulty.toLowerCase()} level ${language} multiple choice questions about ${category}.
For each question, provide 4 options with one correct answer.
Include an explanation for the correct answer.

Return only JSON in this exact format:
[{
  "question": "Question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswerIndex": 0, // Index of the correct answer in the options array
  "explanation": "Explanation of why this is the correct answer"
}]
`;

    const result = await generateText(prompt, { 
      maxLength: 2048,
      temperature: 0.7
    });

    // Parse the JSON response
    try {
      // Extract the JSON part from the response
      const jsonMatch = result.generated_text.match(/\[.*\]/s);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in the response");
      }
      
      const jsonStr = jsonMatch[0].replace(/```(json)?|```/g, '');
      const questions = JSON.parse(jsonStr);
      
      return questions.slice(0, count); // Ensure we only return the requested number
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw AI response:", result.generated_text);
      throw new Error("Failed to parse the generated questions");
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

// Function to evaluate a student's answer and provide feedback
export const evaluateAnswer = async (
  userAnswer: string,
  correctAnswer: string,
  question: string,
  language: 'english' | 'italian' = 'english'
): Promise<string> => {
  try {
    const prompt = `
Question: ${question}
Correct answer: ${correctAnswer}
User's answer: ${userAnswer}

Evaluate the user's answer and provide helpful feedback in ${language}.
If the answer is correct, explain why. If incorrect, explain what's wrong and what the right approach would be.
Keep your response under 150 words.
`;

    const result = await generateText(prompt, {
      maxLength: 512,
      temperature: 0.7
    });

    return result.generated_text.trim();
  } catch (error) {
    console.error("Error generating feedback:", error);
    return language === 'italian'
      ? "Non è stato possibile generare un feedback. Riprova più tardi."
      : "Could not generate feedback. Please try again later.";
  }
};
