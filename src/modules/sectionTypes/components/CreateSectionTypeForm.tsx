import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import SectionHeader from '../../../components/SectionHeader';
import Button from '../../../components/buttons/Button';
import { useRef, useMemo } from 'react';
import {  scrollToError } from '../../../utils/HelperFunctions';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ISectionTypeTableItem } from '../types/interfaces';
import FormDynamicSkeleton from '../../../components/loaders/FormDynamicSkeleton';
import useFormsIntegrationHelpers from '../../../hooks/useFormsIntegrationHelpers';
import FormUpload from '../../../components/formInputs/FormUpload';
import SwitchActivation from '../../../components/layout/SwitchActivation';

const CreateSectionTypeForm = () => {
  const { id } = useParams();
  const formRef = useRef(null);
  const { t } = useTranslation();

  const { apiData, getDataLoading, handleSubmit, submitLoading } = useFormsIntegrationHelpers({
    queryKey: ['section-types', id],
    id,
    invalidateQueryKey: ['section-types'],
    singleGetApi: `/cms/admin/section-types/${id}`,
    addApi: '/cms/admin/section-types',
    editApi: `/cms/admin/section-types/${id}`,
    itemName: t('section_type'),
    listRoute: '/section-types'
  });

 

  const validationSchema = Yup.object({
    name: Yup.string().required(t('required')).min(3, t('name_short')),
    description: Yup.string().required(t('required')),
  });

  // Array of section option switches
  const sectionOptions = useMemo(() => [
    { field: 'has_title', translationKey: 'has_title' },
    { field: 'has_subtitle', translationKey: 'has_subtitle' },
    { field: 'has_description', translationKey: 'has_description' },
    { field: 'has_short_description', translationKey: 'has_short_description' },
    { field: 'has_rich_text', translationKey: 'has_rich_text' },
    { field: 'has_buttons', translationKey: 'has_buttons' },
    { field: 'has_model_data', translationKey: 'has_model_data' },
    { field: 'has_child_section', translationKey: 'has_child_section' },
    { field: 'has_image', translationKey: 'has_image' },
    { field: 'has_gallery', translationKey: 'has_gallery' },
    { field: 'has_video', translationKey: 'has_video' },
    { field: 'has_icon', translationKey: 'has_icon' },
  ], []);

  const initialValues: ISectionTypeTableItem = {
    ...apiData,
    name: (typeof apiData?.name === 'object' ? apiData?.name?.en : apiData?.name) || '',
    description: (typeof apiData?.description === 'object' ? apiData?.description?.en : apiData?.description) || '',
    fields: apiData?.fields || [],
    has_title: apiData?.has_title ? 1 : 0,
    has_subtitle: apiData?.has_subtitle ? 1 : 0,
    has_description: apiData?.has_description ? 1 : 0,
    has_short_description: apiData?.has_short_description ? 1 : 0,
    has_rich_text: apiData?.has_reach_text ? 1 : 0,
    has_buttons: apiData?.has_buttons ? 1 : 0,
    has_model_data: apiData?.has_model_data ? 1 : 0,
    has_child_section: apiData?.has_child_section ? 1 : 0,
    has_image: apiData?.has_image ? 1 : 0,
    has_gallery: apiData?.has_gallery ? 1 : 0,
    has_video: apiData?.has_video ? 1 : 0,
    has_icon: apiData?.has_icon ? 1 : 0,
    image: apiData?.image
  };

  if (getDataLoading) return <FormDynamicSkeleton sections={[[{ columns: 2, items: 1 }]]} buttons={1} />;
console.log(apiData, "apiData");

  return (
    <div className={'form_section'} ref={formRef}>
      <Formik
        validateOnMount
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const transformedValues: any = {
            ...values,
            has_title: values.has_title ? 1 : 0,
            has_subtitle: values.has_subtitle ? 1 : 0,
            has_description: values.has_description ? 1 : 0,
            has_short_description: values.has_short_description ? 1 : 0,
            has_reach_text: values.has_rich_text ? 1 : 0,
            has_buttons: values.has_buttons ? 1 : 0,
            has_model_data: values.has_model_data ? 1 : 0,
            has_child_section: values.has_child_section ? 1 : 0,
            has_image: values.has_image ? 1 : 0,
            has_gallery: values.has_gallery ? 1 : 0,
            has_video: values.has_video ? 1 : 0,
            has_icon: values.has_icon ? 1 : 0,
            fields: values.fields || [],
            _method: id ? 'PUT' : 'POST'
          };
          
          // Remove has_rich_text if it exists (we're using has_reach_text for API)
          delete transformedValues.has_rich_text;

          if (id && typeof transformedValues.image === 'string') {
            delete transformedValues.image;
          }

          handleSubmit(transformedValues);
        }}
      >
        {(formik) => (
          <>
            <Form>
              <SectionHeader title={t('section_type')} customStyle="last">
                <div className="inputs_grid">
                  <FieldWrapper
                    title={t('name')}
                    inputName="name"
                    inputPlaceholder={t('name')}
                    input
                    noPadding
                    gridSize={6}
                  />
                  <FieldWrapper gridSize={6} />
                  <FieldWrapper
                    title={t('description')}
                    inputName="description"
                    inputPlaceholder={t('description_en')}
                    textArea
                    gridSize={12}
                  />
                  
                  <FieldWrapper gridSize={12}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                      <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>{t('section_options')}</h4>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
                        gap: '1.25rem',
                        padding: '1.5rem',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.08)'
                      }}>
                        {sectionOptions.map((option) => {
                          const fieldValue = formik.values[option.field as keyof typeof formik.values];
                          const isActive = fieldValue === 1 || fieldValue === true;
                          
                          return (
                            <div
                              key={option.field}
                              className="switch-option-item"
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                padding: '0.875rem 1rem',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <span style={{ fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize', color: '#1E293B' }}>
                                {t(option.translationKey)}
                              </span>
                              <SwitchActivation
                                active={isActive}
                                onChange={() => {
                                  formik.setFieldValue(option.field, isActive ? 0 : 1);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </FieldWrapper>

                  <FieldWrapper gridSize={4}>
                    <FormUpload
                      errors={formik?.errors.image as string}
                      touched={formik?.touched?.image as boolean}
                      formik={formik}
                      name="image"
                      label={t('image')}
                    />
                  </FieldWrapper>
                </div>
              </SectionHeader>
              <div className="form_button reverse">
                <Button
                  loading={submitLoading}
                  onClick={() => {
                    scrollToError(!formik.isValid, formRef);
                  }}
                >
                  <span className="bold">{t('submit')}</span>
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default CreateSectionTypeForm;
