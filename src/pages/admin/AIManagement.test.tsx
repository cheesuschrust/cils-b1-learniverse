
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import AIManagement from './AIManagement';
import { AIUtilsContext } from '@/contexts/AIUtilsContext';
import { useToast } from '@/components/ui/use-toast';

// Mock the useToast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn(),
  }),
}));

// Mock charts component that uses recharts
vi.mock('@/components/admin/analytics/ModelPerformanceChart', () => ({
  default: () => <div data-testid="model-performance-chart">Model Performance Chart</div>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Activity: () => <div data-testid="lucide-activity">Activity Icon</div>,
  AlertTriangle: () => <div data-testid="lucide-alert-triangle">Alert Triangle Icon</div>,
  BarChart: () => <div data-testid="lucide-bar-chart">Bar Chart Icon</div>,
  Brain: () => <div data-testid="lucide-brain">Brain Icon</div>,
  CheckCircle: () => <div data-testid="lucide-check-circle">Check Circle Icon</div>,
  Clock: () => <div data-testid="lucide-clock">Clock Icon</div>,
  Download: () => <div data-testid="lucide-download">Download Icon</div>,
  HardDrive: () => <div data-testid="lucide-hard-drive">Hard Drive Icon</div>,
  MemoryStick: () => <div data-testid="lucide-memory-stick">Memory Stick Icon</div>,
  Save: () => <div data-testid="lucide-save">Save Icon</div>,
  Tool: () => <div data-testid="lucide-tool">Tool Icon</div>,
}));

// Create mock AI context value
const mockContextValue = {
  settings: {
    defaultModelSize: 'medium',
    useWebGPU: false,
    voiceRate: 1.0,
    voicePitch: 1.0,
    italianVoiceURI: '',
    englishVoiceURI: '',
    defaultLanguage: 'english',
    processOnDevice: true,
    dataCollection: false,
    assistanceLevel: 2,
    autoLoadModels: true,
    cacheModels: true,
    processingSetting: 'balanced',
    optimizationLevel: 1,
    anonymousAnalytics: false,
    contentFiltering: true,
  },
  updateSettings: vi.fn(),
  getSpeechVoice: vi.fn(),
  speakText: vi.fn(),
  stopSpeaking: vi.fn(),
  isLoading: false,
};

