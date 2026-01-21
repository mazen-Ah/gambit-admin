import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../../components/buttons/Button';
import { useTranslation } from 'react-i18next';
import { generalCreate } from '../../../API/api';
import { authContext } from '../../../store/context/authContext';
import { Link } from 'react-router-dom';

type VerifyEmailProps = {
  email?: string;
  setEnterCodeMode: React.Dispatch<React.SetStateAction<boolean>>;
};
const VerifyAdminByMailForm = ({ email, setEnterCodeMode }: VerifyEmailProps) => {

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const { catchError } = useContext(authContext);

  return (
    <div className="login_form">
      { }
      <div className="sign_text_container">
        <h4>{t('verification')}</h4>
        <p>
          {`${t('not_verifeid_mail')}`}
        </p>
      </div>
      <Formik
        validateOnMount
        validationSchema={Yup.object({
          email: Yup.string()
            .email(t('email_format'))
            .required(t('required'))
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('email_format')),
        })}
        initialValues={{
          email: email || '',
        }}
        onSubmit={(values) => {
          setLoading(true);
          let value = { email: values.email, _method: 'POST' };

          let route = `/admin/admins/send-verification-code`
          generalCreate({
            route: route,
            values: { ...value }
          })
            .then((res) => {
              setLoading(false);
              toast.success(`${t('check_your_email_for_code')}`);
              setEnterCodeMode(true);
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
                inputName={'email'}
                inputPlaceholder={t('email')}
                input
                stopAutoComplete
              />
              <div className="form_button double">
                <Button loading={loading}>
                  <span className="bold">{t('send_code')}</span>
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

export default VerifyAdminByMailForm;
