export interface ISectionTypeTableItem {
    id?: number;
    name: string | { en: string; ar: string };
    description: string | { en: string; ar: string };
    fields?: string[];
    has_title?: boolean | number;
    has_subtitle?: boolean | number;
    has_description?: boolean | number;
    has_short_description?: boolean | number;
    has_rich_text?: boolean | number;
    has_buttons?: boolean | number;
    has_model_data?: boolean | number;
    has_child_section?: boolean | number;
    has_image?: boolean | number;
    has_gallery?: boolean | number;
    has_video?: boolean | number;
    has_icon?: boolean | number;
    image?: string | File;
    created_at?: string;
    updated_at?: string;
}
