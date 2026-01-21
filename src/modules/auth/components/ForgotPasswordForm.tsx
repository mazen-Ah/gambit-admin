import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import Button from '../../../components/buttons/Button';
import { Link } from 'react-router-dom';
import TextContainer from './TextContainer';
import { forgotPasswordPostRequest } from '../API/api';
import { useTranslation } from 'react-i18next';
import ErrorCard from '../../../components/layout/ErrorCard';
import SuccessCard from './SuccessCard';
import { emailIcon } from '../../../config/variables';

const ForgotPasswordForm = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter valid email format')
      .required(t('required'))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please remove spaces'),

  });

  return (
    <div className="login_form">
      {forgotError && (
        <div className="error-container">
          <ErrorCard title={forgotError} description={""} buttonText={""} buttonUrl="" />
        </div>
      )}
      {emailSent && (
        <div className="success-container">
          <SuccessCard title={t("check_your_email")} description={t("reset_email_sent")} icon={emailIcon} />
        </div>
      )}

      <TextContainer title={t('forgot_password')} desc={t('forgot_password_desc')} />
      <Formik
        validateOnMount
        validationSchema={validationSchema}
        initialValues={{
          email: '',
        }}
        onSubmit={(values) => {
          setLoading(true);
          setForgotError('');
          setEmailSent(false);
          forgotPasswordPostRequest({ route: 'admin/auth/forgot-password', values: values }).then((res) => {
            setLoading(false);
            if (res?.code === 200) {
              setEmailSent(true);
            } else if (res?.message) {
              setForgotError(res?.message);
            } else {
              setForgotError(t('somethingWrong'));
            }

          })
        }}
      >
        {(formik) => (
          <>
            <Form>
              <FieldWrapper inputName={'email'} inputPlaceholder={t('email')} inputError={formik.errors.email} inputTouched={formik.touched.email} input />
              <div className="form_button double">
                <Button loading={loading}>
                  <span className="bold">{t('reset_password')}</span>
                </Button>
              </div>
              <div className="forgot-password-container">
                <Link to="/auth/login">{t('back_to_login')}</Link>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordForm;
