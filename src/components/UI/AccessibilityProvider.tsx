import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  isHighContrast: boolean;
  isLargeText: boolean;
  isReducedMotion: boolean;
  isScreenReader: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReducedMotion: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isScreenReader, setIsScreenReader] = useState(false);

  useEffect(() => {
    // Check for user preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Check for screen reader
    const checkScreenReader = () => {
      const hasScreenReader = window.navigator.userAgent.includes('NVDA') ||
                             window.navigator.userAgent.includes('JAWS') ||
                             window.navigator.userAgent.includes('VoiceOver');
      setIsScreenReader(hasScreenReader);
    };

    checkScreenReader();

    // Load saved preferences
    const savedHighContrast = localStorage.getItem('adr-high-contrast') === 'true';
    const savedLargeText = localStorage.getItem('adr-large-text') === 'true';

    setIsHighContrast(savedHighContrast);
    setIsLargeText(savedLargeText);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    // Apply accessibility styles
    const root = document.documentElement;
    
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (isLargeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    if (isReducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [isHighContrast, isLargeText, isReducedMotion]);

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('adr-high-contrast', newValue.toString());
  };

  const toggleLargeText = () => {
    const newValue = !isLargeText;
    setIsLargeText(newValue);
    localStorage.setItem('adr-large-text', newValue.toString());
  };

  const toggleReducedMotion = () => {
    setIsReducedMotion(!isReducedMotion);
  };

  const value: AccessibilityContextType = {
    isHighContrast,
    isLargeText,
    isReducedMotion,
    isScreenReader,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
