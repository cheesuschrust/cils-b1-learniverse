
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import AIManagement from './AIManagement';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';
import { render as customRender } from '@/tests/test-utils';

// Mock the useAI hook
vi.mock('@/hooks/useAI', () => ({
  useAI: vi.fn(),
}));

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

// Mock the AISystemInfoPanel component
vi.mock('@/components/admin/AISystemInfoPanel', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? (
      <div data-testid="ai-system-info-panel">
        <button onClick={onClose} data-testid="close-panel-button">Close</button>
        <div>AI System Info Panel Content</div>
      </div>
    ) : null
  ),
}));

// Mock the AITrainingManagerWrapper component
vi.mock('@/components/admin/AITrainingManagerWrapper', () => ({
  default: ({ isVisible }: { isVisible: boolean }) => (
    isVisible ? (
      <div data-testid="training-data-manager">
        <div>AI Training Manager Content</div>
      </div>
    ) : null
  ),
}));

describe('AIManagement Page', () => {
  // Mock implementations for useAI and useToast
  const mockResetModel = vi.fn().mockResolvedValue(undefined);
  const mockSetModelSize = vi.fn();
  const mockToggleWebGPU = vi.fn();
  const mockToggleCacheResponses = vi.fn();
  const mockUpdateVoiceSettings = vi.fn();
  
  const mockToast = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Default mock implementations
    (useAI as jest.Mock).mockReturnValue({
      modelSize: 'medium',
      setModelSize: mockSetModelSize,
      useWebGPU: false,
      toggleWebGPU: mockToggleWebGPU,
      cacheResponses: true,
      toggleCacheResponses: mockToggleCacheResponses,
      voiceSettings: {
        rate: 1.0,
        pitch: 1.0,
        italianVoiceURI: 'Italian Voice',
        englishVoiceURI: 'English Voice',
      },
      updateVoiceSettings: mockUpdateVoiceSettings,
      resetModel: mockResetModel,
      accuracy: 85,
      averageResponseTime: 250,
      totalRequests: 15000,
      isInitialized: true,
      isProcessing: false,
      memoryUsage: 125.4,
      initializationTime: 3420,
    });
    
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });

  test('renders AI model settings correctly', () => {
    customRender(<AIManagement />);

    // Check that model settings card is rendered
    expect(screen.getByTestId('model-settings-card')).toBeInTheDocument();
    
    // Check model size selector
    const modelSizeSelect = screen.getByRole('combobox');
    expect(modelSizeSelect).toHaveValue('medium');
    
    // Check WebGPU toggle
    const webGPUToggle = screen.getByTestId('web-gpu-toggle');
    expect(webGPUToggle).toBeInTheDocument();
    
    // Check cache responses toggle
    const cacheResponsesToggle = screen.getByTestId('cache-responses-toggle');
    expect(cacheResponsesToggle).toBeInTheDocument();
  });

  test('changes model size correctly', async () => {
    customRender(<AIManagement />);
    
    // Select large model size
    const modelSizeSelect = screen.getByRole('combobox');
    fireEvent.change(modelSizeSelect, { target: { value: 'large' } });
    
    // Save settings
    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);
    
    // Check that setModelSize was called with 'large'
    expect(mockSetModelSize).toHaveBeenCalledWith('large');
    
    // Check that toast was called
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Settings saved',
        description: 'AI model settings have been updated.',
      });
    });
  });

  test('toggles WebGPU acceleration correctly', () => {
    customRender(<AIManagement />);
    
    // Find and click the WebGPU toggle
    const webGPUToggle = screen.getByTestId('web-gpu-toggle');
    fireEvent.click(webGPUToggle);
    
    // Save settings
    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);
    
    // Check that toggleWebGPU was called
    expect(mockToggleWebGPU).toHaveBeenCalled();
  });

  test('toggles cache responses correctly', () => {
    customRender(<AIManagement />);
    
    // Find and click the cache responses toggle
    const cacheResponsesToggle = screen.getByTestId('cache-responses-toggle');
    fireEvent.click(cacheResponsesToggle);
    
    // Save settings
    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);
    
    // Check that toggleCacheResponses was called
    expect(mockToggleCacheResponses).toHaveBeenCalled();
  });

  test('displays performance metrics correctly', () => {
    customRender(<AIManagement />);
    
    // Check that performance metrics card is rendered
    expect(screen.getByTestId('performance-metrics-card')).toBeInTheDocument();
    
    // Check accuracy metric
    expect(screen.getByTestId('accuracy-metric')).toHaveTextContent('85%');
    
    // Check response time metric
    expect(screen.getByTestId('response-time-metric')).toHaveTextContent('250');
    
    // Check requests metric
    expect(screen.getByTestId('requests-metric')).toHaveTextContent('15,000');
  });

  test('opens the AI system info panel when button is clicked', () => {
    customRender(<AIManagement />);
    
    // At first, panel should not be visible
    expect(screen.queryByTestId('ai-system-info-panel')).not.toBeInTheDocument();
    
    // Click the View System Information button
    const viewSystemInfoButton = screen.getByText('View System Information');
    fireEvent.click(viewSystemInfoButton);
    
    // Panel should now be visible
    expect(screen.getByTestId('ai-system-info-panel')).toBeInTheDocument();
    
    // Close the panel
    const closeButton = screen.getByTestId('close-panel-button');
    fireEvent.click(closeButton);
    
    // Panel should not be visible again
    expect(screen.queryByTestId('ai-system-info-panel')).not.toBeInTheDocument();
  });

  test('opens training data manager when button is clicked', () => {
    customRender(<AIManagement />);
    
    // At first, training data manager should not be visible
    expect(screen.queryByTestId('training-data-manager')).not.toBeInTheDocument();
    
    // Click the Manage Training Data button
    const manageTrainingDataButton = screen.getByText('Manage Training Data');
    fireEvent.click(manageTrainingDataButton);
    
    // Training data manager should now be visible
    expect(screen.getByTestId('training-data-manager')).toBeInTheDocument();
  });

  test('resets AI model when button is clicked and confirmed', async () => {
    customRender(<AIManagement />);
    
    // Click reset model button
    const resetModelButton = screen.getByText('Reset Model');
    fireEvent.click(resetModelButton);
    
    // Confirmation dialog should appear
    expect(screen.getByTestId('confirmation-dialog')).toBeInTheDocument();
    
    // Click confirm
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    // Check that resetModel was called
    expect(mockResetModel).toHaveBeenCalled();
    
    // Wait for the reset to complete and check that toast was called
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Model reset successfully',
        description: 'The AI model has been reset to its default state.',
      });
    });
  });

  test('cancels model reset when cancel button is clicked', () => {
    customRender(<AIManagement />);
    
    // Click reset model button
    const resetModelButton = screen.getByText('Reset Model');
    fireEvent.click(resetModelButton);
    
    // Confirmation dialog should appear
    expect(screen.getByTestId('confirmation-dialog')).toBeInTheDocument();
    
    // Click cancel
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);
    
    // Confirmation dialog should disappear
    expect(screen.queryByTestId('confirmation-dialog')).not.toBeInTheDocument();
    
    // Check that resetModel was not called
    expect(mockResetModel).not.toHaveBeenCalled();
  });

  test('handles error during model reset', async () => {
    // Override the mock to simulate an error
    mockResetModel.mockRejectedValueOnce(new Error('Failed to reset model'));
    
    customRender(<AIManagement />);
    
    // Click reset model button
    const resetModelButton = screen.getByText('Reset Model');
    fireEvent.click(resetModelButton);
    
    // Click confirm in the dialog
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    // Wait for the error and check that error toast was called
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reset model',
      });
    });
  });

  test('updates voice settings correctly', () => {
    customRender(<AIManagement />);
    
    // Find voice settings card
    const voiceSettingsCard = screen.getByTestId('voice-settings-card');
    expect(voiceSettingsCard).toBeInTheDocument();
    
    // Find rate and pitch sliders
    const rateSlider = screen.getByTestId('voice-rate-slider');
    const pitchSlider = screen.getByTestId('voice-pitch-slider');
    
    // Change rate
    fireEvent.change(rateSlider, { target: { value: '1.5' } });
    
    // Change pitch
    fireEvent.change(pitchSlider, { target: { value: '0.8' } });
    
    // Save settings
    const saveButton = screen.getByText('Save Voice Settings');
    fireEvent.click(saveButton);
    
    // Check that updateVoiceSettings was called with correct values
    expect(mockUpdateVoiceSettings).toHaveBeenCalledWith({
      rate: 1.5,
      pitch: 0.8,
      italianVoiceURI: 'Italian Voice',
      englishVoiceURI: 'English Voice',
    });
  });
});
