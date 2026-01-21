import React, { Fragment, useMemo, useState, useRef, useEffect, useCallback } from 'react';
import PageSection from './PageSection';
import AccordionDragPreview from './AccordionDragPreview';
import { FieldArray, Form, Formik, FormikProps, setNestedObjectValues } from 'formik';
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
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { scrollToAccordionError } from '../../../utils/HelperFunctions';
import { generalGet } from '../../../API/api';

export default function PageSectionsEdit({ parentModuleType, id, parentType, data, getDataLoading, queryKey }: { parentModuleType?: string, id?: string, parentType?: string, data?: any, getDataLoading?: boolean, queryKey: string }) {
  const [expanded, setExpanded] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { t } = useTranslation();
  const formContainerRef = useRef(null);
  const formikRef = useRef<FormikProps<any>>(null);
  const queryClient = useQueryClient();

  const {
    subSectionExpanded,
    handleSubSectionExpanded,
    registerSubSectionCallback
  } = useSubSectionManagement();

  const { handleSubmit: originalHandleSubmit, submitLoading } = useFormsIntegrationHelpers({
    id,
    editApi: `/cms/admin/sections-group`,
    itemName: t('sections'),
    onComplete: () => {
      queryClient.invalidateQueries({queryKey: [queryKey]})
      formikRef.current?.setTouched({})
      formikRef.current?.setErrors({})
    }
  });

  // Handle backend validation errors
  const handleBackendErrors = useCallback((errors: any, setErrors?: (errors: any) => void) => {
    if (!errors || !formikRef.current) return;

    // Ensure error array length matches values array length
    const errorsToSet = JSON.parse(JSON.stringify(errors));
    if (errorsToSet.sections && Array.isArray(errorsToSet.sections) && formikRef.current.values?.sections) {
      const valuesLength = formikRef.current.values.sections.length;
      while (errorsToSet.sections.length < valuesLength) {
        errorsToSet.sections.push(null);
      }
    }

    // Set errors
    if (setErrors) {
      setErrors(errorsToSet);
    }
    formikRef.current.setErrors(errorsToSet);

    // Build touched structure from errors
    const buildTouched = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(item => {
          if (item === null) return null;
          if (Array.isArray(item) && item.length > 0 && typeof item[0] === 'string') {
            return true;
          }
          return typeof item === 'object' ? buildTouched(item) : true;
        });
      }
      
      if (!obj || typeof obj !== 'object') return {};
      
      const touched: any = {};
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'string') {
            touched[key] = true;
          } else {
            touched[key] = buildTouched(value);
          }
        } else if (value && typeof value === 'object') {
          touched[key] = buildTouched(value);
        }
      });
      return touched;
    };

    const touched = buildTouched(errorsToSet);
    formikRef.current.setTouched(touched, false);

    setHasSubmitted(true);
    
    if (errorsToSet.sections && formikRef.current.values.sections) {
      scrollToAccordionError(true, formContainerRef, errorsToSet, formikRef.current.values.sections, setExpanded, handleSubSectionExpanded);
    }
  }, [setExpanded, handleSubSectionExpanded]);

  const wrappedHandleSubmit = useCallback((values: any, setErrors?: any) => {
    return originalHandleSubmit(values, (errors: any) => {
      if (errors) {
        handleBackendErrors(errors, setErrors);
      }
    });
  }, [originalHandleSubmit, handleBackendErrors]);

  // Fetch section types for dynamic validation
  const { data: sectionTypesData } = useQuery({
    queryKey: ['section-types'],
    queryFn: () => generalGet('/cms/admin/section-types?per_page=1000'),
    refetchOnWindowFocus: false,
  });

  const validationSchema = useMemo(() => {
    const sectionTypes = sectionTypesData?.data?.data || [];
    return createSectionValidationSchema(t, sectionTypes);
  }, [t, sectionTypesData]);
  const initialValues = useSectionInitialValues(data, parentModuleType);
  const { handleFormSubmit: originalHandleFormSubmit } = useSectionFormSubmission({ 
    id, 
    handleSubmit: wrappedHandleSubmit, 
    pageData: {...data}, 
    parentType 
  });

  // Wrap handleFormSubmit to pass setErrors from Formik
  const handleFormSubmit = useCallback((values: any, formikHelpers: any) => {
    return originalHandleFormSubmit(values, formikHelpers.setErrors);
  }, [originalHandleFormSubmit]);

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

  const sectionsLength = data?.sections?.length;
  useEffect(() => {
    if(!sectionsLength) {
      setExpanded(-1);
    }
  }, [sectionsLength])

  // Update Formik values when data changes to ensure initial values are set
  useEffect(() => {
    if (data && formikRef.current && initialValues && initialValues.sections) {
      // Only update if data has sections and formik is initialized
      if (data.sections && data.sections.length > 0 && initialValues.sections.length > 0) {
        // Use setTimeout to ensure Formik is ready
        setTimeout(() => {
          if (formikRef.current) {
            formikRef.current.setValues(initialValues);
          }
        }, 0);
      }
    }
  }, [data, initialValues, initialValuesKey]);

  if (getDataLoading) return <FormSkeleton />;

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

