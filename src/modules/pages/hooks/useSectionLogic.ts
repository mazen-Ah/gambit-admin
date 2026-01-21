import { useState, useCallback } from 'react';
import { useFormikContext } from 'formik';
import { getIn } from 'formik';
import { ISection } from '../types/interfaces';

interface UseSectionLogicProps {
  index: number;
  namePref?: string;
  subSection?: boolean;
  arrayHelpers?: any;
  onSectionAdded?: (newIndex: number) => void;
  onSectionRemoved?: () => void;
}

export const useSectionLogic = ({ index, namePref, subSection, arrayHelpers, onSectionAdded, onSectionRemoved }: UseSectionLogicProps) => {
  const formik = useFormikContext<{ sections: ISection[] }>();
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | false>(false);

  const sectionName = `${namePref ? `${namePref}.` : ''}${subSection ? 'sub_sections' : 'sections'}[${index}]`;
  const sectionData = getIn(formik.values, sectionName);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (sectionData?.id) {
      setDeleteModalOpen(sectionData.id);
    } else {
      arrayHelpers?.remove(index);
      // Reset expanded state when removing section
      onSectionRemoved?.();
    }
  }, [sectionData?.id, arrayHelpers, index, onSectionRemoved]);

  const handleDuplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (sectionData && arrayHelpers) {
      const currentSections = subSection
        ? getIn(arrayHelpers.form?.values, `${namePref}.sub_sections`) as ISection[]
        : getIn(arrayHelpers.form?.values, 'sections') as ISection[];

      const duplicatedSection = {
        ...sectionData,
        id: undefined,
        key: (currentSections?.length || 0) + 1,
        order: (currentSections?.length || 0) + 1,
        name: `${sectionData.name} (Copy)`,
        created_at: undefined,
        updated_at: undefined,
        // Recursively duplicate sub_sections if they exist
        sub_sections: sectionData.sub_sections?.map((subSection: ISection, subIndex: number) => ({
          ...subSection,
          id: undefined,
          key: subIndex + 1,
          order: subIndex + 1,
          name: `${subSection.name} (Copy)`,
          created_at: undefined,
          updated_at: undefined
        }))
      };
      
      // Add the duplicated section at the end
      arrayHelpers?.push(duplicatedSection);
      
      // Expand the newly added section with animation
      const newIndex = (currentSections?.length || 0);
      // Small delay to ensure DOM renders before animation
      setTimeout(() => {
        onSectionAdded?.(newIndex);
      }, 50);
    }
  }, [sectionData, arrayHelpers, index, subSection, namePref, onSectionAdded]);

  const handleExpand = useCallback((e: React.SyntheticEvent, expanded: number, setExpanded: React.Dispatch<React.SetStateAction<number>>) => {
    e.stopPropagation();
    setExpanded(expanded === index ? -1 : index);
  }, [index]);

  const handleButtonToggle = useCallback((value: any) => {
    formik.setFieldValue(`${sectionName}.has_button`, value?.target?.checked ? 1 : 0);
  }, [formik, sectionName]);

  return {
    sectionName,
    sectionData,
    deleteModalOpen,
    setDeleteModalOpen,
    handleDelete,
    handleDuplicate,
    handleExpand,
    handleButtonToggle,
    formik
  };
};
