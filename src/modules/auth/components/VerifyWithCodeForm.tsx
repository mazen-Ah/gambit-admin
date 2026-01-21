import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../../components/buttons/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { generalCreate } from '../../../API/api';
import { authContext } from '../../../store/context/authContext';

const VerifyWithCodeForm = ({ email }: { email?: string }) => {

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const { catchError } = useContext(authContext);

  return (
    <div className="login_form">
      { }
      <div className="sign_text_container">
        <h4>{t('verification')}</h4>
        <p>
          {`${t('enter_code_sent_to_your_email')}`}
          <span className='custom-spacing'>{email}</span>
          {`${t('to_verify_your_account')}`}
        </p>
      </div>
      <Formik
        validateOnMount
        validationSchema={Yup.object({
          code: Yup.string()
            .required(t('required'))
            .matches(/^\d{6}$/, t('only_six_numbers'))
        })}
        initialValues={{
          email: email,
          code: '',
        }}
        onSubmit={(values) => {
          setLoading(true);
          let value = { email: values.email, code: values.code, _method: 'POST' };

          let route = `/admin/admins/verify`
          generalCreate({
            route: route,
            values: { ...value }
          })
            .then((res) => {
              setLoading(false);
              toast.success(`${t('account_verified_successfully')}`);
              navigate('/auth/login');
            })
            .catch((error) => {
              setLoading(false);
              catchError(error);
              toast.error(error);
            });
        }}
      >
        {(formik) => (
          <>
            <Form>
              <FieldWrapper
                inputName={'code'}
                inputPlaceholder={t('code')}
                input
                stopAutoComplete
              />
              <div className="form_button double">
                <Button loading={loading}>
                  <span className="bold">{t('verify')}</span>
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

export default VerifyWithCodeForm;
