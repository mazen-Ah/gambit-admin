import Cookies from 'js-cookie';
import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import Button from '../../../components/buttons/Button';
import { Link, useNavigate } from 'react-router-dom';
import TextContainer from './TextContainer';
import { IUserData } from '../types/Interfaces';
import { loginPostRequest } from '../API/api';
import { useDispatch } from 'react-redux';
import { setUserData, setUserPermissions, setUserRoles, setUserToken } from '../store/redux/authData';
import { useTranslation } from 'react-i18next';
import ErrorCard from '../../../components/layout/ErrorCard';
import { generalGet } from '../../../API/api';
import { useQuery } from '@tanstack/react-query';

const LoginForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isMultiMarket, setIsMultiMarket] = useState(false);
  const dispatch = useDispatch();
  const hostname = window.location.hostname;
  const prevMarket = Cookies.get('market');
  const updateToken = (token: string) => {
    dispatch(setUserToken(token));
    Cookies.set('token', token);
  };

  const updateUserData = (data: IUserData) => {
    dispatch(setUserData(data));
    localStorage.setItem('user_data', JSON.stringify(data));
  };

  const updateUserPermissions = (data: string[]) => {
    dispatch(setUserPermissions(data));
    localStorage.setItem('user_permissions', JSON.stringify(data));
  };
  const updateUserRoles = (data: string[]) => {
    dispatch(setUserRoles(data));
    localStorage.setItem('user_roles', JSON.stringify(data));
  };

  const {
    data: clientsData,
    isSuccess: clientsIsSuccess
  } = useQuery({
    queryKey: ['clients-by-domain', hostname],
    queryFn: () => generalGet(`/clients/by-domain?domain=${hostname}`),
    enabled: !!hostname,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (clientsIsSuccess && clientsData?.data?.code === 200 && clientsData?.data?.data?.clients) {
      setIsMultiMarket(clientsData.data.data.is_multi_market || false);
    }
  }, [clientsIsSuccess, clientsData]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('email_format'))
      .required(t('required'))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('email_format')),
    password: Yup.string()
      .required(t('required'))
      .matches(/^[^ ]\S*/, t('remove_space'))
      .min(8, t('password_must')),
    market: isMultiMarket ? Yup.string().required(t('required')) : Yup.string()
  });

  return (
    <div className="login_form">
      {loginError && (
        <div className="error-container">
          <ErrorCard title={loginError} description={t('try_again_or_try')} buttonText={t('resetting_password')} buttonUrl="/auth/forgot-password" />
        </div>
      )}
      <TextContainer title={t('login')} desc={t('welcome', { project_name: "Gambit Admin" })} />
      <Formik
        validateOnMount
        validationSchema={validationSchema}
        initialValues={{
          email: '',
          password: '',
          market: prevMarket || ''
        }}
        onSubmit={(values) => {
          setLoading(true);
          loginPostRequest({ route: '/admin/auth/login', values: values }).then((res) => {
            setLoading(false);
            if (res?.code === 200 && res?.data?.token) {
              updateToken(res?.data?.token);
              updateUserData(res?.data?.admin);
              // updateUserPermissions(res?.data?.admin.roles[0].permissions.map((item: { name: string }) => item.name));
              updateUserPermissions(res?.data?.admin.roles.flatMap((role: { permissions: { name: string }[] }) => role.permissions?.map((item) => item.name) || []));
              updateUserRoles(res?.data?.admin.roles.map((item: { id: string }) => item.id));
              res?.data?.admin && navigate('/');
            } else if (res?.code === 403) {
              navigate('/verify-admin', { state: { email: values?.email } });
            } else if (res?.errors?.credentials) {
              setLoginError(t('invalidCredentials'));
            } else if (res?.message) {
              setLoginError(res?.message);
            } else {
              setLoginError(t('somethingWrong'));
            }
          });
        }}
      >
        {(formik) => (
          <>
            <Form>
              {/* {clientsIsLoading ? (
                <InputSkeleton noHeader noPadding gridSize={12}/>
              ) : (
                <FieldWrapper
                  // title={t('market')}
                  inputName={'market'}
                  inputPlaceholder={t('select_market')}
                  inputError={formik.errors.market}
                  inputTouched={formik.touched.market}
                  select
                  search
                  selectStyle={customStyles}
                  options={clients}
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue('market', selectedOption?.value || '');
                    handleClientChange(selectedOption);
                  }}
                />
              )} */}
              <FieldWrapper inputName={'email'} inputPlaceholder={t('email')} inputError={formik.errors.email} inputTouched={formik.touched.email} input />
              <FieldWrapper
                inputName={'password'}
                inputPlaceholder={t('password')}
                inputError={formik.errors.password}
                inputTouched={formik.touched.password}
                input
                type={'password'}
                // tick
                showPassword
                customClass={'password-input'}
              />
              <div className="form_button double">
                <Button loading={loading}>
                  <span className="bold">{t('login')}</span>
                </Button>
              </div>
              <div className="forgot-password-container">
                <Link to="/auth/forgot-password">{t('forgot_password')}</Link>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
