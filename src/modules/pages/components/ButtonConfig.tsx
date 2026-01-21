import React, { useState, useCallback, useEffect } from 'react';
import { FieldArray, getIn, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import SectionHeader from '../../../components/SectionHeader';
import SwitchActivation from '../../../components/layout/SwitchActivation';
import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import { customStyles } from '../../../utils/SelectStyles';
import { getButtonTypeOptions } from '../constants/sectionOptions';
import Button from '../../../components/buttons/Button';
import { plusIcon, deleteIcon } from '../../../config/variables';
import ExpandAccordion from '../../../components/ExpandesAccordion';

interface ButtonConfigProps {
  sectionName: string;
  sectionData: any;
  subSection?: boolean;
  sectionTypeData?: any;
}

const DEFAULT_BUTTON = {
  button_type: '',
  button_text: {
    en: '',
    ar: ''
  },
  button_data: '',
  key: 0
};

const ButtonConfig: React.FC<ButtonConfigProps> = ({ sectionName, sectionData, subSection = false, sectionTypeData }) => {
  const { t } = useTranslation();
  const formik = useFormikContext();
  const buttonTypeOptions = getButtonTypeOptions(t);
  const [expandedButton, setExpandedButton] = useState<number>(-1);

  // Determine if buttons should be enabled - check both sectionData and sectionTypeData
  const hasButtonsEnabled = sectionTypeData?.has_buttons || sectionData?.has_button === 1;

  // Ensure buttons array is initialized when has_button is 1 or has_buttons is true
  useEffect(() => {
    if (hasButtonsEnabled) {
      const currentButtons = getIn(formik.values, `${sectionName}.buttons`);
      
      // Normalize button_text to always be { en: string, ar: string }
      const normalizeButtonText = (text: any): { en: string; ar: string } => {
        if (!text) return { en: '', ar: '' };
        if (typeof text === 'object' && text !== null) {
          return {
            en: text.en || '',
            ar: text.ar || ''
          };
        }
        return { en: '', ar: '' };
      };

      // If buttons array doesn't exist or is empty, but we have legacy button fields, convert them
      if ((!currentButtons || currentButtons.length === 0) && sectionData?.button_type) {
        formik.setFieldValue(`${sectionName}.buttons`, [{
          button_type: sectionData.button_type || '',
          button_text: normalizeButtonText(sectionData.button_text),
          button_data: sectionData.button_data || '',
          key: 1
        }]);
        // Set has_button to 1 when initializing from legacy fields
        formik.setFieldValue(`${sectionName}.has_button`, 1);
      }
      // If buttons array is still empty after checking legacy fields, initialize with one empty button
      else if (!currentButtons || currentButtons.length === 0) {
        formik.setFieldValue(`${sectionName}.buttons`, [{
          ...DEFAULT_BUTTON,
          key: 1
        }]);
        // Set has_button to 1 when initializing buttons
        formik.setFieldValue(`${sectionName}.has_button`, 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasButtonsEnabled, sectionName]);

  const handleAccordionChange = useCallback((index: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedButton(isExpanded ? index : -1);
  }, []);

  return (
    <SectionHeader title={''} customStyle='padding_bottom'>
      <div className={`inputs_group ${subSection ? 'no-margin' : ''}`}>
        <div className="switch_container">
          <SwitchActivation
            onChange={(value: any) => {
              const isChecked = value?.target?.checked;
              formik.setFieldValue(`${sectionName}.has_button`, isChecked ? 1 : 0);
              // When toggling on, initialize with one button if buttons array is empty
              if (isChecked) {
                const currentButtons = getIn(formik.values, `${sectionName}.buttons`) || [];
                if (currentButtons.length === 0) {
                  formik.setFieldValue(`${sectionName}.buttons`, [{
                    ...DEFAULT_BUTTON,
                    key: 1
                  }]);
                }
              }
            }}
            active={hasButtonsEnabled}
          />
          <p>{t('has_button')}</p>
        </div>
      </div>
      {hasButtonsEnabled && (
        <FieldArray
          name={`${sectionName}.buttons`}
          render={(arrayHelpers) => {
            const buttons = getIn(formik.values, `${sectionName}.buttons`) || [];
            return (
              <div className="form-container accordions-container">
                {buttons.map((button: any, index: number) => {
                  const buttonName = typeof button?.button_text === 'object' 
                    ? (button.button_text?.en || button.button_text?.ar || '')
                    : '';
                  const displayName = buttonName || `${t('button')} ${index + 1}`;
                  
                  return (
                    <div key={button?.key || index} className="page-section">
                      <Accordion
                        expanded={expandedButton === index}
                        onChange={handleAccordionChange(index)}
                        className="button-accordion"
                        slotProps={{ transition: { unmountOnExit: true } }}
                      >
                        <AccordionSummary
                          className={`header-container ${expandedButton !== index && 'expand'} ${subSection && 'sub-section'} accordion-summary-focus`}
                          aria-controls={`button-${index}-content`}
                          id={`button-${index}-header`}
                        >
                          <div className="header-content">
                            <p>
                              <div>
                                <div className="section-info">
                                  <span>
                                    {t('button')} {index + 1}
                                  </span>
                                  {buttonName && (
                                    <>
                                      <span>|</span>
                                      <span className="capitalize">{displayName}</span>
                                    </>
                                  )}
                                </div>
                                {button?.button_type && (
                                  <div className="capitalize section-type">
                                    type: {button.button_type}
                                  </div>
                                )}
                              </div>
                            </p>
                            <div className="section-controls">
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  arrayHelpers.remove(index);
                                  if (expandedButton === index) {
                                    setExpandedButton(-1);
                                  } else if (expandedButton > index) {
                                    setExpandedButton(expandedButton - 1);
                                  }
                                }}
                                className='icon'
                                title={t('delete')}
                              >
                                {deleteIcon}
                              </span>
                              <ExpandAccordion expand={expandedButton === index} />
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="inputs_group">
                            <FieldWrapper
                              customPadding
                              title={t('button_type')}
                              inputPlaceholder={t(`button_type`)}
                              inputName={`${sectionName}.buttons[${index}].button_type`}
                              options={buttonTypeOptions}
                              selectStyle={customStyles}
                              defaultValue={buttonTypeOptions?.find((option) => option.value === button?.button_type)}
                              select
                              formik={formik}
                            />
                          </div>
                          <div className="inputs_group">
                            <FieldWrapper 
                              customPadding 
                              title={t('button_text_en')} 
                              inputName={`${sectionName}.buttons[${index}].button_text.en`} 
                              inputPlaceholder={t('button_text_en')} 
                              input 
                            />
                            <FieldWrapper 
                              customPadding 
                              title={t('button_text_ar')} 
                              inputName={`${sectionName}.buttons[${index}].button_text.ar`} 
                              inputPlaceholder={t('button_text_ar')} 
                              input 
                            />
                          </div>
                          <div className="inputs_group">
                            <FieldWrapper 
                              customPadding 
                              title={t('button_data')} 
                              noPadding 
                              inputName={`${sectionName}.buttons[${index}].button_data`} 
                              inputPlaceholder={t('button_data')} 
                              input 
                            />
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  );
                })}
                {!buttons.length && (
                  <div className="no_data">
                    <h6>{t('no_buttons')}</h6>
                  </div>
                )}
                <Button
                  customClass="add-section_btn"
                  type="button"
                  onClick={() => {
                    const newIndex = buttons.length;
                    arrayHelpers.push({
                      ...DEFAULT_BUTTON,
                      key: newIndex + 1
                    });
                    setTimeout(() => {
                      setExpandedButton(newIndex);
                    }, 50);
                  }}
                >
                  <div className="text-white">
                    {plusIcon} {t('add_button')}
                  </div>
                </Button>
              </div>
            );
          }}
        />
      )}
    </SectionHeader>
  );
};

export default ButtonConfig;
