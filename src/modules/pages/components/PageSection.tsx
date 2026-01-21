import { Accordion, AccordionDetails } from '@mui/material';
import React, { Fragment, memo, useCallback, useMemo, useEffect } from 'react';
import { ISection } from '../types/interfaces';
import { useTranslation } from 'react-i18next';
import { FieldArrayRenderProps, getIn, ErrorMessage } from 'formik';
import { customStyles } from '../../../utils/SelectStyles';
import PageSubSections from './PageSubSections';
import ModalContainer from '../../../components/ModalContainer';
import DeleteModal from '../../../components/DeleteModal';
import SectionHeader from '../../../components/SectionHeader';
import PageSectionModels from './PageSectionModels';
import SectionHeaderComponent from './SectionHeader';
import SectionContent from './SectionContent';
import ButtonConfig from './ButtonConfig';
import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import { useSectionLogic } from '../hooks/useSectionLogic';
import { getSectionTypeOptions } from '../constants/sectionOptions';
import { useQuery } from '@tanstack/react-query';
import { generalGet } from '../../../API/api';
import Select from 'react-select';

const PageSection = memo(function PageSection({
  data,
  expanded,
  setExpanded,
  index,
  namePref,
  subSection,
  arrayHelpers,
  dragRef,
  hasError,
  hasSubmitted,
  subSectionExpanded,
  registerSubSectionCallback,
  queryKey
}: {
  data: ISection;
  expanded: number;
  setExpanded: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  namePref?: string;
  subSection?: boolean;
  arrayHelpers?: FieldArrayRenderProps;
  dragRef?: any;
  hasError?: boolean;
  hasSubmitted?: boolean;
  subSectionExpanded?: number;
  registerSubSectionCallback?: (sectionIndex: number, callback: (index: number) => void) => void;
  queryKey: string
}) {
  const { t, i18n } = useTranslation();
  const { sectionName, sectionData, deleteModalOpen, setDeleteModalOpen, handleDelete, handleDuplicate, handleExpand, formik } = useSectionLogic({
    index,
    namePref,
    subSection,
    arrayHelpers,
    onSectionAdded: setExpanded,
    onSectionRemoved: () => setExpanded(-1)
  });

  
  const deleteRoute = `/cms/admin/sections`;
  
  // Fetch section types from API
  const { data: sectionTypesData, isSuccess: sectionTypesSuccess } = useQuery({
    queryKey: ['section-types'],
    queryFn: () => generalGet('/cms/admin/section-types?per_page=1000'),
    refetchOnWindowFocus: false,
  });

  // Use API section types if available, otherwise fallback to static options
  const sectionTypeOptions = useMemo(() => {
    if (sectionTypesSuccess && sectionTypesData?.data?.data?.length > 0) {
      const currentLang = i18n?.language || 'en';
      return sectionTypesData.data.data.map((type: any) => {
        const name = typeof type.name === 'object' 
          ? (type.name?.[currentLang] || type.name?.en || type.name?.ar) 
          : type.name;
        return {
          label: name,
          value: name,
          data: type,
          image: type.image || null // Include image URL from API
        };
      });
    }
    return getSectionTypeOptions(t).map((option: any) => ({
      ...option,
      image: null
    }));
  }, [sectionTypesSuccess, sectionTypesData, t, i18n?.language]);

  // Custom styles for section type select with images - clean design
  const sectionTypeSelectStyles = useMemo(() => ({
    ...customStyles,
    control: (provided: any, state: any) => ({
      ...customStyles.control(provided, state),
      minHeight: '4.5rem',
      height: 'auto',
      padding: '0.5rem 1rem',
      border: '1px solid #e0e0e0',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#d0d0d0',
      },
    }),
    valueContainer: (provided: any, state: any) => ({
      ...customStyles.valueContainer(provided, state),
      padding: '0.25rem 0',
    }),
    singleValue: (provided: any, state: any) => ({
      ...customStyles.singleValue(provided, state),
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      width: '100%',
      margin: 0,
    }),
    option: (provided: any, state: any) => ({
      ...customStyles.option(provided, state),
      padding: '1rem',
      minHeight: '8rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      borderRadius: '10px',
      border: state.isSelected ? '2px solid #000' : '1px solid transparent',
      backgroundColor: state.isSelected 
        ? '#000' 
        : state.isFocused 
          ? 'rgba(0, 0, 0, 0.05)' 
          : '#fff',
      color: state.isSelected ? '#fff' : '#000',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: state.isSelected ? '#000' : 'rgba(0, 0, 0, 0.05)',
        borderColor: state.isSelected ? '#000' : '#d0d0d0',
      },
    }),
    menuList: (provided: any, state: any) => ({
      ...customStyles.menuList(provided, state),
      maxHeight: '32rem',
      padding: '0.75rem',
    }),
    menu: (provided: any, state: any) => ({
      ...customStyles.menu(provided, state),
      minWidth: '28rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e0e0e0',
    }),
  } as any), []);

  // Format option label - Professional card-based design
  const formatOptionLabel = useCallback(({ label, data }: any) => {
    const image = data?.image;
    return (
      <div className="section-type-option">
        {image && (
          <div className="section-type-option__image">
            <img 
              src={image} 
              alt={label}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="section-type-option__content">
          <span className="section-type-option__label">{label}</span>
        </div>
      </div>
    );
  }, []);

  // Get type from Formik values using sectionName (works for both parent and sub-sections)
  const formikType = useMemo(() => {
    const typeValue = getIn(formik.values, `${sectionName}.type`) || '';
    return typeValue;
  }, [formik.values, sectionName]);

  // Get current section type data based on Formik type value
  const currentSectionTypeData = useMemo(() => {
    if (!formikType || !sectionTypesSuccess || !sectionTypesData?.data?.data?.length) {
      return null;
    }
    const currentLang = i18n?.language || 'en';
    return sectionTypesData.data.data.find((type: any) => {
      const typeName = typeof type.name === 'object' 
        ? (type.name?.[currentLang] || type.name?.en || type.name?.ar) 
        : type.name;
      return typeName === formikType;
    }) || null;
  }, [formikType, sectionTypesSuccess, sectionTypesData, i18n?.language]);

  // Initialize buttons when section type has_buttons is true
  useEffect(() => {
    if (currentSectionTypeData?.has_buttons) {
      const currentButtons = getIn(formik.values, `${sectionName}.buttons`);
      const currentHasButton = getIn(formik.values, `${sectionName}.has_button`);
      
      // If buttons don't exist and has_button is not set, initialize
      if ((!currentButtons || currentButtons.length === 0) && currentHasButton !== 1) {
        formik.setFieldValue(`${sectionName}.has_button`, 1);
        formik.setFieldValue(`${sectionName}.buttons`, [{
          button_type: '',
          button_text: { en: '', ar: '' },
          button_data: '',
          key: 1
        }]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSectionTypeData?.has_buttons, sectionName]);

  // Get current selected option for the dropdown from Formik values
  const selectedSectionType = useMemo(() => {
    if (!formikType) return null;
    return sectionTypeOptions.find((option: any) => option.value === formikType) || null;
  }, [formikType, sectionTypeOptions]);

  const handleAccordionChange = useCallback(
    (e: React.SyntheticEvent) => {
      handleExpand(e, expanded, setExpanded);
    },
    [handleExpand, expanded, setExpanded]
  );
console.log(currentSectionTypeData, "currentSectionTypeData");

  return (
    <Fragment>
      <div className="page-section accordions-container">
        <Accordion
          expanded={expanded === index}
          onChange={handleAccordionChange}
          className={hasError ? 'has-error' : ''}
          data-accordion-index={index}
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <SectionHeaderComponent data={data} index={index} expanded={expanded} subSection={subSection} dragRef={dragRef} onDelete={handleDelete} onDuplicate={handleDuplicate} />
          <AccordionDetails>
            <SectionHeader title={''}>
              <div className="inputs_group">
                <FieldWrapper 
                  title={t('name_en')} 
                  inputName={`${sectionName}.name[en]`} 
                  inputPlaceholder={t('name_en')} 
                  input 
                  fast 
                />
                <FieldWrapper
                  title={t('name_ar')} 
                  inputName={`${sectionName}.name[ar]`} 
                  inputPlaceholder={t('name_ar')} 
                  input 
                  fast
                />
              </div>
              <div className="inputs_group">
                <div className="field_wrapper_container">
                  <div className="header">
                    <h5 className="title">{t('section_type')}</h5>
                  </div>
                  <div className="input_wrapper">
                    <div className="field">
                      <Select
                        options={sectionTypeOptions}
                        placeholder={t('section_type')}
                        className="react-select-container section-type-select"
                        classNamePrefix="react-select"
                        styles={sectionTypeSelectStyles}
                        value={selectedSectionType}
                        onChange={(selectedOption: any) => {
                          formik.setFieldValue(`${sectionName}.type`, selectedOption?.value || '');
                        }}
                        formatOptionLabel={formatOptionLabel}
                        isSearchable
                        noOptionsMessage={() => t('no_options')}
                      />
                      <ErrorMessage name={`${sectionName}.type`} component="div" className="error" />
                    </div>
                  </div>
                </div>
              </div>
            </SectionHeader>
            {formikType && (
              <SectionHeader title={''}>
                <SectionContent 
                  sectionName={sectionName} 
                  sectionType={formikType}
                  sectionTypeData={currentSectionTypeData}
                />
              </SectionHeader>
            )}
            {currentSectionTypeData?.has_model_data && (
            <PageSectionModels subSection={subSection} hasRelation={sectionData?.has_relation} sectionName={sectionName} />
            )}
            {currentSectionTypeData?.has_buttons && (
            <ButtonConfig 
              sectionName={sectionName} 
              sectionData={sectionData} 
              subSection={subSection}
              sectionTypeData={currentSectionTypeData}
            />
            )}
            {currentSectionTypeData?.has_child_section && (
            <PageSubSections
              sectionName={sectionName}
              hasSubmitted={hasSubmitted || false}
              subSectionExpanded={subSectionExpanded ?? -1}
              sectionIndex={index}
              registerSubSectionCallback={registerSubSectionCallback}
              queryKey={queryKey}
            />
            )}
          </AccordionDetails>
        </Accordion>
      </div>
      {deleteModalOpen && (
        <ModalContainer small>
          <DeleteModal
            id={deleteModalOpen}
            setModal={setDeleteModalOpen}
            route={deleteRoute}
            successMsg={`${t('section')} ${t('deleted')} ${t('successfully')}`}
            warningMsg={t('are_you_sure_delete_section')}
            queryKey={queryKey}
            setRefetchData={() => {
              setExpanded(-1);
            }}
          />
        </ModalContainer>
      )}
    </Fragment>
  );
});

export default PageSection;
