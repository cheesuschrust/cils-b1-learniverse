
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export interface DocumentMeta {
  id: string;
  title: string;
  type: string;
  size: number;
  uploadedBy: string;
  contentType: "flashcards" | "multipleChoice" | "writing" | "speaking" | "listening";
  language: string;
  createdAt: string;
  parsedContent?: any;
  difficulty?: "beginner" | "intermediate" | "advanced";
  tags?: string[];
}

export interface ParsedDocument {
  text: string;
  metadata: {
    title?: string;
    author?: string;
    creationDate?: string;
    pageCount?: number;
    wordCount?: number;
    keyTerms?: string[];
    language?: string;
  };
  sections?: {
    title: string;
    content: string;
    level: number;
  }[];
}

class DocumentService {
  /**
   * Upload a document to Supabase storage
   */
  async uploadDocument(file: File, userId: string): Promise<{ path: string; url: string }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `documents/${userId}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('content-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('content-files')
        .getPublicUrl(filePath);
        
      return { path: filePath, url: publicUrl };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }
  
  /**
   * Parse text from document content
   */
  async parseDocumentContent(content: string, fileType: string): Promise<ParsedDocument> {
    try {
      // Basic parsing for text documents
      if (fileType === 'text/plain' || fileType.includes('text')) {
        return this.parseTextDocument(content);
      }
      
      // For more complex document types, we'd need to implement specific parsers
      // In a real app, you might use a backend service or API for this
      // This is a simplified version for demonstration
      return {
        text: content,
        metadata: {
          wordCount: content.split(/\s+/).length,
          language: this.detectLanguage(content)
        }
      };
    } catch (error) {
      console.error('Error parsing document content:', error);
      throw error;
    }
  }
  
  /**
   * Parse plain text documents
   */
  private parseTextDocument(content: string): ParsedDocument {
    const lines = content.split('\n');
    const title = lines[0].trim();
    const text = lines.slice(1).join('\n').trim();
    
    // Extract sections based on # or ## markers (markdown-like)
    const sections = [];
    let currentSection = { title: '', content: '', level: 0 };
    let currentContent: string[] = [];
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        // If we were building a section, save it
        if (currentSection.title) {
          currentSection.content = currentContent.join('\n');
          sections.push({...currentSection});
          currentContent = [];
        }
        currentSection = { 
          title: line.substring(2).trim(), 
          content: '', 
          level: 1 
        };
      } else if (line.startsWith('## ')) {
        // If we were building a section, save it
        if (currentSection.title) {
          currentSection.content = currentContent.join('\n');
          sections.push({...currentSection});
          currentContent = [];
        }
        currentSection = { 
          title: line.substring(3).trim(), 
          content: '', 
          level: 2 
        };
      } else {
        currentContent.push(line);
      }
    }
    
    // Save the last section
    if (currentSection.title) {
      currentSection.content = currentContent.join('\n');
      sections.push(currentSection);
    }
    
    return {
      text,
      metadata: {
        title,
        wordCount: text.split(/\s+/).length,
        language: this.detectLanguage(text),
        keyTerms: this.extractKeyTerms(text)
      },
      sections: sections.length > 0 ? sections : undefined
    };
  }
  
  /**
   * Detect the language of the text
   */
  private detectLanguage(text: string): string {
    // A simple language detection heuristic
    // In a real app, you'd use a proper language detection library
    const italianPatterns = ['della', 'sono', 'questo', 'della', 'che', 'per', 'con', 'una'];
    const italianMatches = italianPatterns.filter(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(text);
    }).length;
    
    return italianMatches > 3 ? 'italian' : 'english';
  }
  
  /**
   * Extract key terms from text
   */
  private extractKeyTerms(text: string): string[] {
    // In a real app, you'd use NLP for this
    // This is a simplified approach for demonstration
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 4);
      
    const wordFrequency: Record<string, number> = {};
    
    for (const word of words) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
    
    // Filter out common words (this would be a larger list in a real app)
    const commonWords = ['there', 'their', 'would', 'about', 'which', 'were', 'have', 'these', 'from'];
    
    return Object.entries(wordFrequency)
      .filter(([word, count]) => count > 1 && !commonWords.includes(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }
  
  /**
   * Save document metadata to Supabase
   */
  async saveDocumentMetadata(
    meta: Omit<DocumentMeta, 'id' | 'createdAt'>,
    parsedContent: ParsedDocument
  ): Promise<string> {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('content')
        .insert({
          id,
          title: meta.title,
          description: `Uploaded ${meta.type} document`,
          content_type: meta.contentType,
          difficulty: meta.difficulty || 'intermediate',
          language: meta.language,
          tags: meta.tags || [],
          created_at: now,
          updated_at: now,
          created_by: meta.uploadedBy,
          is_published: true,
          raw_content: JSON.stringify(parsedContent),
          file_url: meta.size > 0 ? meta.size.toString() : null
        });
        
      if (error) throw error;
      
      return id;
    } catch (error) {
      console.error('Error saving document metadata:', error);
      throw error;
    }
  }
}

export default new DocumentService();
