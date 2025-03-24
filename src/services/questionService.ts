
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
      // Fix: The AIService's generateText returns a string, not an object with generated_text
      const jsonMatch = result.match(/\[.*\]/s);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in the response");
      }
      
      const jsonStr = jsonMatch[0].replace(/```(json)?|```/g, '');
      const questions = JSON.parse(jsonStr);
      
      return questions.slice(0, count); // Ensure we only return the requested number
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw AI response:", result);
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

    // Fix: The AIService's generateText returns a string directly
    return result.trim();
  } catch (error) {
    console.error("Error generating feedback:", error);
    return language === 'italian'
      ? "Non è stato possibile generare un feedback. Riprova più tardi."
      : "Could not generate feedback. Please try again later.";
  }
};

// Add a new function to generate questions from custom content
export const generateQuestionsFromContent = async (
  content: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  language: 'english' | 'italian' = 'english',
  count: number = 5
): Promise<GeneratedQuestion[]> => {
  try {
    const prompt = `
Based on the following content:
"""
${content}
"""

Generate ${count} ${difficulty.toLowerCase()} level ${language} multiple choice questions about this content.
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
      // Fix: The AIService's generateText returns a string directly
      const jsonMatch = result.match(/\[.*\]/s);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in the response");
      }
      
      const jsonStr = jsonMatch[0].replace(/```(json)?|```/g, '');
      const questions = JSON.parse(jsonStr);
      
      return questions.slice(0, count); // Ensure we only return the requested number
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw AI response:", result);
      throw new Error("Failed to parse the generated questions");
    }
  } catch (error) {
    console.error("Error generating questions from content:", error);
    throw error;
  }
};

// Create manual (non-AI) question set for fallback
export const createManualQuestionSet = (
  category: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  language: 'english' | 'italian' = 'english',
  count: number = 5
): GeneratedQuestion[] => {
  // Simplified question sets for when AI is disabled or fails
  if (language === 'italian') {
    return [
      {
        question: "Quale di queste città è la capitale d'Italia?",
        options: ["Milano", "Firenze", "Roma", "Venezia"],
        correctAnswerIndex: 2,
        explanation: "Roma è la capitale d'Italia dal 1871. Prima di Roma, la capitale è stata Torino e poi Firenze."
      },
      {
        question: "Cosa rappresentano i tre colori della bandiera italiana?",
        options: ["Libertà, Uguaglianza, Fraternità", "Passato, Presente, Futuro", "Mare, Pianura, Montagne", "Speranza, Fede, Carità"],
        correctAnswerIndex: 3,
        explanation: "I tre colori della bandiera italiana simboleggiano la Speranza (verde), la Fede (bianco) e la Carità (rosso)."
      },
      {
        question: "Chi è stato il primo presidente della Repubblica Italiana?",
        options: ["Alcide De Gasperi", "Enrico De Nicola", "Luigi Einaudi", "Giuseppe Saragat"],
        correctAnswerIndex: 1,
        explanation: "Enrico De Nicola è stato il primo presidente della Repubblica Italiana dal 1946 al 1948, sebbene inizialmente con il titolo di Capo Provvisorio dello Stato."
      },
      {
        question: "Quale di questi mari non bagna l'Italia?",
        options: ["Mar Tirreno", "Mar Adriatico", "Mar Baltico", "Mar Ionio"],
        correctAnswerIndex: 2,
        explanation: "L'Italia è bagnata dal Mar Tirreno, dal Mar Adriatico, dal Mar Ionio e dal Mar Ligure. Il Mar Baltico si trova nel nord Europa."
      },
      {
        question: "In che anno è stata fondata la Repubblica Italiana?",
        options: ["1861", "1946", "1918", "1870"],
        correctAnswerIndex: 1,
        explanation: "La Repubblica Italiana è stata fondata il 2 giugno 1946, quando gli italiani votarono per abolire la monarchia in un referendum."
      }
    ].slice(0, count);
  } else {
    return [
      {
        question: "Which of these cities is the capital of Italy?",
        options: ["Milan", "Florence", "Rome", "Venice"],
        correctAnswerIndex: 2,
        explanation: "Rome has been the capital of Italy since 1871. Before Rome, the capital was Turin and then Florence."
      },
      {
        question: "What do the three colors of the Italian flag represent?",
        options: ["Liberty, Equality, Fraternity", "Past, Present, Future", "Sea, Plains, Mountains", "Hope, Faith, Charity"],
        correctAnswerIndex: 3,
        explanation: "The three colors of the Italian flag symbolize Hope (green), Faith (white), and Charity (red)."
      },
      {
        question: "Who was the first president of the Italian Republic?",
        options: ["Alcide De Gasperi", "Enrico De Nicola", "Luigi Einaudi", "Giuseppe Saragat"],
        correctAnswerIndex: 1,
        explanation: "Enrico De Nicola was the first president of the Italian Republic from 1946 to 1948, although initially with the title of Provisional Head of State."
      },
      {
        question: "Which of these seas does not border Italy?",
        options: ["Tyrrhenian Sea", "Adriatic Sea", "Baltic Sea", "Ionian Sea"],
        correctAnswerIndex: 2,
        explanation: "Italy is bordered by the Tyrrhenian Sea, the Adriatic Sea, the Ionian Sea, and the Ligurian Sea. The Baltic Sea is located in northern Europe."
      },
      {
        question: "In what year was the Italian Republic founded?",
        options: ["1861", "1946", "1918", "1870"],
        correctAnswerIndex: 1,
        explanation: "The Italian Republic was founded on June 2, 1946, when Italians voted to abolish the monarchy in a referendum."
      }
    ].slice(0, count);
  }
};
