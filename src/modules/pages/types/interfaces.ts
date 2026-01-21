export interface IPageTableItem {
	name: string
	id?: number
	meta_title: {
		en: string
		ar: string
	}
	meta_description: {
		en: string
		ar: string
	}
	meta_image: string
}

export type IPage = {
  id: number;
  name: string;
  sections: ISection[];
};

export interface ISection {
  id: number;
  key: number;
  name: string;
  content: IContent;
  parent_type: string | null;
  parent_id: number | null;
  section_id: number | null;
  type: string;
  order: number;
  disabled: boolean;
  has_button?: boolean;
  button_type: string | null;
  button_text: {
    en: string
    ar: string
  };
  button_data: string | null;
  created_at: string;
  updated_at: string;
  has_relation?: 1 | 0;
  model?: string;
  model_type?: "exterior_colors" | "interior_colors" | "models" | "variants" | "vehicles";
  model_data?: { id: number, model_id: number, order: number }[],
  media: IMedia[];
  video: IVideo | null;
  sub_sections?: ISection[];
	sections?: ISection[]
};

export interface IVideo {
  id: number;
  url: string;
  url_mobile: string;
  poster_url: string;
  poster_mobile_url: string;
};

export interface IMedia {
  id: number;
  url: string;
  url_mobile: string | null;
  icon: string | null;
};

export interface IContent {
  title: ILangContent;
  subtitle: ILangContent;
  description: ILangContent;
};

export interface ILangContent {
  ar: string;
  en: string;
};
