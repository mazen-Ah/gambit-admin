import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import SectionHeader from '../../../components/SectionHeader';
import Button from '../../../components/buttons/Button';
import { useRef } from 'react';
import { getMedia, scrollToError } from '../../../utils/HelperFunctions';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormDynamicSkeleton from '../../../components/loaders/FormDynamicSkeleton';
import useFormsIntegrationHelpers from '../../../hooks/useFormsIntegrationHelpers';

const CreatePageForm = () => {
  const { id } = useParams();
  const formRef = useRef(null);
  const { t } = useTranslation();
console.log(id, "id");

  const { apiData, getDataLoading, handleSubmit, submitLoading } = useFormsIntegrationHelpers({
    queryKey: ['pages', id],
    id,
    invalidateQueryKey: ['pages'],
    singleGetApi: `/cms/admin/pages/${id}`,
    addApi: '/cms/admin/pages',
    editApi: `/cms/admin/pages/${id}`,
    itemName: t('page'),
    listRoute: '/pages'
  });

  const validationSchema = Yup.object({
    name: Yup.object({
      en: Yup.string().required(t('required')).min(3, t('name_short')),
      ar: Yup.string().required(t('required')).min(3, t('name_short'))
    })
  });

  const initialValues: any = {
    ...apiData,
    name: {
      en: (typeof apiData?.name === 'object' && apiData?.name ? (apiData.name as any)?.en : '') || '',
      ar: (typeof apiData?.name === 'object' && apiData?.name ? (apiData.name as any)?.ar : '') || ''
    },
    meta_title: {
      en: apiData?.meta_title?.en || '',
      ar: apiData?.meta_title?.ar || ''
    },
    meta_description: {
      en: apiData?.meta_description?.en || '',
      ar: apiData?.meta_description?.ar || ''
    },
    meta_image: getMedia(apiData?.media, 'meta_image')?.url || ''
  };

  if (getDataLoading) return <FormDynamicSkeleton sections={[[{ columns: 2, items: 1 }]]} buttons={1} />;

  return (
    <div className={'form_section'} ref={formRef}>
      <Formik
        validateOnMount
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // Only include the fields that are in the form
          const formData = {
            name: {
              en: values.name?.en || '',
              ar: values.name?.ar || ''
            },
            meta_title: {
              en: values.meta_title?.en || '',
              ar: values.meta_title?.ar || ''
            },
            meta_description: {
              en: values.meta_description?.en || '',
              ar: values.meta_description?.ar || ''
            },
            meta_image: values.meta_image || ''
          };

          let value = { ...formData, _method: 'POST' };
          if (id && +id > 0) {
            value = { ...value, _method: 'PUT' };
          }
          handleSubmit(value);
        }}
      >
        {(formik) => (
          <>
            <Form>
              <SectionHeader title={t('page_details')} customStyle="last">
                <div className="inputs_grid">
                  <FieldWrapper
                    title={t('name_en')}
                    inputName={`name[en]`}
                    inputPlaceholder={t('name_en')}
                    input
                    noPadding
                    gridSize={6}
                  />
                  <FieldWrapper
                    title={t('name_ar')}
                    inputName={`name[ar]`}
                    inputPlaceholder={t('name_ar')}
                    input
                    noPadding
                    gridSize={6}
                  />
                  {/* <FieldWrapper gridSize={6} title={t('title_en')} inputName={`meta_title[en]`} inputPlaceholder={t('title_en')} input />
                  <FieldWrapper gridSize={6} title={t('title_ar')} inputName={`meta_title[ar]`} inputPlaceholder={t('title_ar')} input />
                  <FieldWrapper gridSize={6} title={t('description_en')} inputName={`meta_description[en]`} inputPlaceholder={t('description_en')} textArea />
                  <FieldWrapper gridSize={6} title={t('description_ar')} inputName={`meta_description[ar]`} inputPlaceholder={t('description_ar')} textArea />
                  <FieldWrapper gridSize={4}>
                    <FormUpload
                      errors={formik?.errors.meta_image as string}
                      touched={formik?.touched?.meta_image as boolean}
                      formik={formik}
                      name={`meta_image`}
                      label={t('image')}
                    />
                  </FieldWrapper> */}
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

export default CreatePageForm;
