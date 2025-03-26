
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import SystemTests from './SystemTests';
import { useToast } from '@/components/ui/use-toast';

// Mock the useToast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock the Helmet component
jest.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <div data-testid="helmet">{children}</div>,
}));

// Mock the SystemTester component
jest.mock('@/components/admin/SystemTester', () => ({
  __esModule: true,
  default: () => <div data-testid="system-tester">System Tester Component</div>,
}));

describe('SystemTests Page', () => {
  // Set up the mock implementation for useToast
  const mockToast = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });

  test('renders with correct title', () => {
    render(<SystemTests />);
    
    // Check for page title
    expect(screen.getByText('System Tests')).toBeInTheDocument();
    
    // Check for helmet title (for the browser tab)
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
    expect(screen.getByTestId('helmet')).toHaveTextContent('System Tests | Admin');
  });

  test('renders check for updates button', () => {
    render(<SystemTests />);
    
    const updateButton = screen.getByRole('button', { name: /check for updates/i });
    expect(updateButton).toBeInTheDocument();
  });

  test('shows toast when check for updates button is clicked', async () => {
    render(<SystemTests />);
    
    const updateButton = screen.getByRole('button', { name: /check for updates/i });
    
    // Click the update button
    userEvent.click(updateButton);
    
    // Check if toast was called with correct params
    expect(mockToast).toHaveBeenCalledWith({
      title: "Update Check",
      description: "No updates available. System is up to date.",
    });
  });

  test('renders tab navigation with correct tabs', () => {
    render(<SystemTests />);
    
    // Check for the existence of each tab
    expect(screen.getByRole('tab', { name: /diagnostics/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /system status/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /reports/i })).toBeInTheDocument();
  });

  test('shows the diagnostics tab content by default', () => {
    render(<SystemTests />);
    
    // The diagnostics tab should be active by default and show the SystemTester component
    expect(screen.getByTestId('system-tester')).toBeInTheDocument();
  });

  test('switches to system status tab when clicked', async () => {
    render(<SystemTests />);
    
    // Click the system status tab
    const statusTab = screen.getByRole('tab', { name: /system status/i });
    userEvent.click(statusTab);
    
    // Check if system status content is shown
    await waitFor(() => {
      expect(screen.getByText('System Status')).toBeInTheDocument();
      expect(screen.getByText('Core Services')).toBeInTheDocument();
      expect(screen.getByText('AI Services')).toBeInTheDocument();
      expect(screen.getByText('Database')).toBeInTheDocument();
    });
  });

  test('switches to reports tab when clicked', async () => {
    render(<SystemTests />);
    
    // Click the reports tab
    const reportsTab = screen.getByRole('tab', { name: /reports/i });
    userEvent.click(reportsTab);
    
    // Check if reports content is shown
    await waitFor(() => {
      expect(screen.getByText('System Reports')).toBeInTheDocument();
      expect(screen.getByText('Generate Error Report')).toBeInTheDocument();
      expect(screen.getByText('AI Performance Report')).toBeInTheDocument();
    });
  });

  test('shows status indicators correctly', async () => {
    render(<SystemTests />);
    
    // Switch to system status tab
    const statusTab = screen.getByRole('tab', { name: /system status/i });
    userEvent.click(statusTab);
    
    // Check if status indicators are present (green dots for healthy systems)
    await waitFor(() => {
      const statusIndicators = screen.getAllByRole('presentation');
      // Each service has a status indicator div
      expect(statusIndicators.length).toBeGreaterThanOrEqual(3);
      
      // Check that they have the correct background color class
      statusIndicators.forEach(indicator => {
        expect(indicator).toHaveClass('bg-green-500');
      });
    });
  });

  test('refresh status button is rendered and clickable', async () => {
    render(<SystemTests />);
    
    // Switch to system status tab
    const statusTab = screen.getByRole('tab', { name: /system status/i });
    userEvent.click(statusTab);
    
    // Find and click the refresh button
    await waitFor(() => {
      const refreshButton = screen.getByRole('button', { name: /refresh status/i });
      expect(refreshButton).toBeInTheDocument();
      userEvent.click(refreshButton);
      // No visible state change, but should be clickable without errors
    });
  });

  test('report generation buttons are rendered', async () => {
    render(<SystemTests />);
    
    // Switch to reports tab
    const reportsTab = screen.getByRole('tab', { name: /reports/i });
    userEvent.click(reportsTab);
    
    // Check if the report buttons are present
    await waitFor(() => {
      expect(screen.getByText('Generate Error Report')).toBeInTheDocument();
      expect(screen.getByText('AI Performance Report')).toBeInTheDocument();
    });
  });

  test('matches snapshot', () => {
    const { container } = render(<SystemTests />);
    expect(container).toMatchSnapshot();
  });
});
