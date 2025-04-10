
// Re-export React imports to fix TypeScript errors
import React, { useState as useStateImpl, useEffect as useEffectImpl, useCallback as useCallbackImpl } from 'react';

// Re-export what we need with correct typing
export const useState = useStateImpl;
export const useEffect = useEffectImpl;
export const useCallback = useCallbackImpl;

// Export default React as a fallback
export default React;
