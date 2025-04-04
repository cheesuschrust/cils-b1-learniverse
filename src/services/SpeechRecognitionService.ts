
import { supabase } from '@/lib/supabase-client';

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  wordLevelAnalysis?: WordAnalysis[];
  languageDetected?: string;
}

export interface WordAnalysis {
  word: string;
  confidence: number;
  startTime?: number;
  endTime?: number;
  feedback?: string;
}

export interface SpeechAnalysisOptions {
  language?: string;
  targetText?: string;
  compareWithTarget?: boolean;
}

export class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recognitionInProgress = false;

  private constructor() {}

  public static getInstance(): SpeechRecognitionService {
    if (!SpeechRecognitionService.instance) {
      SpeechRecognitionService.instance = new SpeechRecognitionService();
    }
    return SpeechRecognitionService.instance;
  }

  /**
   * Checks if the microphone is accessible and returns a media stream
   */
  public async checkMicrophoneAccess(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return stream;
    } catch (error) {
      console.error('Microphone access error:', error);
      throw new Error('Could not access microphone. Please check permissions.');
    }
  }

  /**
   * Starts recording audio from the microphone
   */
  public async startRecording(): Promise<() => void> {
    try {
      const stream = await this.checkMicrophoneAccess();
      this.audioChunks = [];
      
      this.mediaRecorder = new MediaRecorder(stream);
      
      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      });
      
      this.mediaRecorder.start();
      
      // Return a function to stop recording
      return () => this.stopRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  /**
   * Stops recording and returns the recorded audio blob
   */
  public stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }
      
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Stop all tracks from the stream to release microphone
        this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
        
        this.mediaRecorder = null;
        resolve(audioBlob);
      });
      
      this.mediaRecorder.stop();
    });
  }

  /**
   * Converts the audio blob to base64
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix
        const base64Content = base64data.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Recognizes speech from audio blob using Supabase Edge Function
   */
  public async recognizeSpeech(audioBlob: Blob, options: SpeechAnalysisOptions = {}): Promise<SpeechRecognitionResult> {
    if (this.recognitionInProgress) {
      throw new Error('Speech recognition already in progress');
    }
    
    this.recognitionInProgress = true;
    
    try {
      const base64Audio = await this.blobToBase64(audioBlob);
      
      const { data, error } = await supabase.functions.invoke('ai-speech-recognition', {
        body: {
          audio: base64Audio,
          language: options.language || 'it'
        }
      });
      
      if (error) {
        throw new Error(`Speech recognition error: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from speech recognition');
      }
      
      // If we have a target text, compare it with the recognized text
      if (options.compareWithTarget && options.targetText) {
        return this.compareWithTarget(data, options.targetText);
      }
      
      return data;
    } catch (error) {
      console.error('Speech recognition error:', error);
      throw error;
    } finally {
      this.recognitionInProgress = false;
    }
  }

  /**
   * Compares recognized speech with target text and provides feedback
   */
  private compareWithTarget(recognitionResult: SpeechRecognitionResult, targetText: string): SpeechRecognitionResult {
    const recognized = recognitionResult.text.toLowerCase().trim();
    const target = targetText.toLowerCase().trim();
    
    // Simple string similarity
    const similarity = this.calculateStringSimilarity(recognized, target);
    
    // Create word-level analysis
    const targetWords = target.split(/\s+/);
    const recognizedWords = recognized.split(/\s+/);
    
    const wordAnalysis = targetWords.map((word, index) => {
      const recognizedWord = recognizedWords[index] || '';
      const wordSimilarity = this.calculateStringSimilarity(word, recognizedWord);
      
      const wordConfidence = wordSimilarity * 100;
      
      let feedback = '';
      if (wordConfidence < 50) {
        feedback = 'Mispronounced';
      } else if (wordConfidence < 75) {
        feedback = 'Partially correct';
      }
      
      return {
        word: word,
        confidence: wordConfidence,
        feedback: feedback || undefined
      };
    });
    
    // Update the overall confidence based on similarity
    return {
      ...recognitionResult,
      confidence: similarity * 100,
      wordLevelAnalysis: wordAnalysis
    };
  }

  /**
   * Calculates string similarity using Levenshtein distance
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const track = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
    
    const distance = track[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    
    // Return similarity as a value between 0 and 1
    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
  }

  /**
   * Analyzes speech rhythm and fluency
   */
  public analyzeSpeechRhythm(wordAnalysis: WordAnalysis[]): {
    fluencyScore: number;
    rhythmScore: number;
    feedback: string;
  } {
    // Check if we have timing data
    const hasTiming = wordAnalysis.some(w => w.startTime !== undefined && w.endTime !== undefined);
    
    if (!hasTiming) {
      // Basic analysis based only on word confidence
      const avgConfidence = wordAnalysis.reduce((sum, w) => sum + w.confidence, 0) / wordAnalysis.length;
      return {
        fluencyScore: avgConfidence,
        rhythmScore: avgConfidence * 0.8, // Slightly lower without timing data
        feedback: avgConfidence > 75 
          ? "Good fluency overall. Continue practicing for better rhythm." 
          : "Focus on clearer pronunciation to improve fluency."
      };
    }
    
    // Advanced analysis with timing data
    const wordDurations = wordAnalysis
      .filter(w => w.startTime !== undefined && w.endTime !== undefined)
      .map(w => ({
        word: w.word,
        duration: (w.endTime! - w.startTime!) * 1000, // Convert to ms
        confidence: w.confidence
      }));
    
    // Calculate average word duration
    const avgDuration = wordDurations.reduce((sum, w) => sum + w.duration, 0) / wordDurations.length;
    
    // Calculate variance in duration (for rhythm consistency)
    const durationVariance = wordDurations.reduce((sum, w) => sum + Math.pow(w.duration - avgDuration, 2), 0) / wordDurations.length;
    const normalizedVariance = Math.min(1, Math.sqrt(durationVariance) / (avgDuration * 2));
    
    // Calculate fluency (based on pauses and confidence)
    const confidenceScore = wordAnalysis.reduce((sum, w) => sum + w.confidence, 0) / wordAnalysis.length;
    
    // Calculate rhythm score (inverse of normalized variance)
    const rhythmScore = (1 - normalizedVariance) * 100;
    
    // Calculate fluency score (combination of confidence and timing)
    const fluencyScore = (confidenceScore + (rhythmScore / 100) * 50) / 1.5;
    
    // Generate feedback
    let feedback = "";
    if (fluencyScore > 85) {
      feedback = "Excellent fluency and rhythm. Your speech flows naturally.";
    } else if (fluencyScore > 70) {
      feedback = "Good fluency. Focus on maintaining consistent rhythm between words.";
    } else if (fluencyScore > 50) {
      feedback = "Moderate fluency. Try to reduce pauses between words for smoother speech.";
    } else {
      feedback = "Focus on speaking more smoothly with fewer pauses. Practice with shorter phrases first.";
    }
    
    return {
      fluencyScore,
      rhythmScore,
      feedback
    };
  }

  /**
   * Tracks speaking errors in the database
   */
  public async trackSpeakingError(
    userId: string, 
    exerciseId: string, 
    errorType: string, 
    errorDetails: any
  ): Promise<void> {
    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: userId,
          activity_type: 'speaking_error',
          details: {
            exercise_id: exerciseId,
            error_type: errorType,
            error_details: errorDetails,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Error tracking speaking error:', error);
    }
  }
}

export default SpeechRecognitionService.getInstance();
