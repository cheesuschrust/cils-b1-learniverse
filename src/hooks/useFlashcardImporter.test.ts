
import { renderHook, act } from '@testing-library/react-hooks';
import useFlashcardImporter from './useFlashcardImporter';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Papa.parse
vi.mock('papaparse', () => ({
  parse: vi.fn((csv, options) => {
    const rows = csv.trim().split('\n');
    
    if (options.header) {
      const headers = rows[0].split(options.delimiter || ',');
      const data = rows.slice(1).map(row => {
        const values = row.split(options.delimiter || ',');
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header] = values[index];
        });
        return obj;
      });
      return { data, errors: [] };
    } else {
      const data = rows.map(row => row.split(options.delimiter || ','));
      return { data, errors: [] };
    }
  })
}));

describe('useFlashcardImporter', () => {
  const mockCSVData = `italian,english,tags
ciao,hello,greeting
grazie,thank you,polite
casa,house,noun`;

  const mockJSONData = JSON.stringify([
    { italian: 'ciao', english: 'hello', tags: 'greeting' },
    { italian: 'grazie', english: 'thank you', tags: 'polite' },
    { italian: 'casa', english: 'house', tags: 'noun' }
  ]);

  let onImportComplete: any;
  let onError: any;

  beforeEach(() => {
    onImportComplete = vi.fn();
    onError = vi.fn();
  });

  it('should initialize with default import format', () => {
    const { result } = renderHook(() => useFlashcardImporter());
    expect(result.current.importFormat).toEqual({
      type: 'csv',
      fieldMap: {
        italian: 'italian',
        english: 'english',
        tags: 'tags',
        level: 'level',
        mastered: 'mastered',
        examples: 'examples',
        explanation: 'explanation'
      },
      delimiter: ',',
      hasHeader: true
    });
  });

  it('should update import format', () => {
    const { result } = renderHook(() => useFlashcardImporter());
    
    act(() => {
      result.current.updateImportFormat({ type: 'json' });
    });
    
    expect(result.current.importFormat.type).toBe('json');
    
    act(() => {
      result.current.updateImportFormat({ 
        fieldMap: { 
          ...result.current.importFormat.fieldMap,
          italian: 'term',
          english: 'definition'
        }
      });
    });
    
    expect(result.current.importFormat.fieldMap.italian).toBe('term');
    expect(result.current.importFormat.fieldMap.english).toBe('definition');
  });

  it('should import from CSV text', async () => {
    const { result } = renderHook(() => 
      useFlashcardImporter({ onImportComplete, onError })
    );
    
    await act(async () => {
      await result.current.importFromText(mockCSVData, 'csv');
    });
    
    expect(result.current.isImporting).toBe(false);
    expect(result.current.error).toBe(null);
    expect(onImportComplete).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ italian: 'ciao', english: 'hello' }),
      expect.objectContaining({ italian: 'grazie', english: 'thank you' }),
      expect.objectContaining({ italian: 'casa', english: 'house' })
    ]));
  });

  it('should import from JSON text', async () => {
    const { result } = renderHook(() => 
      useFlashcardImporter({ onImportComplete, onError })
    );
    
    act(() => {
      result.current.updateImportFormat({ type: 'json' });
    });
    
    await act(async () => {
      await result.current.importFromText(mockJSONData, 'json');
    });
    
    expect(result.current.isImporting).toBe(false);
    expect(result.current.error).toBe(null);
    expect(onImportComplete).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ italian: 'ciao', english: 'hello' }),
      expect.objectContaining({ italian: 'grazie', english: 'thank you' }),
      expect.objectContaining({ italian: 'casa', english: 'house' })
    ]));
  });

  it('should handle errors during import', async () => {
    const { result } = renderHook(() => 
      useFlashcardImporter({ onImportComplete, onError })
    );
    
    // Force JSON parsing error
    await act(async () => {
      try {
        await result.current.importFromText('{invalid:json}', 'json');
      } catch (err) {
        // Expected error
      }
    });
    
    expect(result.current.isImporting).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(onImportComplete).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });

  it('should map fields correctly using custom field mapping', async () => {
    const { result } = renderHook(() => 
      useFlashcardImporter({ onImportComplete, onError })
    );
    
    const customCSV = `term,definition,categories
ciao,hello,greeting
grazie,thank you,polite`;
    
    act(() => {
      result.current.updateImportFormat({
        fieldMap: {
          italian: 'term',
          english: 'definition',
          tags: 'categories'
        }
      });
    });
    
    await act(async () => {
      await result.current.importFromText(customCSV, 'csv');
    });
    
    expect(onImportComplete).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ 
        italian: 'ciao', 
        english: 'hello',
        tags: ['greeting']
      }),
      expect.objectContaining({ 
        italian: 'grazie', 
        english: 'thank you',
        tags: ['polite']
      })
    ]));
  });
});
