import React, { Fragment } from 'react';
import useMultiSelectOptions from '../../../hooks/useMultiSelectOptions';
import { useTranslation } from 'react-i18next';
import useModelSelectOptions from '../../../hooks/useModelSelectOptions';
import { useFormikContext } from 'formik';

export default function AdminsLeadsAssignFormInputs() {
  const { t } = useTranslation();
  const formik = useFormikContext();

  const { modelOptions: leadsOptions } = useModelSelectOptions({
    labelKey: 'first_name',
    valueKey: 'id',
    searchKeys: ['first_name', 'last_name', "email", "mobile"],
    modelRoute: 'admin/leads',
    queryKey: ['leads']
  });

  const { element } = useMultiSelectOptions({
    inputName: 'leads_ids',
    formik,
    label: t('leads'),
    placeholder: t('leads'),
    selectOptions: leadsOptions || []
  });

  return <Fragment>{element}</Fragment>;
}