describe('AIManagement', () => {
  const mockToast = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({
      toast: mockToast,
    });
  });

  test('renders the AI Management page with tabs', () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Check page title
    expect(screen.getByText('AI Management')).toBeInTheDocument();
    
    // Check for tabs
    expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /performance/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /models/i })).toBeInTheDocument();
  });

  test('allows changing model size', async () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Find the model size radio buttons
    const smallModelOption = screen.getByLabelText(/small/i);
    const mediumModelOption = screen.getByLabelText(/medium/i);
    const largeModelOption = screen.getByLabelText(/large/i);
    
    // Check that medium is selected by default (based on mock context)
    expect(mediumModelOption).toBeChecked();
    
    // Change to large model
    fireEvent.click(largeModelOption);
    
    // updateSettings should be called with new model size
    await waitFor(() => {
      expect(mockContextValue.updateSettings).toHaveBeenCalledWith({ defaultModelSize: 'large' });
    });
  });

  test('allows toggling WebGPU acceleration', async () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Find the WebGPU switch
    const webGPUSwitch = screen.getByRole('checkbox', { name: /use webgpu/i });
    
    // Should be unchecked by default (based on mock context)
    expect(webGPUSwitch).not.toBeChecked();
    
    // Toggle the switch
    fireEvent.click(webGPUSwitch);
    
    // updateSettings should be called with WebGPU enabled
    await waitFor(() => {
      expect(mockContextValue.updateSettings).toHaveBeenCalledWith({ useWebGPU: true });
    });
  });

  test('allows toggling process on device setting', async () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Find the process on device switch
    const processOnDeviceSwitch = screen.getByRole('checkbox', { name: /process on device/i });
    
    // Should be checked by default (based on mock context)
    expect(processOnDeviceSwitch).toBeChecked();
    
    // Toggle the switch
    fireEvent.click(processOnDeviceSwitch);
    
    // updateSettings should be called with process on device disabled
    await waitFor(() => {
      expect(mockContextValue.updateSettings).toHaveBeenCalledWith({ processOnDevice: false });
    });
  });

  test('allows toggling data collection', async () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Find the data collection switch
    const dataCollectionSwitch = screen.getByRole('checkbox', { name: /data collection/i });
    
    // Should be unchecked by default (based on mock context)
    expect(dataCollectionSwitch).not.toBeChecked();
    
    // Toggle the switch
    fireEvent.click(dataCollectionSwitch);
    
    // updateSettings should be called with data collection enabled
    await waitFor(() => {
      expect(mockContextValue.updateSettings).toHaveBeenCalledWith({ dataCollection: true });
    });
  });

  test('allows changing assistance level', async () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Find the assistance level slider
    const assistanceLevelSlider = screen.getByRole('slider');
    
    // Change the slider value
    fireEvent.change(assistanceLevelSlider, { target: { value: 3 } });
    
    // updateSettings should be called with new assistance level
    await waitFor(() => {
      expect(mockContextValue.updateSettings).toHaveBeenCalledWith({ assistanceLevel: 3 });
    });
  });

  test('shows performance tab when clicked', () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Click on the performance tab
    const performanceTab = screen.getByRole('tab', { name: /performance/i });
    fireEvent.click(performanceTab);
    
    // Verify performance content is shown
    expect(screen.getByTestId('model-performance-chart')).toBeInTheDocument();
    expect(screen.getByText(/response time/i)).toBeInTheDocument();
    expect(screen.getByText(/token usage/i)).toBeInTheDocument();
  });

  test('shows models tab when clicked', () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Click on the models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    fireEvent.click(modelsTab);
    
    // Verify models content is shown
    expect(screen.getByText(/installed models/i)).toBeInTheDocument();
    expect(screen.getByText(/available models/i)).toBeInTheDocument();
  });

  test('displays correct model storage size information', () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Click on the models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    fireEvent.click(modelsTab);
    
    // Check for storage information
    expect(screen.getByText(/storage used/i)).toBeInTheDocument();
    expect(screen.getByText(/256 MB/i)).toBeInTheDocument(); // Small model size
    expect(screen.getByText(/1.2 GB/i)).toBeInTheDocument(); // Medium model size
    expect(screen.getByText(/4.8 GB/i)).toBeInTheDocument(); // Large model size
  });

  test('handles save button click', async () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Find the save settings button
    const saveButton = screen.getByRole('button', { name: /save settings/i });
    
    // Click the save button
    fireEvent.click(saveButton);
    
    // Check that toast was called with success message
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description: "AI settings have been saved successfully.",
        title: "Settings Saved",
      });
    });
  });

  test('handles download model button click', async () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Navigate to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    fireEvent.click(modelsTab);
    
    // Find a download button and click it
    const downloadButtons = screen.getAllByRole('button', { name: /download/i });
    fireEvent.click(downloadButtons[0]); // Click the first download button
    
    // Check that toast was called with download message
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Download Started",
      }));
    });
  });

  test('allows changing processing setting', async () => {
    render(
      <AIUtilsContext.Provider value={mockContextValue}>
        <AIManagement />
      </AIUtilsContext.Provider>
    );
    
    // Find the processing setting radio buttons
    const fastOption = screen.getByLabelText(/fast/i);
    const balancedOption = screen.getByLabelText(/balanced/i);
    const highQualityOption = screen.getByLabelText(/high-quality/i);
    
    // Check that balanced is selected by default (based on mock context)
    expect(balancedOption).toBeChecked();
    
    // Change to high-quality
    fireEvent.click(highQualityOption);
    
    // updateSettings should be called with new processing setting
    await waitFor(() => {
      expect(mockContextValue.updateSettings).toHaveBeenCalledWith({ processingSetting: 'high-quality' });
    });
  });
});
