import * as Yup from 'yup';

export const createSectionValidationSchema = (t: (key: string) => string, sectionTypes?: any[]) => {
  // Helper to find section type by name
  const findSectionType = (typeName: string) => {
    if (!sectionTypes || !typeName) return null;
    return sectionTypes.find((type: any) => {
      const name = typeof type.name === 'object' 
        ? (type.name?.en || type.name?.ar) 
        : type.name;
      return name === typeName;
    }) || null;
  };

  // Helper to check if section type has a property
  const sectionTypeHas = (typeName: string, property: string): boolean => {
    const sectionType = findSectionType(typeName);
    if (!sectionType) return false;
    const value = sectionType[property];
    return value === true || value === 1 || value === '1';
  };

  function requiredIfEquals(field: string, expected: string | number, customSchema?: any, message: string = t('required')) {
    return Yup.mixed().when(field, ([value]: any, schema: any) => {
      if (String(value) === String(expected)) {
        return customSchema || schema.required(message);
      }
      return schema;
    });
  }

  function requiredIfSectionTypeHas(property: string, customSchema?: any, message: string = t('required')) {
    return Yup.mixed().when('type', ([typeValue]: any, schema: any) => {
      if (sectionTypeHas(typeValue, property)) {
        return customSchema || schema.required(message);
      }
      return schema;
    });
  }

  function requiredIfTypeIncludes(expected: string, customSchema?: any, message: string = t('required')) {
    return Yup.mixed().when('type', ([value]: any, schema: any) => {
      if (typeof value === 'string' && value.includes(expected)) {
        return customSchema || schema.required(message);
      }
      return schema;
    });
  }

  // Dynamic content validation based on section type
  const contentSchema = Yup.mixed().when('type', {
    is: (typeValue: any) => !!typeValue,
    then: (schema) => {
      return Yup.lazy((value: any, options: any) => {
        // Get parent type from options
        const parent = options?.parent;
        const typeValue = parent?.type;
        const sectionType = typeValue ? findSectionType(typeValue) : null;
        
        const contentShape: any = {};
        
        if (sectionType?.has_title) {
          contentShape.title = Yup.object({
            en: Yup.string().required(t('required')),
            ar: Yup.string().required(t('required'))
          }).required(t('required'));
        }
        
        if (sectionType?.has_subtitle) {
          contentShape.subtitle = Yup.object({
            en: Yup.string().required(t('required')),
            ar: Yup.string().required(t('required'))
          }).required(t('required'));
        }
        
        if (sectionType?.has_description) {
          contentShape.description = Yup.object({
            en: Yup.string().required(t('required')),
            ar: Yup.string().required(t('required'))
          }).required(t('required'));
        }
        
        if (sectionType?.has_short_description) {
          contentShape.short_description = Yup.object({
            en: Yup.string().required(t('required')),
            ar: Yup.string().required(t('required'))
          }).required(t('required'));
        }
        
        if (sectionType?.has_rich_text) {
          contentShape.reach_text = Yup.object({
            en: Yup.string().required(t('required')),
            ar: Yup.string().required(t('required'))
          }).required(t('required'));
        }

        // If section type has any content fields, content is required
        const hasContentFields = sectionType?.has_title || sectionType?.has_subtitle || 
                                 sectionType?.has_description || sectionType?.has_short_description || 
                                 sectionType?.has_rich_text;
        
        if (hasContentFields) {
          return Yup.object().shape(contentShape).required(t('required'));
        }
        
        return Yup.mixed();
      });
    },
    otherwise: (schema) => schema
  });

  const sectionValidationSchemaObject = {
    name: Yup.object({
      en: Yup.string().required(t('required')),
      ar: Yup.string().required(t('required'))
    }).required(t('required')),
    type: Yup.string().required(t('required')),
    content: contentSchema,
    image_desktop: requiredIfSectionTypeHas('has_image', Yup.mixed().required(t('required'))),
    image_mobile: requiredIfSectionTypeHas('has_image', Yup.mixed().required(t('required'))),
    icon: requiredIfSectionTypeHas('has_icon', Yup.mixed().required(t('required'))),
    images_desktop: requiredIfSectionTypeHas('has_gallery', Yup.array().of(Yup.mixed()).min(1, t('at_least_one')).required(t('required'))),
    images_mobile: requiredIfSectionTypeHas('has_gallery', Yup.array().of(Yup.mixed()).min(1, t('at_least_one')).required(t('required'))),
    video_desktop: requiredIfSectionTypeHas('has_video', Yup.mixed().required(t('required'))),
    video_poster_desktop: requiredIfSectionTypeHas('has_video', Yup.mixed().required(t('required'))),
    video_mobile: requiredIfSectionTypeHas('has_video', Yup.mixed().required(t('required'))),
    video_poster_mobile: requiredIfSectionTypeHas('has_video', Yup.mixed().required(t('required'))),
    has_button: Yup.string(),
    // Buttons array validation - required if section type has_buttons OR has_button is 1
    buttons: Yup.mixed().when(['type', 'has_button'], {
      is: (typeValue: any, hasButton: any) => {
        const hasButtonsFromType = sectionTypeHas(typeValue, 'has_buttons');
        const hasButtonSet = String(hasButton) === '1';
        return hasButtonsFromType || hasButtonSet;
      },
      then: (schema) => Yup.array()
        .of(
          Yup.object().shape({
            button_type: Yup.string().required(t('required')),
            button_text: Yup.object({
              en: Yup.string().required(t('required')),
              ar: Yup.string().required(t('required'))
            }).required(t('required')),
            button_data: Yup.string().required(t('required'))
          })
        )
        .min(1, t('at_least_one'))
        .required(t('required')),
      otherwise: (schema) => schema
    }),
    // Legacy single button fields - only validate if (section type has_buttons OR has_button is 1) AND buttons array is empty/missing
    button_type: Yup.mixed().when(['type', 'has_button', 'buttons'], {
      is: (typeValue: any, hasButton: any, buttons: any) => {
        const hasButtonsFromType = sectionTypeHas(typeValue, 'has_buttons');
        const hasButtonSet = String(hasButton) === '1';
        const hasButtons = buttons && Array.isArray(buttons) && buttons.length > 0;
        return (hasButtonsFromType || hasButtonSet) && !hasButtons;
      },
      then: (schema) => schema.required(t('required')),
      otherwise: (schema) => schema
    }),
    button_text: Yup.mixed().when(['type', 'has_button', 'buttons'], {
      is: (typeValue: any, hasButton: any, buttons: any) => {
        const hasButtonsFromType = sectionTypeHas(typeValue, 'has_buttons');
        const hasButtonSet = String(hasButton) === '1';
        const hasButtons = buttons && Array.isArray(buttons) && buttons.length > 0;
        return (hasButtonsFromType || hasButtonSet) && !hasButtons;
      },
      then: (schema) => Yup.object({
        en: Yup.string().required(t('required')),
        ar: Yup.string().required(t('required'))
      }).required(t('required')),
      otherwise: (schema) => schema
    }),
    button_data: Yup.mixed().when(['type', 'has_button', 'buttons'], {
      is: (typeValue: any, hasButton: any, buttons: any) => {
        const hasButtonsFromType = sectionTypeHas(typeValue, 'has_buttons');
        const hasButtonSet = String(hasButton) === '1';
        const hasButtons = buttons && Array.isArray(buttons) && buttons.length > 0;
        return (hasButtonsFromType || hasButtonSet) && !hasButtons;
      },
      then: (schema) => schema.required(t('required')),
      otherwise: (schema) => schema
    }),
    model_data: requiredIfEquals(
      'has_relation',
      1,
      Yup.array()
        .of(
          Yup.object().shape({
            model_id: Yup.number().required(t('required')),
            // order: Yup.number().required(t('required'))
          })
        )
        .min(1, t('at_least_one'))
        .required(t('required'))
    ),
    model: requiredIfEquals('has_relation', 1, Yup.string().required())
  };

  // Create recursive validation schema using Yup.lazy for nested subsections
  const createSectionSchema = (): any => {
    return Yup.lazy(() =>
      Yup.object().shape({
        ...sectionValidationSchemaObject,
        sub_sections: Yup.array().of(createSectionSchema())
      })
    );
  };

  return Yup.object().shape({
    sections: Yup.array().of(createSectionSchema())
  });
};
