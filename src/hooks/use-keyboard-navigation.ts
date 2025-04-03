
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { announceToScreenReader } from '@/utils/a11y';

// Define nav items and their routes for keyboard shortcuts
interface NavItem {
  key: string;
  route: string;
  label: string;
}

// Default navigation shortcuts
const defaultNavItems: NavItem[] = [
  { key: 'h', route: '/', label: 'Home' },
  { key: 'd', route: '/dashboard', label: 'Dashboard' },
  { key: 'p', route: '/progress', label: 'Progress' },
  { key: 'a', route: '/analytics', label: 'Analytics' },
  { key: 's', route: '/subscription', label: 'Subscription' },
  { key: 'c', route: '/support-center', label: 'Support' },
];

/**
 * Hook for keyboard navigation and shortcuts
 */
export function useKeyboardNavigation(customNavItems?: NavItem[]) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navItems = customNavItems || defaultNavItems;
  
  useEffect(() => {
    // Toggle help modal with ?
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '')) {
        return;
      }
      
      // Show keyboard shortcuts help with "?"
      if (event.key === '?' && !isModalOpen) {
        event.preventDefault();
        setIsModalOpen(true);
        announceToScreenReader('Keyboard shortcuts help dialog opened');
        return;
      }
      
      // Close help modal with Escape
      if (event.key === 'Escape' && isModalOpen) {
        event.preventDefault();
        setIsModalOpen(false);
        announceToScreenReader('Keyboard shortcuts help dialog closed');
        return;
      }
      
      // Process navigation shortcuts (Alt + key)
      if (event.altKey && !isModalOpen) {
        const navItem = navItems.find(item => item.key.toLowerCase() === event.key.toLowerCase());
        if (navItem) {
          event.preventDefault();
          navigate(navItem.route);
          announceToScreenReader(`Navigated to ${navItem.label}`);
        }
      }
      
      // Search with / key
      if (event.key === '/' && !isModalOpen) {
        event.preventDefault();
        // Focus search input if exists
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          announceToScreenReader('Search input focused');
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Handle arrow key navigation for interactive elements
    const handleArrowKeys = (event: KeyboardEvent) => {
      // Only handle arrow keys
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
      }
      
      // Skip if user is typing in an input or modal is open
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '') || 
        isModalOpen
      ) {
        return;
      }
      
      // Find all interactive elements
      const interactiveElements = Array.from(
        document.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[];
      
      // If nothing is focused yet, focus the first element
      if (!document.activeElement || document.activeElement === document.body) {
        if (interactiveElements.length > 0) {
          event.preventDefault();
          interactiveElements[0].focus();
          announceToScreenReader(`Focused ${interactiveElements[0].textContent || 'element'}`);
        }
        return;
      }
      
      // If an element is already focused, find the next element in the appropriate direction
      const currentIndex = interactiveElements.findIndex(el => el === document.activeElement);
      if (currentIndex === -1) return;
      
      let nextIndex = currentIndex;
      
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % interactiveElements.length;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          nextIndex = (currentIndex - 1 + interactiveElements.length) % interactiveElements.length;
          break;
      }
      
      if (nextIndex !== currentIndex) {
        event.preventDefault();
        interactiveElements[nextIndex].focus();
        announceToScreenReader(
          `Focused ${interactiveElements[nextIndex].textContent || 'element'}`
        );
      }
    };
    
    document.addEventListener('keydown', handleArrowKeys);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleArrowKeys);
    };
  }, [navigate, isModalOpen, navItems]);
  
  // Generate help text for keyboard shortcuts
  const getShortcutHelpText = () => {
    return [
      { key: '?', description: 'Show/hide keyboard shortcuts' },
      { key: 'Esc', description: 'Close dialogs or modals' },
      { key: '/', description: 'Focus search' },
      ...navItems.map(item => ({ 
        key: `Alt + ${item.key.toUpperCase()}`, 
        description: `Navigate to ${item.label}` 
      })),
      { key: 'Tab', description: 'Move focus to next element' },
      { key: 'Shift + Tab', description: 'Move focus to previous element' },
      { key: 'Enter/Space', description: 'Activate focused element' },
    ];
  };
  
  return {
    isHelpModalOpen: isModalOpen,
    closeHelpModal: () => setIsModalOpen(false),
    openHelpModal: () => setIsModalOpen(true),
    toggleHelpModal: () => setIsModalOpen(prev => !prev),
    shortcuts: getShortcutHelpText(),
    currentPath: location.pathname
  };
}

export default useKeyboardNavigation;
