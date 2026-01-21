import { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import MultiSelectDropdown from '../../../components/formInputs/MultiSelectDropdown';
import Button from '../../../components/buttons/Button';
import SectionHeader from '../../../components/SectionHeader';
import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import { IAdmin } from '../types/interfaces';
import useFormsIntegrationHelpers from '../../../hooks/useFormsIntegrationHelpers';
import { scrollToError } from '../../../utils/HelperFunctions';
import { SelectChangeEvent } from '@mui/material';
import { generalGet } from '../../../API/api';
import FormDynamicSkeleton from '../../../components/loaders/FormDynamicSkeleton';
import { customSelectStyles } from '../../../utils/SelectStyles';

const CustomArrowIcon = ({ onClick }: { onClick: () => void }) => (
  <svg className="MuiSelect-iconCustom" height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" onClick={onClick}>
    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
  </svg>
);

const CreateAdminForm = () => {
  const { id } = useParams();
  const formRef = useRef<FormikProps<IAdmin>>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: () => generalGet(`/select/roles`)
  });

  // const { modelOptions: citiesOptions, apiDataLoading: citiesApiDataLoading } = useModelSelectOptions({
  //   labelKey: `name.${i18n.language}`,
  //   valueKey: 'id',
  //   modelRoute: 'admin/cities',
  //   queryKey: ['cities']
  // });

  const { apiData, getDataLoading, handleSubmit, submitLoading } = useFormsIntegrationHelpers({
    queryKey: ['admin data', id],
    id,
    singleGetApi: `/admin/admins/${id}?relations=roles`,
    addApi: '/admin/admins',
    editApi: `/admin/admins/${id}`,
    listRoute: '/admins',
    itemName: t('admin'),
    invalidateQueryKey: ['admins'],
    keysToKeepEmpty: ['type']
  });

  const validationSchema = Yup.object({
    first_name: Yup.string()
      .required(t('required'))
      .matches(/^[^ ]\S*/, t('remove_space')),
    last_name: Yup.string()
      .required(t('required'))
      .matches(/^[^ ]\S*/, t('remove_space')),
    email: Yup.string()
      .email(t('email_format'))
      .required(t('required'))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('email_format')),
    mobile: Yup.string().required(t('required')),
    ...(id == null
      ? {
          password: Yup.string()
            .required(t('required'))
            .matches(/^[^ ]\S*$/, t('remove_space'))
            .min(8, t('password_must'))
            .matches(/[A-Z]/, t('must_contain_uppercase'))
            .matches(/[a-z]/, t('must_contain_lowercase'))
            .matches(/\d/, t('must_contain_number'))
            .matches(/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]/, t('must_contain_special_char')),
          password_confirmation: Yup.string()
            .required(t('required'))
            .oneOf([Yup.ref('password')], t('passwords_mismatch')),
          // city_id: Yup.string().required(t('required')),
        }
      : {}),
    roles: Yup.array().of(Yup.string()).min(1, t('one_role_required')),
    type: Yup.string()
  });

  const initialValues: IAdmin = {
    ...apiData,
    
    first_name: apiData?.first_name || '',
    last_name: apiData?.last_name || '',
    email: apiData?.email || '',
    mobile: apiData?.mobile || '',
    password: apiData?.password || '',
    password_confirmation: apiData?.password_confirmation || '',
    
    roles: apiData?.roles || [],
    type: apiData?.type?.toLowerCase() || '',
    status: apiData?.status || 'PENDING'
  };

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedRolesName, setSelectedRolesName] = useState<string[]>([]);
  const [openRoles, setOpenRoles] = useState(false);

  useEffect(() => {
    if (id && apiData && rolesData?.data?.data) {
      const allowedValues = apiData.roles.map((role: { name: string }) => role.name);
      const filteredRoles = rolesData.data.data.filter((role: { value: string }) => allowedValues.includes(role.value));
      const values = filteredRoles.map((role: { value: string }) => role.value);
      setSelectedRoles(values);

      formRef.current?.setFieldValue?.('roles', values, false);
    }
  }, [apiData, rolesData, id]);

  useEffect(() => {
    if (rolesData?.data?.data && selectedRoles.length > 0) {
      const names = rolesData?.data?.data.filter((role: { value: string }) => selectedRoles.includes(role.value)).map((role: { text: any }) => role.text);
      setSelectedRolesName(names);
    }
  }, [rolesData, selectedRoles]);

  const handleRoleChange = (event: SelectChangeEvent<string[]>, formik: any) => {
    const value = event.target.value;

    // Ensure it's always an array
    const newSelected = typeof value === 'string' ? value.split(',') : value;

    setSelectedRoles(newSelected);

    const names = rolesData?.data?.data.filter((role: { value: string }) => newSelected.includes(role.value)).map((role: { text: string }) => role.text);

    setSelectedRolesName(names);
    formik.setFieldValue('roles', newSelected);
  };

  const typeOptions = [
    { label: t('no_type_selected'), value: '' },
    { label: t('sales_word'), value: 'sales' }
  ];

  if (getDataLoading)
    return (
      <FormDynamicSkeleton
        sections={[
          [
            { columns: 2, items: 2 },
            { columns: 2, items: 1 },
            { columns: 2, items: 2 }
          ]
        ]}
        buttons={1}
      />
    );

  return (
    <div className="create_user_form modal_content" ref={formWrapperRef}>
      <Formik
        innerRef={formRef}
        validateOnMount={!id}
        validateOnBlur={true}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setErrors }) => {
          let value = { ...values, _method: 'POST' };
          if (id) {
            value = { ...value, _method: 'PUT' };
          }
          handleSubmit({ ...value }, setErrors);
        }}
      >
        {(formik) => (
          <>
            <Form>
              <SectionHeader title={t('admin_details')} customStyle="last">
                <div className="inputs_group">
                  <FieldWrapper title={t('first_name')} inputName={`first_name`} inputPlaceholder={t('first_name')} input />
                  <FieldWrapper title={t('last_name')} inputName={`last_name`} inputPlaceholder={t('last_name')} input />
                </div>
                <div className="inputs_group">
                  <FieldWrapper title={t('email')} inputName={`email`} inputPlaceholder={t('email')} input stopAutoComplete />
                  <FieldWrapper title={t('mobile')} inputName={`mobile`} inputPlaceholder={t('mobile')} input stopAutoComplete />
                </div>
                {/* {id != null && <div className="inputs_group">
                  {citiesApiDataLoading ? (
                    <InputSkeleton />
                  ) : (
                    <FieldWrapper
                     
                      title={t('city')}
                      inputPlaceholder={t('city')}
                      inputName={`city_id`}
                      options={citiesOptions}
                      selectStyle={customStyles}
                      value={citiesOptions?.filter((item: TOptions) => formik.values?.city_id === item?.value)}
                      select
                    />
                  )}
                  <FieldWrapper />
                </div>} */}

                {!id && (
                  <div className="inputs_group">
                    <FieldWrapper title={t('password')} inputName={'password'} inputPlaceholder={t('password')} input type={'password'} showPassword stopAutoComplete />
                    <FieldWrapper
                      title={t('confirmPassword')}
                      inputName={'password_confirmation'}
                      inputPlaceholder={t('confirmPassword')}
                      input
                      type={'password'}
                      showPassword
                      stopAutoComplete
                    />
                  </div>
                )}

                <div className="inputs_group">
                  <MultiSelectDropdown
                    label={t('roles')}
                    name="roles"
                    value={selectedRoles}
                    onChange={(event: SelectChangeEvent<string[]>) => handleRoleChange(event, formik)}
                    options={rolesData?.data?.data || []}
                    selectedLabels={selectedRolesName}
                    placeholder={t('select-roles')}
                    customIcon={<CustomArrowIcon onClick={() => setOpenRoles(!openRoles)} />}
                    open={openRoles}
                    setOpen={setOpenRoles}
                  />
                  <FieldWrapper
                   
                    title={t('type')}
                    inputPlaceholder={t('no_type_selected')}
                    inputName={`type`}
                    options={typeOptions}
                    selectStyle={customSelectStyles}
                    select
                  />
                </div>
              </SectionHeader>
              <div className="form_button reverse">
                <Button
                  loading={submitLoading}
                  onClick={() => {
                    scrollToError(!formik.isValid, formWrapperRef);
                  }}
                  // disabled={!formik.isValid || !formik.dirty}
                >
                  <span className="bold">{id ? t('update') : t('create')}</span>
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default CreateAdminForm;
