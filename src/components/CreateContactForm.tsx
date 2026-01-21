import { useContext, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { authContext } from '../store/context/authContext';
import { generalCreate } from '../API/api';
import CloseButton from './buttons/CloseButton';
import FieldWrapper from './formInputs/FieldWrapper';
import Button from './buttons/Button';

const CreateContactForm = ({ setOpen, parentId, setRefetch, setContactData, contactData, contactId, setContactId, routeName }: any) => {
  const [loading, setLoading] = useState(false);
  const { catchError } = useContext(authContext);
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('required'))
      .matches(/^[^ ]\S*/, t('required')),
    email: Yup.string()
      .email(t('email_format'))
      .required(t('required'))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('email_format')),
    mobile: Yup.string()
      .required(t('required'))
      .matches(/^05[0-9]{8}$/, t('wrong_number'))
  });

  return (
    <div className="create_user_form modal_content">
      <Formik
        enableReinitialize
        validateOnMount
        validationSchema={validationSchema}
        initialValues={{
          name: contactData?.name || '',
          email: contactData?.email || '',
          mobile: contactData?.mobile || '',
          profession: contactData?.profession || ''
        }}
        onSubmit={(values) => {
          setLoading(true);
          let value = { ...values, mobile: values?.mobile.toString(), _method: 'POST' };
          if (contactId) {
            value = { ...value, _method: 'PUT' };
          }
          let route = !contactId ? `${routeName}/${parentId}/add-contact` : `${routeName}/update-contact/${contactId}`;
          generalCreate({
            route: route,
            values: { ...value }
          })
            .then((res) => {
              setLoading(false);
              setOpen(false);
              setContactData(null);
              setContactId(null);
              toast.success(`${t('a_contact')} ${!contactId ? t('created') : t('updated')} ${t('successfully')}`);
              setRefetch(new Date());
            })
            .catch((error) => {
              catchError(error, setLoading);
            });
        }}
      >
        {(formik) => (
          <>
            <Form>
              <div className="form_header">
                <h4 className="header">{t('contact_information')}</h4>
                <CloseButton
                  handleClose={() => {
                    setOpen(false);
                    setContactData(null);
                    setContactId(null);
                  }}
                />
              </div>
              <div className="form_inputs">
                <FieldWrapper
                  title={t('name')}
                  inputName={'name'}
                  inputPlaceholder={t('name')}
                  inputError={formik.errors.name as string}
                  inputTouched={formik.touched.name as boolean}
                  input
                />
                <FieldWrapper
                  title={t('jobTitle')}
                  inputName={'profession'}
                  inputPlaceholder={t('jobTitle')}
                  inputError={formik.errors.name as string}
                  inputTouched={formik.touched.name as boolean}
                  input
                />
                <FieldWrapper
                  title={t('email')}
                  inputName={'email'}
                  inputPlaceholder={t('email')}
                  inputError={formik.errors.email as string}
                  inputTouched={formik.touched.email as boolean}
                  input
                />
                <FieldWrapper
                  title={t('phone')}
                  inputName={'mobile'}
                  // inputPlaceholder={`${t("ex")}: 0511111111`}
                  inputError={formik.errors.mobile as string}
                  inputTouched={formik.touched.mobile as boolean}
                  input
                  // type="number"
                />
              </div>
              <div className="form_footer">
                <Button type={loading ? 'button' : 'submit'} loading={loading}>
                  <span className="bold">{t('save')}</span>
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default CreateContactForm;
