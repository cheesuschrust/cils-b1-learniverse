
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

export interface IDocumentService {
  uploadDocument(file: File, userId: string): Promise<{ path: string; url: string }>;
  parseDocumentContent(content: string, fileType: string): Promise<ParsedDocument>;
  saveDocumentMetadata(
    meta: Omit<DocumentMeta, 'id' | 'createdAt'>,
    parsedContent: ParsedDocument
  ): Promise<string>;
}
