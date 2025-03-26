
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationItem from './NotificationItem';
import { Notification } from '@/types/notification';

describe('NotificationItem', () => {
  const mockNotification: Notification = {
    id: '1',
    title: 'Test Notification',
    message: 'This is a test notification',
    createdAt: new Date().toISOString(),
    read: false,
    type: 'info',
  };

  const onDismiss = jest.fn();
  const onRead = jest.fn();
  const onAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders notification correctly', () => {
    render(
      <NotificationItem
        notification={mockNotification}
        onDismiss={onDismiss}
        onRead={onRead}
      />
    );

    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a test notification')).toBeInTheDocument();
  });

  test('calls onRead when notification is clicked', () => {
    render(
      <NotificationItem
        notification={mockNotification}
        onDismiss={onDismiss}
        onRead={onRead}
      />
    );

    fireEvent.click(screen.getByText('This is a test notification'));
    expect(onRead).toHaveBeenCalledWith(mockNotification.id);
  });

  test('calls onDismiss when dismiss button is clicked', () => {
    render(
      <NotificationItem
        notification={mockNotification}
        onDismiss={onDismiss}
        onRead={onRead}
      />
    );

    // Find the dismiss button (it has an 'X' icon)
    const dismissButton = screen.getByRole('button');
    fireEvent.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalledWith(mockNotification.id);
    // Should not mark as read when just dismissing
    expect(onRead).not.toHaveBeenCalled();
  });

  test('renders actions when provided', () => {
    const notificationWithActions: Notification = {
      ...mockNotification,
      actions: [
        { id: 'action1', label: 'Accept' },
        { id: 'action2', label: 'Decline' },
      ],
    };

    render(
      <NotificationItem
        notification={notificationWithActions}
        onDismiss={onDismiss}
        onRead={onRead}
        onAction={onAction}
      />
    );

    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Decline')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Accept'));
    expect(onAction).toHaveBeenCalledWith(notificationWithActions.id, 'action1');
  });

  test('applies different styling based on notification type', () => {
    const types: Array<Notification['type']> = ['default', 'info', 'success', 'warning', 'error'];
    
    const { rerender } = render(
      <NotificationItem
        notification={mockNotification}
        onDismiss={onDismiss}
        onRead={onRead}
      />
    );

    // Test each notification type
    types.forEach((type) => {
      rerender(
        <NotificationItem
          notification={{ ...mockNotification, type }}
          onDismiss={onDismiss}
          onRead={onRead}
        />
      );
      
      // The component has different border colors based on type
      const notificationElement = screen.getByText('Test Notification').closest('div');
      expect(notificationElement).toBeInTheDocument();
      
      // For different types, we expect different classes to be applied
      if (type === 'info') {
        expect(notificationElement).toHaveClass('border-blue-500');
      } else if (type === 'success') {
        expect(notificationElement).toHaveClass('border-green-500');
      } else if (type === 'warning') {
        expect(notificationElement).toHaveClass('border-yellow-500');
      } else if (type === 'error') {
        expect(notificationElement).toHaveClass('border-red-500');
      }
    });
  });

  test('renders unread notifications with different styling', () => {
    const { rerender } = render(
      <NotificationItem
        notification={{ ...mockNotification, read: false }}
        onDismiss={onDismiss}
        onRead={onRead}
      />
    );

    // Unread notifications have font-medium class
    expect(screen.getByText('Test Notification').closest('div')).toHaveClass('font-medium');

    // Re-render with read notification
    rerender(
      <NotificationItem
        notification={{ ...mockNotification, read: true }}
        onDismiss={onDismiss}
        onRead={onRead}
      />
    );

    // Read notifications don't have font-medium class
    expect(screen.getByText('Test Notification').closest('div')).not.toHaveClass('font-medium');
  });
});
