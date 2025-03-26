
import React from 'react';
import { render, screen } from '@/tests/test-utils';
import { UserTrendsChart } from './UserTrendsChart';

// Mock the recharts library
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="line-chart">{children}</div>
    ),
    Line: ({ type, dataKey, name, stroke, activeDot }: any) => (
      <div data-testid={`line-${dataKey}`} data-stroke={stroke} data-name={name}>
        {`Line: ${dataKey}`}
      </div>
    ),
    XAxis: ({ dataKey }: any) => <div data-testid="x-axis" data-key={dataKey} />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: ({ strokeDasharray }: any) => (
      <div data-testid="cartesian-grid" data-dash={strokeDasharray} />
    ),
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

describe('UserTrendsChart Component', () => {
  const mockData = [
    { name: 'Jan', users: 100, newUsers: 25 },
    { name: 'Feb', users: 120, newUsers: 30 },
    { name: 'Mar', users: 150, newUsers: 35 },
  ];

  test('renders chart container with correct height', () => {
    render(<UserTrendsChart data={mockData} />);
    
    const container = screen.getByTestId('responsive-container').parentElement;
    expect(container).toHaveClass('h-72');
  });

  test('renders ResponsiveContainer with full width and height', () => {
    render(<UserTrendsChart data={mockData} />);
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  test('renders LineChart with provided data', () => {
    render(<UserTrendsChart data={mockData} />);
    
    const lineChart = screen.getByTestId('line-chart');
    expect(lineChart).toBeInTheDocument();
  });

  test('renders X and Y axes', () => {
    render(<UserTrendsChart data={mockData} />);
    
    const xAxis = screen.getByTestId('x-axis');
    const yAxis = screen.getByTestId('y-axis');
    
    expect(xAxis).toBeInTheDocument();
    expect(xAxis).toHaveAttribute('data-key', 'name');
    expect(yAxis).toBeInTheDocument();
  });

  test('renders grid, tooltip, and legend components', () => {
    render(<UserTrendsChart data={mockData} />);
    
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toHaveAttribute('data-dash', '3 3');
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  test('renders line for total users with correct properties', () => {
    render(<UserTrendsChart data={mockData} />);
    
    const usersLine = screen.getByTestId('line-users');
    expect(usersLine).toBeInTheDocument();
    expect(usersLine).toHaveAttribute('data-stroke', '#3b82f6');
    expect(usersLine).toHaveAttribute('data-name', 'Total Users');
  });

  test('renders line for new users with correct properties', () => {
    render(<UserTrendsChart data={mockData} />);
    
    const newUsersLine = screen.getByTestId('line-newUsers');
    expect(newUsersLine).toBeInTheDocument();
    expect(newUsersLine).toHaveAttribute('data-stroke', '#22c55e');
    expect(newUsersLine).toHaveAttribute('data-name', 'New Users');
  });

  test('handles empty data case', () => {
    render(<UserTrendsChart data={[]} />);
    
    // Chart should still render with empty data
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});
