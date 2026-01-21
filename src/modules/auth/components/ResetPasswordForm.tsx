import Cookies from 'js-cookie';
import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../../components/buttons/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TextContainer from './TextContainer';
import { IUserData } from '../types/Interfaces';
import { loginPostRequest, verificationPostRequest } from '../API/api';
import { useTranslation } from 'react-i18next';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    password: Yup.string()
      .required(t("required"))
      .matches(/^[^ ]\S*$/, t("remove_space"))
      .min(8, t("password_must"))
      .matches(/[A-Z]/, t("must_contain_uppercase"))
      .matches(/[a-z]/, t("must_contain_lowercase"))
      .matches(/\d/, t("must_contain_number"))
      .matches(/[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]/, t("must_contain_special_char")),
    password_confirmation: Yup.string()
      .required(t("required"))
      .oneOf([Yup.ref("password")], t("passwords_mismatch")),

  });

  return (
    <div className="login_form">
      <TextContainer title={t('set_new_password')} desc={t('set_new_password_desc')} />
      <Formik
        validateOnMount
        validationSchema={validationSchema}
        initialValues={{
          password: '',
          password_confirmation: ''
        }}
        onSubmit={(values) => {
          setLoading(true);
          verificationPostRequest({
            route: `/admin/auth/reset-password/${id}`,
            values: {
              password: values.password,
              password_confirmation: values.password_confirmation
            }
          })
            .then((res) => {
              setLoading(false);
              if (res?.code === 200) {
                toast.success(t("passwordUpdatedSuccessfully"));
                navigate('/auth/login');
              } else if (res?.errors?.credentials) {
                toast.error(t('invalidCredentials'));
              } else if (res?.message) {
                toast.error(res?.message);
              } else {
                toast.error(t('somethingWrong'));
              }
            })
        }}
      >
        {(formik) => (
          <>
            <Form>
              <FieldWrapper
                inputName={'password'}
                inputPlaceholder={t('password')}
                inputError={formik.errors.password}
                inputTouched={formik.touched.password}
                input
                type={'password'}
                tick={!formik.errors.password && formik.touched.password && !formik.errors.password_confirmation ? true : false}
                showPassword
                customClass={'password-input'}
              />
              <FieldWrapper
                inputName={"password_confirmation"}
                inputPlaceholder={t("confirmPassword")}
                inputError={formik?.errors?.password_confirmation}
                inputTouched={formik?.touched?.password_confirmation}
                input
                tick={!formik.errors.password_confirmation ? true : false}
                showPassword
                type={'password'}
              />
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

export default ResetPasswordForm;
