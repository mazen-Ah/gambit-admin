import { useState, useRef, useCallback } from 'react';

export const useSubSectionManagement = () => {
  const [subSectionExpanded, setSubSectionExpanded] = useState<Record<string, number>>({});
  const subSectionExpandCallbacks = useRef<Record<string, (index: number) => void>>({});

  const handleSubSectionExpanded = useCallback((sectionIndex: number, subSectionIndex: number) => {
    const key = `section-${sectionIndex}`;

    if (subSectionExpandCallbacks.current[key]) {
      subSectionExpandCallbacks.current[key](subSectionIndex);
    } else {
      setSubSectionExpanded(prev => ({
        ...prev,
        [key]: subSectionIndex
      }));
    }
  }, []);

  const registerSubSectionCallback = useCallback((sectionIndex: number, callback: (index: number) => void) => {
    const key = `section-${sectionIndex}`;
    subSectionExpandCallbacks.current[key] = callback;
  }, []);

  return {
    subSectionExpanded,
    handleSubSectionExpanded,
    registerSubSectionCallback
  };
};
