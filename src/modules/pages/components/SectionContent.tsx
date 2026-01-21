import React, { Fragment, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import FormUpload from '../../../components/formInputs/FormUpload';
import FormGalleryUpload from '../../../components/formInputs/FormGalleryUpload';

interface SectionContentProps {
  sectionName: string;
  sectionType: string;
  sectionTypeData?: any;
}

// Helper to check if a property is enabled
const isEnabled = (value: any) => value === 1 || value === true;

const SectionContent: React.FC<SectionContentProps> = ({ sectionName, sectionType, sectionTypeData }) => {
  const { t } = useTranslation();
  const formik = useFormikContext();

  const renderTextContent = useCallback(() => {
    const elements = [];
    
    if (isEnabled(sectionTypeData?.has_title)) {
      elements.push(
        <div key="title" className="inputs_group">
        <FieldWrapper fast title={t('title_en')} inputName={`${sectionName}.content.title.en`} inputPlaceholder={t('title_en')} input />
        <FieldWrapper fast title={t('title_ar')} inputName={`${sectionName}.content.title.ar`} inputPlaceholder={t('title_ar')} input />
      </div>
      );
    }

    if (isEnabled(sectionTypeData?.has_subtitle)) {
      elements.push(
        <div key="subtitle" className="inputs_group">
        <FieldWrapper fast title={t('subtitle_en')} inputName={`${sectionName}.content.subtitle.en`} inputPlaceholder={t('subtitle_en')} input />
        <FieldWrapper fast title={t('subtitle_ar')} inputName={`${sectionName}.content.subtitle.ar`} inputPlaceholder={t('subtitle_ar')} input />
      </div>
      );
    }

    if (isEnabled(sectionTypeData?.has_description)) {
      elements.push(
        <div key="description" className="inputs_group">
        <FieldWrapper fast title={t('description_en')} inputName={`${sectionName}.content.description.en`} inputPlaceholder={t('description_en')} textArea />
        <FieldWrapper fast title={t('description_ar')} inputName={`${sectionName}.content.description.ar`} inputPlaceholder={t('description_ar')} textArea />
      </div>
      );
    }

    if (isEnabled(sectionTypeData?.has_short_description)) {
      elements.push(
        <div key="short_description" className="inputs_group">
          <FieldWrapper fast title={t('short_description_en')} inputName={`${sectionName}.content.short_description.en`} inputPlaceholder={t('short_description_en')} input />
          <FieldWrapper fast title={t('short_description_ar')} inputName={`${sectionName}.content.short_description.ar`} inputPlaceholder={t('short_description_ar')} input />
        </div>
      );
    }

    return elements.length > 0 ? <Fragment>{elements}</Fragment> : null;
  }, [t, sectionName, sectionTypeData]);

  const renderImageContent = useCallback(() => {
    if (!isEnabled(sectionTypeData?.has_image)) return null;

    return (
      <div className="inputs_group">
        <FieldWrapper>
          <FormUpload formik={formik} name={`${sectionName}.image_desktop`} label={t('image_desktop')} />
        </FieldWrapper>
        <FieldWrapper>
          <FormUpload formik={formik} name={`${sectionName}.image_mobile`} label={t('image_mobile')} />
        </FieldWrapper>
        {isEnabled(sectionTypeData?.has_icon) && (
          <FieldWrapper>
            <FormUpload formik={formik} name={`${sectionName}.icon`} label={t('icon')} />
          </FieldWrapper>
        )}
      </div>
    );
  }, [formik, sectionName, sectionTypeData, t]);

  const renderIconContent = useCallback(() => {
    if (!isEnabled(sectionTypeData?.has_icon) || isEnabled(sectionTypeData?.has_image)) {
      return null;
    }

    return (
      <div className="inputs_group">
        <FieldWrapper>
          <FormUpload formik={formik} name={`${sectionName}.icon`} label={t('icon')} />
        </FieldWrapper>
        <FieldWrapper />
      </div>
    );
  }, [formik, sectionName, sectionTypeData, t]);

  const renderGalleryContent = useCallback(() => {
    if (!isEnabled(sectionTypeData?.has_gallery)) return null;

    return (
      <>
        <div className="inputs_group">
          <FieldWrapper>
            <FormGalleryUpload formik={formik} name={`${sectionName}.images_desktop`} label={t('images_desktop')} />
          </FieldWrapper>
        </div>
      <div className="inputs_group">
        <FieldWrapper>
            <FormGalleryUpload formik={formik} name={`${sectionName}.images_mobile`} label={t('images_mobile')} />
        </FieldWrapper>
      </div>
      </>
    );
  }, [formik, sectionName, sectionTypeData, t]);

  const renderVideoContent = useCallback(() => {
    if (!isEnabled(sectionTypeData?.has_video)) return null;

    return (
      <>
      <div className="inputs_group">
        <FieldWrapper>
          <FormUpload formik={formik} name={`${sectionName}.video_desktop`} video label={t('video_desktop')} />
        </FieldWrapper>
        <FieldWrapper>
          <FormUpload formik={formik} name={`${sectionName}.video_poster_desktop`} label={t('video_desktop_poster')} />
        </FieldWrapper>
      </div>
      <div className="inputs_group">
        <FieldWrapper>
          <FormUpload formik={formik} name={`${sectionName}.video_mobile`} video label={t('video_mobile')} />
        </FieldWrapper>
        <FieldWrapper>
          <FormUpload formik={formik} name={`${sectionName}.video_poster_mobile`} label={t('video_mobile_poster')} />
        </FieldWrapper>
      </div>
      </>
    );
  }, [formik, sectionName, sectionTypeData, t]);

  const renderRichText = useCallback(() => (
    <Fragment>
      <div className="inputs_group custom_rich_text_input">
        <FieldWrapper
          title={t('rich_text_en')}
          inputName={`${sectionName}.content.reach_text.en`}
          inputPlaceholder={t('rich_text_en')}
          textEditor
        />
      </div>
      <div className="inputs_group custom_rich_text_input">
        <FieldWrapper
          title={t('rich_text_ar')}
          inputName={`${sectionName}.content.reach_text.ar`}
          inputPlaceholder={t('rich_text_ar')}
          textEditor
        />
      </div>
    </Fragment>
  ), [sectionName, t]);

  const content = useMemo(() => {
    const elements = [];

    if (sectionTypeData) {
      // Render text fields if any are enabled
      if (isEnabled(sectionTypeData.has_title) || isEnabled(sectionTypeData.has_subtitle) ||
          isEnabled(sectionTypeData.has_description) || isEnabled(sectionTypeData.has_short_description)) {
        const text = renderTextContent();
        if (text) elements.push(text);
      }

      const image = renderImageContent();
      if (image) elements.push(image);

      const icon = renderIconContent();
      if (icon) elements.push(icon);

      const gallery = renderGalleryContent();
      if (gallery) elements.push(gallery);

      const video = renderVideoContent();
      if (video) elements.push(video);

      // Render rich text if enabled in section type data or if section type includes 'rich_editor'
      // Check both has_reach_text (API field) and has_rich_text (internal field)
      if (isEnabled(sectionTypeData?.has_reach_text) || isEnabled(sectionTypeData?.has_rich_text) || sectionType?.includes('rich_editor')) {
        elements.push(renderRichText());
      }
    } else {
      // Fallback to string-based logic
      if (sectionType?.includes('text')) elements.push(renderTextContent());
      if (sectionType?.includes('image')) elements.push(renderImageContent());
      if (sectionType?.includes('icon') && !sectionType?.includes('image')) elements.push(renderIconContent());
      if (sectionType?.includes('gallery')) elements.push(renderGalleryContent());
      if (sectionType?.includes('video')) elements.push(renderVideoContent());
      if (sectionType?.includes('rich_editor')) elements.push(renderRichText());
    }

    return elements;
  }, [sectionType, sectionTypeData, renderTextContent, renderImageContent, renderIconContent, renderGalleryContent, renderVideoContent, renderRichText]);

  return <Fragment>{content}</Fragment>;
};

export default SectionContent;
