// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TFunction = (key: string) => string;

export const getSectionTypeOptions = (t: TFunction) => [
  {
    label: t('text'),
    value: 'text'
  },
  {
    label: t('rich_editor'),
    value: 'rich_editor'
  },
  {
    label: t('image'),
    value: 'image'
  },
  {
    label: t('gallery'),
    value: 'gallery'
  },
  {
    label: t('video'),
    value: 'video'
  },
  {
    label: t('text_with_rich_editor'),
    value: 'text_with_rich_editor'
  },
  {
    label: t('text_with_icon'),
    value: 'text_with_icon'
  },
  {
    label: t('text_with_image'),
    value: 'text_with_image'
  },
  {
    label: t('text_with_gallery'),
    value: 'text_with_gallery'
  },
  {
    label: t('text_with_video'),
    value: 'text_with_video'
  },
  {
    label: t('text_with_image_and_icon'),
    value: 'text_with_image_and_icon'
  }
];

export const getButtonTypeOptions = (t: TFunction) => [
  {
    label: t('url'),
    value: 'url'
  },
  {
    label: t('call'),
    value: 'call'
  }
];

export const DEFAULT_SUB_SECTION = {
  name: "",
  order: 0,
  key: 0,
  type: "",
  disabled: 0,
  content: {
    title: { en: '', ar: '' },
    subtitle: { en: '', ar: '' },
    description: { en: '', ar: '' }
  },
  image_desktop: '',
  image_mobile: '',
  icon: '',
  images_desktop: [],
  images_mobile: [],
  video_desktop: '',
  video_poster_desktop: '',
  video_mobile: '',
  video_poster_mobile: '',
  model: "",
  buttons: [],
  button_data: "",
  button_type: '',
  button_text: {
    en: "",
    ar: "",
  },
  has_button: 0,
  has_relation: 0,
  sub_sections: []
};

export const DEFAULT_MODEL_DATA = {
  make_id: '',
  model_id: '',
  variant_id: '',
  exterior_color_id: '',
  interior_color_id: '',
  order: 0
};
