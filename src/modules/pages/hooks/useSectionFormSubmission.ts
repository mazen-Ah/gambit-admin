import { useCallback } from 'react';
import { IPage, ISection } from '../types/interfaces';

interface UseSectionFormSubmissionProps {
  pageData: IPage;
  id: string | undefined;
  handleSubmit: (values: any) => void;
  parentType?: string;
}

export const useSectionFormSubmission = ({ pageData, id, handleSubmit, parentType }: UseSectionFormSubmissionProps) => {
  // Reusable function to transform both sections and sub-sections
  const transformSectionData = useCallback(
    (section: any, sectionIndex: number, isSubSection: boolean = false, parentSectionData?: any) => {
      // For sub-sections, find the specific sub-section in parent's sub_sections array and use its media
      let mediaSource: any[] = [];
      let originalSectionData: any = null;

      if (isSubSection && parentSectionData?.sub_sections) {
        const foundSubSection = parentSectionData.sub_sections.find((subSec: any) => subSec.id === section.id);
        mediaSource = foundSubSection?.media || [];
        originalSectionData = foundSubSection;
      } else {
        const foundSection = pageData?.sections.find((sec: any) => sec.id === section.id);
        mediaSource = foundSection?.media || [];
        originalSectionData = foundSection;
      }

      // Detect deleted models by comparing original models with current model_data
      const detectDeletedModels = () => {
        if (!originalSectionData?.models || !section?.model) return [];

        const modelType = section.model;
        const originalModels = originalSectionData.models[modelType] || [];
        const currentModelIds = section.model_data?.map((model: any) => model?.exterior_color_id || model?.interior_color_id || model?.model_id || model?.variant_id) || [];

        // Find models that were in original but not in current
        const deletedModels = originalModels
          .filter((originalModel: any) => !currentModelIds.includes(originalModel.id))
          .map((deletedModel: any) => ({
            model_type: modelType,
            model_id: deletedModel.id
          }));

        return deletedModels;
      };

      const deletedModels = detectDeletedModels();
      const deleteAllModels = ((originalSectionData?.models && Object.keys(originalSectionData.models).length > 0 && (!section.model_data || section.model_data.length === 0)) || !section?.has_relation ? 1 : 0);

      // Transform name from object {en, ar} to string (use en as default)
      const sectionName = typeof section?.name === 'object'
        ? (section?.name?.en || section?.name?.ar || '')
        : (section?.name || '');

      // Transform type: The API expects the section type ID (number), not the type name (string)
      // Use section_type.id from original data if available, otherwise try to get it from section
      let sectionTypeId = originalSectionData?.section_type?.id || section?.section_type_id || null;

      // If type is already a number, use it as the ID
      if (!sectionTypeId && typeof section?.type === 'number') {
        sectionTypeId = section.type;
      }

      // Transform images_desktop and images_mobile
      // Convert string URLs to IDs, keep File objects as-is
      // Note: transformImages function removed as it was unused

      const imagesDesktop = Array.isArray(section?.images_desktop) ? section.images_desktop : (section?.images_desktop ? [section.images_desktop] : []);
      const imagesMobile = Array.isArray(section?.images_mobile) ? section.images_mobile : (section?.images_mobile ? [section.images_mobile] : []);

      // Always use sequential order based on index to avoid duplicates
      // Order should be 1-based (1, 2, 3, ...) and sequential
      const sectionOrder = sectionIndex + 1;

      // Process button data to include in content object as an array
      const processButtonData = () => {
        // First check if buttons array exists and has items
        const hasButtonsArray = section?.buttons && Array.isArray(section.buttons) && section.buttons.length > 0;
        const hasButtonType = section?.button_type && section.button_type !== '';
        const hasButtonField = section?.has_button === 1 || section?.has_button === '1';

        // If we have buttons in array or button_type, we have buttons
        if (!hasButtonsArray && !hasButtonType && !hasButtonField) {
          return {
            has_button: 0,
            buttons: []
          };
        }

        // Normalize button_text to always be { en: string, ar: string }
        const normalizeButtonText = (text: any): { en: string; ar: string } => {
          if (!text) return { en: '', ar: '' };
          if (typeof text === 'object' && text !== null) {
            return {
              en: text.en || '',
              ar: text.ar || ''
            };
          }
          return { en: '', ar: '' };
        };

        // Process all buttons from array
        let buttonsArray: any[] = [];

        if (hasButtonsArray) {
          // Map all buttons from the array to API format (type, label, url)
          buttonsArray = section.buttons.map((btn: any) => ({
            type: btn?.button_type || btn?.type || null,
            label: normalizeButtonText(btn?.button_text || btn?.label),
            url: btn?.button_data || btn?.url || ''
          }));
        } else if (hasButtonType) {
          // Convert flat button fields to array with one button in API format
          buttonsArray = [{
            type: section.button_type || section.content?.button_type || null,
            label: normalizeButtonText(section.button_text || section.content?.button_text),
            url: section.button_data || section.content?.button_data || ''
          }];
        }

        return {
          has_button: buttonsArray.length > 0 ? 1 : 0,
          buttons: buttonsArray
        };
      };

      const buttonData = processButtonData();

      // Merge button data into content object
      const contentWithButtons = {
        ...(section?.content || {}),
        ...buttonData
      };

      const transformedSection: any = {
        id: section?.id || null,
        type: section?.type.toLowerCase(),
        name: sectionName,
        order: sectionOrder,
        content: contentWithButtons,
        disabled: section?.disabled || 0,
        has_relation: section?.has_relation || 0,
        model: section?.has_relation ? section?.model : '',
        models: null,
        model_data: section?.has_relation ? section?.model_data?.map((model: any, modelIndex: number) => ({
          model_id: model?.exterior_color_id || model?.interior_color_id || model?.model_id || model?.variant_id,
          order: modelIndex + 1
        })) : null,
        deleted_models: deletedModels,
        delete_all_models: deleteAllModels,
        // Media fields: transform URLs to IDs, keep File objects as-is
        icon: section?.icon,
        image_desktop: section?.image_desktop,
        image_mobile: section?.image_mobile,
        video_desktop: section?.video_desktop,
        video_poster_desktop: section?.video_poster_desktop,
        video_mobile: section?.video_mobile,
        video_poster_mobile: section?.video_poster_mobile,
        // Gallery fields: transform arrays
        images_desktop: imagesDesktop,
        images_mobile: imagesMobile,
        parent_type: isSubSection ? null : (parentType || 'page').toLowerCase(),
        parent_id: isSubSection ? section?.section_id : Number(id),
        sub_sections: section?.sub_sections?.map((subSection: ISection, subIndex: number) => transformSectionData(subSection, subIndex, true, section))
      };

      // Remove fields that should not be sent to API (buttons are now in content, not at top level)
      // Note: fieldsToRemove variable removed as it was unused
      console.log(transformedSection, "transformedSection");

      return transformedSection;
    },
    [id, pageData, parentType]
  );

  const transformFormValues = useCallback(
    (values: any) => {
      return {
        sections: values?.sections?.map((section: any, sectionIndex: number) => transformSectionData(section, sectionIndex, false)) || []
      };
    },
    [transformSectionData]
  );

  const handleFormSubmit = useCallback(
    (values: any) => {
      const transformedValues = transformFormValues(values);

      // Normalize order values to ensure they're sequential and unique
      // Each parent section's sub-sections should have their own sequential order (1, 2, 3...)
      const normalizeOrders = (sections: any[]): any[] => {
        if (!sections || !Array.isArray(sections)) return sections;

        return sections.map((section: any, index: number) => {
          // Create a new object to avoid mutation issues
          const normalizedSection = {
            ...section,
            // Always set order based on current array index (1-based)
            order: index + 1
          };

          // Recursively normalize sub_sections orders - each parent's sub-sections get their own sequence
          if (normalizedSection.sub_sections && Array.isArray(normalizedSection.sub_sections)) {
            normalizedSection.sub_sections = normalizeOrders(normalizedSection.sub_sections);
          }

          return normalizedSection;
        });
      };

      // Ensure all sections (including nested sub_sections) have images_desktop and images_mobile
      const ensureImagesFields = (sections: any[]): any[] => {
        return sections.map((section: any) => {
          // Ensure images_desktop and images_mobile are always arrays
          if (!Array.isArray(section.images_desktop)) {
            section.images_desktop = [];
          }
          if (!Array.isArray(section.images_mobile)) {
            section.images_mobile = [];
          }
          // Recursively handle sub_sections
          if (section.sub_sections && Array.isArray(section.sub_sections)) {
            section.sub_sections = ensureImagesFields(section.sub_sections);
          }
          return section;
        });
      };

      if (transformedValues.sections) {
        // First normalize orders to ensure sequential unique values
        transformedValues.sections = normalizeOrders(transformedValues.sections);
        // Then ensure images fields
        transformedValues.sections = ensureImagesFields(transformedValues.sections);
      }
      console.log(transformedValues, "transformedValues");

      handleSubmit(transformedValues);
    },
    [transformFormValues, handleSubmit]
  );

  return {
    handleFormSubmit
  };
};
