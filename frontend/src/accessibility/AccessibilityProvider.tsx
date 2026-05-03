'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AccessibilityContextType {
  announce: (message: string, politeness?: 'polite' | 'assertive') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcement, setAnnouncement] = useState('');
  const [politeness, setPoliteness] = useState<'polite' | 'assertive'>('polite');

  const announce = useCallback((message: string, level: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement(message);
    setPoliteness(level);
    // Clear after announcement to allow repeating the same message
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);

  return (
    <AccessibilityContext.Provider value={{ announce }}>
      {children}
      <div 
        className="sr-only" 
        role="status" 
        aria-live={politeness} 
        aria-atomic="true"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
