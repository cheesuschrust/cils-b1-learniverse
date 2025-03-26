
import { renderHook, act } from '@testing-library/react';
import { useFlashcardImporter } from './useFlashcardImporter';
import { useFlashcards } from './useFlashcards';
import { describe, it, expect, beforeEach, jest } from 'vitest';
import { ImportFormat } from '@/types/flashcard';

// Mock the useFlashcards hook
vi.mock('./useFlashcards', () => ({
  useFlashcards: vi.fn(),
}));

describe('useFlashcardImporter Hook', () => {
  const mockImportFlashcards = vi.fn();
  const mockExportFlashcards = vi.fn();
  const mockFlashcardSets = [
    { id: 'set1', name: 'Test Set 1' },
    { id: 'set2', name: 'Test Set 2' },
  ];

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup default mock implementation
    (useFlashcards as jest.Mock).mockReturnValue({
      importFlashcards: mockImportFlashcards,
      exportFlashcards: mockExportFlashcards,
      flashcardSets: mockFlashcardSets,
    });
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useFlashcardImporter());
    
    expect(result.current.importResult).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.flashcardSets).toEqual(mockFlashcardSets);
  });

  it('handleImport calls importFlashcards with correct params', async () => {
    mockImportFlashcards.mockResolvedValueOnce({
      success: true,
      imported: 5,
      skipped: 1,
      errors: [],
    });
    
    const { result } = renderHook(() => useFlashcardImporter());
    
    const content = 'test,csv,content';
    const importFormat: ImportFormat = { format: 'csv' };
    const options = { format: importFormat, includeExamples: true };
    
    let importResult;
    await act(async () => {
      importResult = await result.current.handleImport(content, options);
    });
    
    expect(mockImportFlashcards).toHaveBeenCalledWith(content, options);
    expect(importResult).toEqual({
      success: true,
      imported: 5,
      skipped: 1,
      errors: [],
      importedCards: 5,
    });
    expect(result.current.importResult).toEqual({
      success: true,
      imported: 5,
      skipped: 1,
      errors: [],
      importedCards: 5,
    });
    expect(result.current.loading).toBe(false);
  });

  it('handleImport sets loading state correctly', async () => {
    mockImportFlashcards.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            imported: 3,
            skipped: 0,
            errors: [],
          });
        }, 100);
      });
    });
    
    const { result } = renderHook(() => useFlashcardImporter());
    
    let promise;
    act(() => {
      const importFormat: ImportFormat = { format: 'json' };
      promise = result.current.handleImport('content', { format: importFormat });
      expect(result.current.loading).toBe(true);
    });
    
    await act(async () => {
      await promise;
    });
    
    expect(result.current.loading).toBe(false);
  });

  it('handleImport handles errors correctly', async () => {
    const errorMessage = 'Import failed';
    mockImportFlashcards.mockRejectedValueOnce(new Error(errorMessage));
    
    const { result } = renderHook(() => useFlashcardImporter());
    
    await act(async () => {
      const importFormat: ImportFormat = { format: 'csv' };
      await expect(result.current.handleImport('content', { format: importFormat }))
        .rejects.toThrow(errorMessage);
    });
    
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });

  it('handleExport calls exportFlashcards with correct params', () => {
    mockExportFlashcards.mockReturnValueOnce('exported,content');
    
    const { result } = renderHook(() => useFlashcardImporter());
    
    let exportResult;
    act(() => {
      exportResult = result.current.handleExport('set1', 'csv');
    });
    
    expect(mockExportFlashcards).toHaveBeenCalledWith('set1', 'csv');
    expect(exportResult).toBe('exported,content');
  });

  it('handleExport handles errors correctly', () => {
    const errorMessage = 'Export failed';
    mockExportFlashcards.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
    
    const { result } = renderHook(() => useFlashcardImporter());
    
    act(() => {
      expect(() => result.current.handleExport('set1')).toThrow(errorMessage);
    });
    
    expect(result.current.error).toBe(errorMessage);
  });
});
