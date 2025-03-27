
// Document related type definitions

export interface DocumentMeta {
  id: string;
  title: string;
  type: string;
  size: number;
  uploadedBy: string;
  contentType: "flashcards" | "multipleChoice" | "writing" | "speaking" | "listening";
  language: string;
  createdAt: string;
  parsedContent?: ParsedDocument;
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

export interface DocumentUploadResult {
  success: boolean;
  documentId?: string;
  path?: string;
  url?: string;
  error?: string;
}

export interface DocumentImportOptions {
  type: 'url' | 'file' | 'text';
  source: string | File;
  language?: string;
  contentType?: "flashcards" | "multipleChoice" | "writing" | "speaking" | "listening";
  title?: string;
  tags?: string[];
}

export type DocumentFormat = 'pdf' | 'docx' | 'txt' | 'csv' | 'json' | 'md';

export interface DocumentProcessingOptions {
  extractTables?: boolean;
  extractImages?: boolean;
  preserveFormatting?: boolean;
  enableOcr?: boolean;
  language?: string;
  maxPages?: number;
}

export interface DocumentExportOptions {
  format: DocumentFormat;
  includeMetadata?: boolean;
  includeTags?: boolean;
  fileName?: string;
}

export interface DocumentStats {
  views: number;
  downloads: number;
  shares: number;
  lastViewed?: Date;
  averageTimeSpent?: number;
  completionRate?: number;
}

export interface DocumentPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canDownload: boolean;
  isOwner: boolean;
}
