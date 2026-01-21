import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import FieldWrapper from './formInputs/FieldWrapper';
import DatePickerField from './formInputs/DatePickerField';
import FormikDebounce from './FormikDebounce';

export default function TableFilters({ customSearchPlaceholder, setFilters, noDuration }: { customSearchPlaceholder?: string; setFilters?: any; noDuration?: boolean }) {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        search: ''
      }}
      onSubmit={(values) => {
        setFilters(values)
      }}
    >
      <Form className='filter_container'>
        {/* <SearchInputField
          placeholder={customSearchPlaceholder || t('search_by_code_Name')}
          setSearchInput={(value: string) => formik.setFieldValue('search', value)}
          searchInput={formik?.values?.search}
        /> */}
        <FormikDebounce />
        <div className='inputs_grid small-gap w-100'>
          <FieldWrapper title={""} inputName={`search`} inputPlaceholder={customSearchPlaceholder || t('search_by_code_Name')} input noPadding gridSize={4} />
          {!noDuration && (
            <>
              <DatePickerField title={""} name={`from_date`} noPadding placeHolder={`${t("from")}: DD/MM/YYYY`} clearable gridSize={4} />
              <DatePickerField title={""} name={`to_date`} noPadding placeHolder={`${t("to")}: DD/MM/YYYY`} clearable gridSize={4} />
            </>
          )}
        </div>
      </Form>
    </Formik>
  );
}
