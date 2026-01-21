import React, { Fragment, useMemo, useState, useRef, useEffect, useCallback } from 'react';
import PageSection from './PageSection';
import AccordionDragPreview from './AccordionDragPreview';
import { FieldArray, Form, Formik, FormikProps } from 'formik';
import Button from '../../../components/buttons/Button';
import { plusIcon } from '../../../config/variables';
import { useTranslation } from 'react-i18next';
import useFormsIntegrationHelpers from '../../../hooks/useFormsIntegrationHelpers';
import FormSkeleton from '../../../components/loaders/FormSkeleton';
import { DragContainer, DraggableItem } from '../../../components/DragDrop';
import { createSectionValidationSchema } from '../validation/sectionValidation';
import { useSectionInitialValues, createNewSection } from '../hooks/useSectionInitialValues';
import { useSectionFormSubmission } from '../hooks/useSectionFormSubmission';
import { useSectionErrorHandling } from '../hooks/useSectionErrorHandling';
import { useSubSectionManagement } from '../hooks/useSubSectionManagement';
import { useQueryClient } from '@tanstack/react-query';

export default function PageSectionsEdit({ parentModuleType, id, parentType, data, getDataLoading, queryKey }: { parentModuleType?: string, id?: string, parentType?: string, data?: any, getDataLoading?: boolean, queryKey: string }) {
  const [expanded, setExpanded] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { t } = useTranslation();
  const formContainerRef = useRef(null);
  const formikRef = useRef<FormikProps<any>>(null);
  const queryClient = useQueryClient()

  const {
    subSectionExpanded,
    handleSubSectionExpanded,
    registerSubSectionCallback
  } = useSubSectionManagement();

  const { handleSubmit, submitLoading } = useFormsIntegrationHelpers({
    id,
    editApi: `/cms/admin/sections-group`,
    itemName: t('sections'),
    onComplete: () => {
      queryClient.invalidateQueries({queryKey: [queryKey]})
      formikRef.current?.setTouched({})
      formikRef.current?.setErrors({})
    }
  });

  const validationSchema = useMemo(() => createSectionValidationSchema(t), [t]);
  const initialValues = useSectionInitialValues(data, parentModuleType);
  const { handleFormSubmit } = useSectionFormSubmission({ id, handleSubmit, pageData: {...data}, parentType });

  // Memoize initial values key to force Formik reinitialization when data changes
  const initialValuesKey = useMemo(() => {
    return data?.sections?.length ? JSON.stringify(data?.sections?.map((s: any) => s.id || s.key)) : 'empty';
  }, [data?.sections]);

  const renderPreview = useCallback((item: any, itemType: string) => (
    <AccordionDragPreview item={item} itemType={itemType} />
  ), []);

  const handleDragStart = useCallback(() => setExpanded(-1), []);

  const {
    hasErrorInSection,
    handleSubmitClick
  } = useSectionErrorHandling({
    formRef: formContainerRef,
    setExpanded,
    setHasSubmitted,
    handleSubSectionExpanded
  });

  useEffect(() => {
    if(!data?.sections?.length) {
      setExpanded(-1);
    }
  }, [data?.sections?.length])

  // Update Formik values when data changes to ensure initial values are set
  useEffect(() => {
    if (data && formikRef.current && initialValues && initialValues.sections) {
      // Only update if data has sections and formik is initialized
      if (data.sections && data.sections.length > 0 && initialValues.sections.length > 0) {
        // Use setTimeout to ensure Formik is ready
        setTimeout(() => {
          if (formikRef.current) {
            formikRef.current.setValues(initialValues);
            formikRef.current.setTouched({});
            formikRef.current.setErrors({});
          }
        }, 0);
      }
    }
  }, [data, initialValues, initialValuesKey]);

  if (getDataLoading) return <FormSkeleton />;
console.log(initialValues, "initialValues");

  return (
    <div ref={formContainerRef} className='accordions-container'>
      <Formik
        validateOnMount
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        innerRef={formikRef}
      >
        {(formik) => (
          <Form>
            <FieldArray
              name={`sections`}
              render={(arrayHelpers) => {
                const moveSection = (fromIndex: number, toIndex: number) => {
                  if (fromIndex === toIndex) return;
                  // Use arrayHelpers.move for consistent state management
                  arrayHelpers.move(fromIndex, toIndex);
                };

                return (
                  <Fragment>
                    <DragContainer
                      previewTypes={['PAGE_SECTION']}
                      renderPreview={renderPreview}
                      className="accordions-container"
                    >
                      {formik?.values?.sections?.map((section: any, index: number) => {
                        return (
                          <DraggableItem
                            key={section?.key}
                            id={section?.key}
                            index={index}
                            type="PAGE_SECTION"
                            data={{
                              sectionName: section?.name,
                              sectionKey: section?.key,
                              sectionType: section?.type,
                              isSubSection: false
                            }}
                            onMove={moveSection}
                            onDragStart={handleDragStart}
                          >
                            {(dragRef) => (
                              <PageSection
                                arrayHelpers={arrayHelpers}
                                data={section}
                                expanded={expanded}
                                setExpanded={setExpanded}
                                index={index}
                                dragRef={dragRef}
                                hasSubmitted={hasSubmitted}
                                subSectionExpanded={subSectionExpanded[`section-${index}`] ?? -1}
                                registerSubSectionCallback={registerSubSectionCallback}
                                hasError={hasSubmitted && hasErrorInSection((formik.errors?.sections as any[])?.[index])}
                                queryKey={queryKey}
                              />
                            )}
                          </DraggableItem>
                        );
                      })}
                    </DragContainer>
                    {!formik?.values?.sections?.length && (
                      <div className="no_data">
                        <h6>{t('no_sections')}</h6>
                      </div>
                    )}
                    <Button
                      customClass=" add-section_btn w-full mt-8!"
                      type="button"
                      onClick={() => {
                        arrayHelpers.push(createNewSection(formik?.values?.sections?.length || 0, parentModuleType));
                        const newIndex = formik?.values?.sections?.length || 0;
                        setTimeout(() => {
                          setExpanded(newIndex);
                        }, 50);
                      }}
                    >
                      <div className="text-white">
                        {plusIcon} {t('add_section')}
                      </div>
                    </Button>
                  </Fragment>
                );
              }}
            />
            <div className="form_button reverse submit-button-container">
              <Button
                type="submit"
                loading={submitLoading}
                onClick={() => handleSubmitClick(formik)}
              >
                <span className="bold">{t('save')}</span>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

