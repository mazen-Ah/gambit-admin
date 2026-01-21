import { useCallback, useRef } from 'react';
import { scrollToAccordionError } from '../../../utils/HelperFunctions';
import { setNestedObjectValues } from 'formik';

interface UseSectionErrorHandlingProps {
  formRef: React.RefObject<HTMLDivElement>;
  setExpanded: React.Dispatch<React.SetStateAction<number>>;
  setHasSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubSectionExpanded: (sectionIndex: number, subSectionIndex: number) => void;
}

export const useSectionErrorHandling = ({
  formRef,
  setExpanded,
  setHasSubmitted,
  handleSubSectionExpanded
}: UseSectionErrorHandlingProps) => {
  const hasErrorInSection = useCallback((sectionErrors: any) => {
    if (!sectionErrors || typeof sectionErrors !== 'object') return false;
    
    // Check for direct errors (excluding sub_sections)
    const hasDirectErrors = Object.keys(sectionErrors).some(key => 
      key !== 'sub_sections' && sectionErrors[key]
    );
    
    if (hasDirectErrors) return true;
    
    // Check for sub_sections errors
    if (sectionErrors.sub_sections && Array.isArray(sectionErrors.sub_sections)) {
      return sectionErrors.sub_sections.some((subSectionError: any) => 
        subSectionError && typeof subSectionError === 'object' && Object.keys(subSectionError).length > 0
      );
    }
    
    return false;
  }, []);

  const handleSubmitClick = useCallback(async (formik: any) => {
    // Validate first to decide whether to mark as submitted
    const errors = await formik.validateForm();
    const hasErrors = Object.keys(errors || {}).length > 0;
    setHasSubmitted(hasErrors);
    
    if (hasErrors) {
      formik.setTouched(setNestedObjectValues(formik.values, true));
      scrollToAccordionError(true, formRef, errors, formik.values.sections, setExpanded, handleSubSectionExpanded);
    }
  }, [setHasSubmitted, formRef, setExpanded, handleSubSectionExpanded]);

  return {
    hasErrorInSection,
    handleSubmitClick
  };
};
