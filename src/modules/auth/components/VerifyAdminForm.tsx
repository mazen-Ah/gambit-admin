import FieldWrapper from '../../../components/formInputs/FieldWrapper';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../../components/buttons/Button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TextContainer from './TextContainer';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { generalCreate } from '../../../API/api';
import { authContext } from '../../../store/context/authContext';
import Cookies from 'js-cookie';
import { setUserData, setUserPermissions, setUserRoles, setUserToken } from '../store/redux/authData';
import { IUserData } from '../types/Interfaces';
import { loginPostRequest, verificationPostRequest } from '../API/api';

const VerifyAdminForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { catchError } = useContext(authContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const token = queryParams.get('token');
  const email = queryParams.get('email');

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

  const validationSchema = Yup.object({
    // email: Yup.string()
    //   .email('Enter valid email format')
    //   .required('required')
    //   .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please remove spaces'),
    password: Yup.string()
      .required(t('required'))
      .matches(/^[^ ]\S*/, 'Please remove spaces')
      .min(8, 'password must be at least 8 characters.'),
    password_confirmation: Yup.string()
      .required(t('required'))
      .oneOf([Yup.ref('password')], t('password_must_match'))
  });

  return (
    <div className="login_form">
      <TextContainer title={t('verification')} desc={t('welcome', { project_name: "Gambit Admin" })} />
      <Formik
        validateOnMount
        validationSchema={validationSchema}
        initialValues={{
          token: token,
          email: email,
          password: '',
          password_confirmation: ''
        }}
        onSubmit={(values) => {
          // setLoading(true);
          // verificationPostRequest({
          //   route: '/verify-admin',
          //   values: { token: values.token ?? '', email: values.email ?? '', password: values.password, password_confirmation: values.password_confirmation }
          // })
          //   .then((res) => {
          //     setLoading(false);
          //     if (res?.code === 200 && res?.data?.token) {
          //       toast.success(t('verified'));
          //       updateToken(res?.data?.token?.plainTextToken);
          //       updateUserData(res?.data?.user);
          //       updateUserPermissions(res?.data?.user.roles[0].permissions.map((item: { name: string }) => item.name));
          //       updateUserRoles(res?.data?.user.roles.map((item: { id: string }) => item.id));
          //       res?.data?.user && navigate('/');
          //     } else if (res?.errors?.credentials) {
          //       toast.error(t('invalidCredentials'));
          //     } else if (res?.message) {
          //       toast.error(res?.message);
          //     } else {
          //       toast.error(t('somethingWrong'));
          //     }
          //   })
          //   .catch((error) => {
          //     catchError(error, setLoading);
          //   });
          // loginPostRequest({ route: '/admin/auth/login', values: values }).then((res) => {
          //   setLoading(false);
          //   if (res?.code === 200 && res?.data?.token) {
          //     // updateToken(res?.data?.token?.plainTextToken);
          //     // updateUserData(res?.data?.user);
          //     // updateUserPermissions(res?.data?.user.roles[0].permissions.map((item: { name: string }) => item.name));
          //     // updateUserRoles(res?.data?.user.roles.map((item: { id: string }) => item.id));
          //     // res?.data?.user && navigate('/');
          //   } else if (res?.errors?.credentials) {
          //     // toast.error(t('invalidCredentials'));
          //   } else if (res?.message) {
          //     // toast.error(res?.message);
          //   } else {
          //     // toast.error(t('somethingWrong'));
          //   }
          // });
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
                // tick
                showPassword
                customClass={'password-input'}
              />
              <FieldWrapper
                inputName={'password_confirmation'}
                inputPlaceholder={t('confirmPassword')}
                inputError={formik.errors.password_confirmation}
                inputTouched={formik.touched.password_confirmation}
                input
                tick={!formik.errors.password_confirmation ? true : false}
                showPassword
                type={'password'}
              />
              <div className="form_button double">
                <Button loading={loading}>
                  <span className="bold">{t('verify')}</span>
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default VerifyAdminForm;
