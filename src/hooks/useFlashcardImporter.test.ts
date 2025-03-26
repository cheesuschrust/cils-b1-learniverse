
import { renderHook, act } from '@testing-library/react-hooks';
import { useFlashcardImporter, ImportOptions } from './useFlashcardImporter';
import { expect, describe, test, vi, beforeEach } from 'vitest';

// Mock data
const mockCsvContent = 'italian,english,tags\ncasa,house,basics\nmela,apple,food';
const mockJsonContent = '[{"italian":"casa","english":"house","tags":"basics"},{"italian":"mela","english":"apple","tags":"food"}]';

// Mock options
const mockOptions: ImportOptions = {
  italianColumn: 'italian',
  englishColumn: 'english',
  tagsColumn: 'tags',
};

// Setup global mocks
vi.mock('uuid', () => ({
  v4: () => 'mocked-uuid'
}));

describe('useFlashcardImporter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should import flashcards from CSV content', async () => {
    // Arrange
    const { result } = renderHook(() => useFlashcardImporter());
    
    // Act
    let importResult;
    await act(async () => {
      importResult = await result.current.handleImport(mockCsvContent, mockOptions);
    });
    
    // Assert
    expect(importResult.success).toBe(true);
    expect(importResult.imported).toBeGreaterThan(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  test('should import flashcards from JSON content', async () => {
    // Arrange
    const { result } = renderHook(() => useFlashcardImporter());
    
    // Act
    let importResult;
    await act(async () => {
      importResult = await result.current.handleImport(mockJsonContent, { ...mockOptions, format: 'json' });
    });
    
    // Assert
    expect(importResult.success).toBe(true);
    expect(importResult.imported).toBeGreaterThan(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  test('should handle CSV import error', async () => {
    // Arrange
    const { result } = renderHook(() => useFlashcardImporter());
    const invalidCsv = 'invalid,format\nno,columns';
    
    // Act & Assert
    await expect(
      act(async () => {
        await result.current.handleImport(invalidCsv, {
          italianColumn: 'italian',
          englishColumn: 'english',
          tagsColumn: 'tags',
        });
      })
    ).rejects.toThrow();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).not.toBeNull();
  });
  
  test('should handle JSON import error', async () => {
    // Arrange
    const { result } = renderHook(() => useFlashcardImporter());
    const invalidJson = '{ invalid: json }';
    
    // Act & Assert
    await expect(
      act(async () => {
        await result.current.handleImport(invalidJson, {
          ...mockOptions,
          format: 'json',
        });
      })
    ).rejects.toThrow();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).not.toBeNull();
  });
  
  test('should export flashcards to CSV format', () => {
    // Arrange
    const { result } = renderHook(() => useFlashcardImporter());
    
    // Act
    let exportResult;
    act(() => {
      exportResult = result.current.handleExport(undefined, 'csv');
    });
    
    // Assert
    expect(exportResult).toBeDefined();
    expect(typeof exportResult).toBe('string');
    expect(exportResult).toContain('italian,english,tags');
  });
  
  test('should export flashcards to JSON format', () => {
    // Arrange
    const { result } = renderHook(() => useFlashcardImporter());
    
    // Act
    let exportResult;
    act(() => {
      exportResult = result.current.handleExport(undefined, 'json');
    });
    
    // Assert
    expect(exportResult).toBeDefined();
    expect(typeof exportResult).toBe('string');
  });
});
