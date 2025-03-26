
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { ParsedDocument } from "./DocumentService";

export interface GeneratedQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questionType: "multipleChoice" | "flashcards" | "writing" | "speaking" | "listening";
  tags?: string[];
  language: string;
  sourceContentId: string;
  createdAt: Date;
  updatedAt: Date;
}

class QuestionGenerationService {
  /**
   * Generate questions from parsed document content
   */
  async generateQuestionsFromDocument(
    documentId: string,
    parsedDocument: ParsedDocument,
    questionType: "multipleChoice" | "flashcards" | "writing" | "speaking" | "listening",
    count: number = 5,
    difficulty: "beginner" | "intermediate" | "advanced" = "intermediate",
    createdBy: string
  ): Promise<GeneratedQuestion[]> {
    try {
      // In a production app, this would be connected to an AI service
      // For this implementation, we'll use heuristics to generate questions
      
      // Extract content based on sections or full text
      const content = parsedDocument.sections?.map(s => s.content).join("\n") || parsedDocument.text;
      
      let questions: GeneratedQuestion[] = [];
      
      // Generate based on question type
      if (questionType === "multipleChoice") {
        questions = this.generateMultipleChoiceQuestions(
          content, 
          count, 
          difficulty, 
          documentId, 
          parsedDocument.metadata.language || "english"
        );
      } else if (questionType === "flashcards") {
        questions = this.generateFlashcards(
          content, 
          count, 
          difficulty, 
          documentId, 
          parsedDocument.metadata.language || "english"
        );
      } else {
        // For other question types
        questions = this.generateGenericQuestions(
          content, 
          questionType, 
          count, 
          difficulty, 
          documentId, 
          parsedDocument.metadata.language || "english"
        );
      }
      
      // Save questions to database
      const savedQuestions = await this.saveQuestionsToDatabase(questions, createdBy);
      
      return savedQuestions;
    } catch (error) {
      console.error("Error generating questions:", error);
      throw error;
    }
  }
  
