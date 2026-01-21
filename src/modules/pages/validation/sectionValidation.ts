import * as Yup from 'yup';

export const createSectionValidationSchema = (t: (key: string) => string) => {
  function requiredIfEquals(field: string, expected: string | number, customSchema?: any, message: string = t('required')) {
    return Yup.mixed().when(field, ([value]: any, schema: any) => {
      if (String(value) === String(expected)) {
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

  const sectionValidationSchemaObject = {
    name: Yup.object({
      en: Yup.string().required(t('required')),
      ar: Yup.string().required(t('required'))
    }).required(t('required')),
    type: Yup.string().required(t('required')),
    content: requiredIfTypeIncludes(
      'text',
      Yup.object()
        .shape({
          // title: Yup.object().shape({ 
          //   en: Yup.string().required(t('required')), 
          //   ar: Yup.string().required(t('required')) 
          // }),
          // subtitle: Yup.object().shape({ en: Yup.string().required(t('required')), ar: Yup.string().required(t('required')) }),
          // description: Yup.object().shape({ en: Yup.string().required(t('required')), ar: Yup.string().required(t('required')) })
        })
        .required(t('required'))
    ),
    image_desktop: requiredIfTypeIncludes('image'),
    image_mobile: requiredIfTypeIncludes('image'),
    icon: requiredIfTypeIncludes('icon'),
    images_desktop: requiredIfTypeIncludes('gallery', Yup.array().of(Yup.mixed()).min(1, t('at_least_one')).required(t('required'))),
    images_mobile: requiredIfTypeIncludes('gallery', Yup.array().of(Yup.mixed()).min(1, t('at_least_one')).required(t('required'))),
    video_desktop: requiredIfTypeIncludes('video'),
    video_poster_desktop: requiredIfTypeIncludes('video'),
    video_mobile: requiredIfTypeIncludes('video'),
    video_poster_mobile: requiredIfTypeIncludes('video'),
    has_button: Yup.string(),
    // Buttons array validation - required if has_button is 1
    buttons: Yup.mixed().when('has_button', {
      is: (hasButton: any) => String(hasButton) === '1',
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
    // Legacy single button fields - only validate if has_button is 1 AND buttons array is empty/missing
    button_type: Yup.mixed().when(['has_button', 'buttons'], {
      is: (hasButton: any, buttons: any) => {
        const hasButtons = buttons && Array.isArray(buttons) && buttons.length > 0;
        return String(hasButton) === '1' && !hasButtons;
      },
      then: (schema) => schema.required(t('required')),
      otherwise: (schema) => schema
    }),
    button_text: Yup.mixed().when(['has_button', 'buttons'], {
      is: (hasButton: any, buttons: any) => {
        const hasButtons = buttons && Array.isArray(buttons) && buttons.length > 0;
        return String(hasButton) === '1' && !hasButtons;
      },
      then: (schema) => Yup.object({
        en: Yup.string().required(t('required')),
        ar: Yup.string().required(t('required'))
      }).required(t('required')),
      otherwise: (schema) => schema
    }),
    button_data: Yup.mixed().when(['has_button', 'buttons'], {
      is: (hasButton: any, buttons: any) => {
        const hasButtons = buttons && Array.isArray(buttons) && buttons.length > 0;
        return String(hasButton) === '1' && !hasButtons;
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
