import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/buttons/Button';
import useFormsIntegrationHelpers from '../../../hooks/useFormsIntegrationHelpers';
import { scrollToError } from '../../../utils/HelperFunctions';
import AdminsLeadsAssignFormInputs from './AdminsLeadsAssignFormInputs';

const AdminsLeadsAssignForm = () => {
  const { id } = useParams();
  const formRef = useRef<FormikProps<any>>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const { handleSubmit, submitLoading } = useFormsIntegrationHelpers({
    queryKey: ['assign-admin', id],
    invalidateQueryKey: ['assigned-leads'],
    addApi: '/admin/assign-leads-to-sales',
    listRoute: `/admins/assigned-leads/${id}`,
    customMessage: `${t('leads_assigned')} ${t('successfully')}`,
  });

  const validationSchema = Yup.object({});

  const initialValues = {
    leads_ids: []
  };

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
          let value = { ...values, sales_id: id, _method: 'POST' };
          handleSubmit({ ...value }, setErrors);
        }}
      >
        {(formik) => (
          <>
            <Form>
              <div className="inputs_group">
                <AdminsLeadsAssignFormInputs />
              </div>
              <div className="form_button reverse">
                <Button
                  loading={submitLoading}
                  onClick={() => {
                    scrollToError(!formik.isValid, formWrapperRef);
                  }}
                  // disabled={!formik.isValid || !formik.dirty}
                >
                  <span className="bold">{t('add')}</span>
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AdminsLeadsAssignForm;