  /**
   * Save generated questions to database
   */
  private async saveQuestionsToDatabase(
    questions: GeneratedQuestion[],
    createdBy: string
  ): Promise<GeneratedQuestion[]> {
    try {
      const now = new Date().toISOString();
      
      // Format questions for database
      const formattedQuestions = questions.map(question => ({
        id: question.id,
        content_id: question.sourceContentId,
        question: question.question,
        question_type: question.questionType,
        options: question.options || null,
        correct_answer: question.correctAnswer,
        explanation: question.explanation || null,
        difficulty: question.difficulty,
        tags: question.tags || [],
        created_at: now,
        updated_at: now,
        created_by: createdBy,
        language: question.language
      }));
      
      const { data, error } = await supabase
        .from('questions')
        .insert(formattedQuestions)
        .select();
        
      if (error) throw error;
      
      // Map response back to our interface format
      return (data as any[]).map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        questionType: q.question_type,
        tags: q.tags,
        language: q.language,
        sourceContentId: q.content_id,
        createdAt: new Date(q.created_at),
        updatedAt: new Date(q.updated_at)
      }));
    } catch (error) {
      console.error("Error saving questions to database:", error);
      throw error;
    }
  }
  
  /**
   * Generate multiple choice questions
   */
  private generateMultipleChoiceQuestions(
    content: string,
    count: number,
    difficulty: "beginner" | "intermediate" | "advanced",
    documentId: string,
    language: string
  ): GeneratedQuestion[] {
    const sentences = content
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 30 && s.length < 200);
      
    if (sentences.length === 0) return [];
    
    const questions: GeneratedQuestion[] = [];
    
    // Determine how many sentences to sample based on difficulty
    const sampleSize = Math.min(
      sentences.length,
      difficulty === "beginner" ? Math.ceil(sentences.length * 0.2) :
      difficulty === "intermediate" ? Math.ceil(sentences.length * 0.5) :
      sentences.length
    );
    
    // Randomly sample sentences
    const sampledIndexes = this.getRandomIndexes(sentences.length, sampleSize);
    const sampledSentences = sampledIndexes.map(i => sentences[i]);
    
    // Generate questions for each sampled sentence
    for (let i = 0; i < Math.min(count, sampledSentences.length); i++) {
      const sentence = sampledSentences[i];
      
      // Create a question by finding key terms and creating a cloze deletion
      const words = sentence.split(/\s+/);
      
      // Find nouns or key terms (in a real app, use NLP)
      // Simple heuristic: take words of 5+ chars, not at beginning/end
      const eligibleWords = words
        .slice(1, -1)
        .filter(w => w.length >= 5 && /^[A-Za-z]+$/.test(w))
        .map(w => ({ word: w, index: words.indexOf(w) }));
        
      if (eligibleWords.length === 0) continue;
      
      // Pick a random word to create the question
      const targetWord = eligibleWords[Math.floor(Math.random() * eligibleWords.length)];
      const correctAnswer = targetWord.word;
      
      // Generate a question
      let question = "What word best completes this sentence: ";
      question += words.map((w, i) => 
        i === targetWord.index ? "________" : w
      ).join(" ");
      
      // Generate options (in a real app, use an AI model)
      const options = [correctAnswer];
      
      // Add some distractor options - in a real app, use semantically similar words
      for (let j = 0; j < 3; j++) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (!options.includes(randomWord) && randomWord.length > 3) {
          options.push(randomWord);
        } else {
          options.push(`option${j+1}`); // Fallback
        }
      }
      
      // Shuffle options
      const shuffledOptions = this.shuffleArray([...options]);
      
      questions.push({
        id: uuidv4(),
        question,
        options: shuffledOptions,
        correctAnswer,
        explanation: `The correct word is "${correctAnswer}" because it fits the context of the sentence.`,
        difficulty,
        questionType: "multipleChoice",
        tags: parsedDocument?.metadata?.keyTerms || [],
        language,
        sourceContentId: documentId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return questions;
  }
  
  /**
   * Generate flashcards
   */
  private generateFlashcards(
    content: string,
    count: number,
    difficulty: "beginner" | "intermediate" | "advanced",
    documentId: string,
    language: string
  ): GeneratedQuestion[] {
    // In a real implementation, this would involve AI to find term/definition pairs
    // This is a simplified approach for demonstration
    
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    const questions: GeneratedQuestion[] = [];
    
    for (let i = 0; i < Math.min(count, paragraphs.length); i++) {
      const paragraph = paragraphs[i];
      const sentences = paragraph.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
      
      if (sentences.length < 2) continue;
      
      // First sentence is often a definition or introduces a concept
      const term = sentences[0].split(/\s+/).slice(0, 3).join(" ") + "...";
      const definition = sentences.slice(1).join(". ");
      
      questions.push({
        id: uuidv4(),
        question: term,
        correctAnswer: definition,
        difficulty,
        questionType: "flashcards",
        tags: [],
        language,
        sourceContentId: documentId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // If we couldn't generate enough, add some generic ones
    while (questions.length < count) {
      const words = content.split(/\s+/).filter(w => w.length > 5);
      if (words.length === 0) break;
      
      const term = words[Math.floor(Math.random() * words.length)];
      
      questions.push({
        id: uuidv4(),
        question: `Define: ${term}`,
        correctAnswer: "Definition would go here (AI-generated in a real app)",
        difficulty,
        questionType: "flashcards",
        tags: [],
        language,
        sourceContentId: documentId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return questions;
  }
  
  /**
   * Generate generic questions for other question types
   */
  private generateGenericQuestions(
    content: string,
    questionType: "writing" | "speaking" | "listening",
    count: number,
    difficulty: "beginner" | "intermediate" | "advanced",
    documentId: string,
    language: string
  ): GeneratedQuestion[] {
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    const questions: GeneratedQuestion[] = [];
    
    for (let i = 0; i < count; i++) {
      const paragraph = paragraphs[i % paragraphs.length];
      let question: string;
      let answer: string;
      
      if (questionType === "writing") {
        question = `Write a short paragraph about: ${paragraph.substring(0, 50)}...`;
        answer = "Sample answer would be provided here in a real app";
      } else if (questionType === "speaking") {
        question = `Read and explain the following passage: ${paragraph.substring(0, 100)}...`;
        answer = "Proper pronunciation and explanation of the passage";
      } else { // listening
        question = `Listen to the following passage and answer: What is the main topic?`;
        answer = "The main topic is about " + paragraph.substring(0, 50);
      }
      
      questions.push({
        id: uuidv4(),
        question,
        correctAnswer: answer,
        difficulty,
        questionType,
        tags: [],
        language,
        sourceContentId: documentId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return questions;
  }
  
  /**
   * Get random indexes from an array
   */
  private getRandomIndexes(max: number, count: number): number[] {
    const indexes: number[] = [];
    while (indexes.length < count) {
      const index = Math.floor(Math.random() * max);
      if (!indexes.includes(index)) {
        indexes.push(index);
      }
    }
    return indexes;
  }
  
  /**
   * Shuffle an array using Fisher-Yates algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export default new QuestionGenerationService();
