
/**
 * Accessibility utilities for the CILS Italian Citizenship platform
 */

// Keyboard navigation focus trap
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return () => {};
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  // Focus the first element
  firstElement.focus();
  
  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    // Shift + Tab to go backwards
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } 
    // Tab to go forwards
    else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

// Announce messages to screen readers
export function announceToScreenReader(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  const announcer = document.getElementById('screen-reader-announcer');

  if (!announcer) {
    const newAnnouncer = document.createElement('div');
    newAnnouncer.id = 'screen-reader-announcer';
    newAnnouncer.className = 'sr-only';
    newAnnouncer.setAttribute('aria-live', politeness);
    newAnnouncer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(newAnnouncer);
    
    // Small delay to ensure screen readers register
    setTimeout(() => {
      newAnnouncer.textContent = message;
    }, 100);
  } else {
    // Clear and set with small delay for screen reader to pick up the change
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }
}

// Add accessible labels to elements dynamically
export function setAccessibleLabel(element: HTMLElement, label: string): void {
  if (!element) return;
  
  if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
    // Find or create a label
    const inputElement = element as HTMLInputElement;
    const inputId = inputElement.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    inputElement.id = inputId;
    
    const existingLabel = document.querySelector(`label[for="${inputId}"]`);
    if (existingLabel) {
      existingLabel.textContent = label;
    } else {
      const labelElement = document.createElement('label');
      labelElement.htmlFor = inputId;
      labelElement.textContent = label;
      labelElement.classList.add('sr-only');
      inputElement.parentNode?.insertBefore(labelElement, inputElement);
    }
  } else {
    // Use aria-label for other elements
    element.setAttribute('aria-label', label);
  }
}

// Check if reduced motion is preferred
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Create accessible keyboard shortcuts
export function setupKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { alt?: boolean; ctrl?: boolean; shift?: boolean; meta?: boolean; description: string }
): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      e.key.toLowerCase() === key.toLowerCase() &&
      e.altKey === !!options.alt &&
      e.ctrlKey === !!options.ctrl &&
      e.shiftKey === !!options.shift &&
      e.metaKey === !!options.meta &&
      // Ignore shortcuts when in form fields
      !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '')
    ) {
      e.preventDefault();
      callback();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  // Register in shortcut registry for help modal
  registerKeyboardShortcut(
    key,
    options.description,
    !!options.alt,
    !!options.ctrl,
    !!options.shift,
    !!options.meta
  );
  
  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    unregisterKeyboardShortcut(key, !!options.alt, !!options.ctrl, !!options.shift, !!options.meta);
  };
}

// Keyboard shortcut registry
interface KeyboardShortcutInfo {
  key: string;
  description: string;
  alt: boolean;
  ctrl: boolean;
  shift: boolean;
  meta: boolean;
}

const keyboardShortcuts: KeyboardShortcutInfo[] = [];

// Register keyboard shortcut
function registerKeyboardShortcut(
  key: string,
  description: string,
  alt: boolean,
  ctrl: boolean,
  shift: boolean,
  meta: boolean
): void {
  keyboardShortcuts.push({ key, description, alt, ctrl, shift, meta });
}

// Unregister keyboard shortcut
function unregisterKeyboardShortcut(
  key: string,
  alt: boolean,
  ctrl: boolean,
  shift: boolean,
  meta: boolean
): void {
  const index = keyboardShortcuts.findIndex(
    s => s.key === key && s.alt === alt && s.ctrl === ctrl && s.shift === shift && s.meta === meta
  );
  
  if (index !== -1) {
    keyboardShortcuts.splice(index, 1);
  }
}

// Get all registered keyboard shortcuts
export function getKeyboardShortcuts(): KeyboardShortcutInfo[] {
  return [...keyboardShortcuts];
}

// Format keyboard shortcut for display
export function formatKeyboardShortcut(shortcut: KeyboardShortcutInfo): string {
  const modifiers = [];
  if (shortcut.ctrl) modifiers.push('Ctrl');
  if (shortcut.alt) modifiers.push('Alt');
  if (shortcut.shift) modifiers.push('Shift');
  if (shortcut.meta) modifiers.push(navigator.platform.includes('Mac') ? '⌘' : 'Win');
  
  const key = shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key;
  
  return [...modifiers, key].join(' + ');
}
