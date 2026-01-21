import { FieldArray, getIn } from 'formik';
import SectionHeader from '../../../components/SectionHeader';
import { useTranslation } from 'react-i18next';
import PageSection from './PageSection';
import AccordionDragPreview from './AccordionDragPreview';
import React, { useState, useEffect } from 'react';
import { ISection } from '../types/interfaces';
import { plusIcon } from '../../../config/variables';
import Button from '../../../components/buttons/Button';
import { DragContainer, DraggableItem } from '../../../components/DragDrop';
import { DEFAULT_SUB_SECTION } from '../constants/sectionOptions';

export default function PageSubSections({
  sectionName,
  hasSubmitted,
  subSectionExpanded,
  sectionIndex,
  registerSubSectionCallback,
  queryKey
}: { 
  sectionName: string; 
  hasSubmitted: boolean; 
  subSectionExpanded: number;
  sectionIndex: number;
  registerSubSectionCallback?: (sectionIndex: number, callback: (index: number) => void) => void;
  queryKey: string;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(-1);
  const nestedSubSectionExpandCallbacks = React.useRef<Record<string, (index: number) => void>>({});
  
  // Register callback for direct expansion control
  useEffect(() => {
    if (registerSubSectionCallback) {
      registerSubSectionCallback(sectionIndex, (index: number) => {
        setExpanded(index);
      });
    }
  }, [registerSubSectionCallback, sectionIndex]);

  // Update expanded state when subSectionExpanded changes (from error handling)
  useEffect(() => {
    if (subSectionExpanded !== undefined && subSectionExpanded !== -1) {
      setExpanded(subSectionExpanded);
    }
  }, [subSectionExpanded]);

  const registerNestedSubSectionCallback = (subSectionIndex: number, callback: (index: number) => void) => {
    const key = `subsection-${subSectionIndex}`;
    nestedSubSectionExpandCallbacks.current[key] = callback;
  };

  return (
    <FieldArray
      name={`${sectionName}.sub_sections`}
      render={(arrayHelpers) => {
        const subSections = getIn(arrayHelpers?.form?.values, `${sectionName}.sub_sections`) as ISection[];
        return (
          <SectionHeader title={t('sub_sections')} customStyle="last sub_sections">
            {!!subSections?.length && (
              <DragContainer
                previewTypes={['PAGE_SUB_SECTION']}
                renderPreview={(item, itemType) => <AccordionDragPreview item={item} itemType={itemType} />}
                className="accordions-container"
              >
                {subSections?.map((section, index) => {
                  return (
                    <DraggableItem
                      key={section?.key}
                      id={section?.key}
                      index={index}
                      type="PAGE_SUB_SECTION"
                      data={{
                        sectionName: section?.name,
                        sectionKey: section?.key,
                        sectionType: section?.type,
                        isSubSection: true
                      }}
                      onMove={(from, to) => {
                        if (from === to) return;
                        // Use FieldArray move to avoid rewriting entire array reference tree
                        // arrayHelpers.move exists on parent FieldArray, mimic via manual swap
                        const values = [...subSections];
                        const [item] = values.splice(from, 1);
                        values.splice(to, 0, item);
                        arrayHelpers.form.setFieldValue(`${sectionName}.sub_sections`, values);
                      }}
                      onDragStart={() => setExpanded(-1)}
                    >
                      {(dragRef) => (
                        <div data-sub-accordion-index={`${sectionName.split('[')[1].split(']')[0]}-${index}`}>
                          <PageSection
                            arrayHelpers={arrayHelpers}
                            data={section}
                            expanded={expanded}
                            setExpanded={setExpanded}
                            index={index}
                            namePref={sectionName}
                            subSection
                            dragRef={dragRef}
                            hasSubmitted={hasSubmitted}
                            subSectionExpanded={-1}
                            registerSubSectionCallback={registerNestedSubSectionCallback}
                            queryKey={queryKey}
                            hasError={hasSubmitted && (() => {
                              const subSectionErrors = getIn(arrayHelpers?.form?.errors, `${sectionName}.sub_sections.${index}`);
                              if (!subSectionErrors || typeof subSectionErrors !== 'object') return false;

                              // Check for direct errors (excluding sub_sections)
                              const hasDirectErrors = Object.keys(subSectionErrors).some(key => 
                                key !== 'sub_sections' && subSectionErrors[key]
                              );

                              if (hasDirectErrors) return true;

                              // Check for nested sub_sections errors
                              if (subSectionErrors.sub_sections && Array.isArray(subSectionErrors.sub_sections)) {
                                return subSectionErrors.sub_sections.some((nestedError: any) => 
                                  nestedError && typeof nestedError === 'object' && Object.keys(nestedError).length > 0
                                );
                              }

                              return false;
                            })()}
                          />
                        </div>
                      )}
                    </DraggableItem>
                  );
                })}
              </DragContainer>
            )}
            {!subSections?.length && (
              <div className="no_data">
                <h6 className=''>{t('no_sub_sections')}</h6>
              </div>
            )}
            <Button
              customClass="add-section_btn sub-section"
              type="button"
              onClick={() => {
                arrayHelpers?.push({
                  ...DEFAULT_SUB_SECTION,
                  order: subSections?.length + 1,
                  key: (subSections?.length || 0) + 1, // Keep sequential for display
                  // parent_module_type: parentModuleType || "Cms"
                });
                // Expand the newly added subsection with animation
                const newIndex = subSections?.length || 0;
                // Small delay to ensure DOM renders before animation
                setTimeout(() => {
                  setExpanded(newIndex);
                }, 50);
              }}
            >
              <div className="add-section_btn_content">
                {plusIcon} {t('add_sub_section')}
              </div>
            </Button>
          </SectionHeader>
        );
      }}
    />
  );
}
