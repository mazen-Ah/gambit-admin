import { useMemo } from 'react';
import { getMedia, getMediaArray } from '../../../utils/HelperFunctions';
import { DEFAULT_SUB_SECTION } from '../constants/sectionOptions';

export const useSectionInitialValues = (apiData: any, parentModuleType?: string) => {
  return useMemo(() => {
    function handleSectionInitial(section: any, isSubSection: boolean = false, index: number = 0) {
      const model = Object.entries(section?.models || {})?.[0];
      const models = model?.[1];
      const modelType = model?.[0];

      // Extract type from section_type.name if available, otherwise use type field
      let sectionType = section?.type || '';
      if (section?.section_type?.name) {
        const typeName = section.section_type.name;
        sectionType = typeof typeName === 'object'
          ? (typeName?.en || typeName?.ar || '')
          : typeName;
      }

      // Helper function to extract button_text values from various API formats
      const extractButtonText = (buttonTextSource: any) => {
        // Handle label from API response (content.buttons[].label)
        if (buttonTextSource?.label) {
          return {
            en: buttonTextSource.label.en || '',
            ar: buttonTextSource.label.ar || ''
          };
        }
        // Handle button_text_translations (API format)
        if (buttonTextSource?.button_text_translations) {
          return {
            en: buttonTextSource.button_text_translations.en || '',
            ar: buttonTextSource.button_text_translations.ar || ''
          };
        }
        // Handle button_text as object
        if (typeof buttonTextSource?.button_text === 'object' && buttonTextSource.button_text !== null) {
          return {
            en: buttonTextSource.button_text.en || '',
            ar: buttonTextSource.button_text.ar || ''
          };
        }
        // Handle button_text as string (legacy)
        if (typeof buttonTextSource?.button_text === 'string') {
          return {
            en: buttonTextSource.button_text,
            ar: buttonTextSource.button_text
          };
        }
        // Handle direct button_text on section
        if (typeof buttonTextSource === 'object' && buttonTextSource !== null && 'en' in buttonTextSource) {
          return {
            en: buttonTextSource.en || '',
            ar: buttonTextSource.ar || ''
          };
        }
        return { en: '', ar: '' };
      };

      // Process buttons - check content.buttons first (API response format), then top-level buttons, then flat fields
      let processedButtons: any[] = [];
      let processedHasButton = section?.has_button || section?.content?.has_button || 0;
      
      // Priority 1: Check content.buttons (API response format: { type, label, url })
      if (section?.content?.buttons && Array.isArray(section.content.buttons) && section.content.buttons.length > 0) {
        processedButtons = section.content.buttons.map((btn: any, btnIndex: number) => ({
          button_type: btn?.type || btn?.button_type || '',
          button_text: extractButtonText(btn),
          button_data: btn?.url || btn?.button_data || '',
          key: btnIndex + 1
        }));
        processedHasButton = 1;
      }
      // Priority 2: Check top-level buttons array
      else if (section?.buttons && Array.isArray(section.buttons) && section.buttons.length > 0) {
        processedButtons = section.buttons.map((btn: any, btnIndex: number) => ({
          button_type: btn?.type || btn?.button_type || '',
          button_text: extractButtonText(btn),
          button_data: btn?.url || btn?.button_data || '',
          key: btnIndex + 1
        }));
        processedHasButton = 1;
      }
      // Priority 3: Check flat button fields (button_type)
      else if (section?.button_type || section?.content?.button_type) {
        processedButtons = [{
          button_type: section?.button_type || section?.content?.button_type || '',
          button_text: extractButtonText(section?.content || section),
          button_data: section?.button_data || section?.content?.button_data || '',
          key: 1
        }];
        processedHasButton = 1;
      }
      // Priority 4: If has_button is explicitly 1 but no buttons, initialize empty array
      else if (processedHasButton === 1 || processedHasButton === '1') {
        processedButtons = [];
        processedHasButton = 1;
      }

      // Get first button for legacy fields
      const firstButton = processedButtons.length > 0 ? processedButtons[0] : null;

      // Handle name - can be string or object {en, ar}
      const sectionName = typeof section?.name === 'object' && section?.name !== null
        ? { en: section.name.en || '', ar: section.name.ar || '' }
        : { en: section?.name || '', ar: section?.name || '' };

      return {
        ...section,
        key: index + 1 || '',
        parent_module_type: isSubSection ? null : parentModuleType,
        disabled: section.disabled ? 1 : 0,
        type: sectionType || '',
        name: sectionName,
        content: {
          title: { en: section?.content?.title?.en || '', ar: section?.content?.title?.ar || '' },
          subtitle: { en: section?.content?.subtitle?.en || '', ar: section?.content?.subtitle?.ar || '' },
          description: { en: section?.content?.description?.en || '', ar: section?.content?.description?.ar || '' },
          short_description: { en: section?.content?.short_description?.en || '', ar: section?.content?.short_description?.ar || '' },
          reach_text: { en: section?.content?.reach_text?.en || section?.content?.rich_text?.en || '', ar: section?.content?.reach_text?.ar || section?.content?.rich_text?.ar || '' }
        },
        image_desktop: getMedia(section?.media, 'image_desktop')?.url || '',
        image_mobile: getMedia(section?.media, 'image_mobile')?.url || '',
        icon: getMedia(section?.media, 'icon')?.url || '',
        images_desktop: getMediaArray(section?.media, 'images_desktop')?.sort((a, b) => (a.order || 0) - (b.order || 0))?.map((ele: any) => ele.url) || [],
        images_mobile: getMediaArray(section?.media, 'images_mobile')?.sort((a, b) => (a.order || 0) - (b.order || 0))?.map((ele: any) => ele.url) || [],
        video_desktop: getMedia(section?.media, 'video_desktop')?.url || '',
        video_poster_desktop: getMedia(section?.media, 'video_poster_desktop')?.url || '',
        video_mobile: getMedia(section?.media, 'video_mobile')?.url || '',
        video_poster_mobile: getMedia(section?.media, 'video_poster_mobile')?.url || '',
        // Button fields - set buttons array first, then legacy fields
        has_button: processedHasButton,
        buttons: processedButtons,
        // Legacy fields for backward compatibility - sync with first button
        button_type: firstButton?.button_type || section?.button_type || '',
        button_text: firstButton?.button_text || extractButtonText(section),
        button_data: firstButton?.button_data || section?.button_data || '',
        has_relation: Object.values(section?.models || {})?.[0] ? 1 : 0,
        model: Object.keys(section?.models || {})?.[0] || '',
        model_data: ((models as any[])?.map((ele: any, index: number) => {
          return {
            make_id: modelType === "models" || modelType === "variants" ? ele?.vehicle_make_id : ele?.id,
            model_id: modelType === "models" || modelType === "variants" ? ele?.vehicle_model_id : ele?.id,
            variant_id: modelType !== "variants" ? ele?.id : '',
            order: index + 1,
            stableId: index + 1
          }
        })) || [],
        // Recursively handle sub_sections at any level
        sub_sections: section?.sub_sections?.map((ele: any, subIndex: number) => handleSectionInitial(ele, true, subIndex)) || []
      };
    }

    return {
      sections: [...(apiData?.sections?.sort((a: any, b: any) => a.order - b.order)?.map((ele: any, index: number) => handleSectionInitial(ele, false, index)) || [])]
    };
  }, [apiData, parentModuleType]);
};

export const createNewSection = (sectionsLength: number, parentModuleType?: string) => ({
  ...DEFAULT_SUB_SECTION,
  order: sectionsLength + 1,
  key: sectionsLength + 1,
  name: { en: '', ar: '' },
  type: '',
  sub_sections: [],
  parent_module_type: parentModuleType
});
