import { Form, Formik } from "formik";

import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import FieldWrapper from "../../../components/formInputs/FieldWrapper";
import Button from "../../../components/buttons/Button";
import { useNavigate } from "react-router-dom";
import { passwordPostRequest } from "../API/api";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { handleUnAuthenticated } from "../store/redux/authData";

const ChangePasswordForm = () => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        const cookies = Cookies.get();
        if (Cookies.get("token")) {
            for (let cookie in cookies) {
                Cookies.remove(cookie); // Remove each cookie
            }
            dispatch(handleUnAuthenticated());
        }
        const contentContainer = document.querySelector(".layout_content");
        contentContainer?.scrollTo({ top: 0, behavior: "smooth" });
        navigate("/auth/login");

    }



    const validationSchema = Yup.object({
        old_password: Yup.string().required('required').matches(/^[^ ]\S*/, t("remove_space")),
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
        <div className="login_form change_password" >
            <Formik validateOnMount
                validationSchema={validationSchema}
                initialValues={{
                    password: "",
                    old_password: "",
                    password_confirmation: "",
                }}
                onSubmit={(values) => {
                    setLoading(true)
                    passwordPostRequest({ route: `/admin/change-password`, values: { ...values, _method: "POST" } }).then((res) => {
                        setLoading(false)
                        if (res.code === 200) {
                            toast.success(t("passwordUpdatedSuccessfully"))
                            handleLogout()
                        } else {
                            toast.error(t("somethingWrong"))
                        }
                    })
                }}
            >
                {(formik) => (
                    <>
                        <Form>
                            <FieldWrapper
                                inputName={"old_password"}
                                inputPlaceholder={t("currentPassword")}
                                inputError={formik.errors.old_password}
                                inputTouched={formik.touched.old_password}
                                input
                                type={'password'}
                            />

                            <FieldWrapper
                                inputName={"password"}
                                inputPlaceholder={t("newPassword")}
                                inputError={formik.errors.password}
                                inputTouched={formik.touched.password}
                                input
                                type={'password'}
                                showPassword
                                stopAutoComplete
                            />
                            <FieldWrapper
                                inputName={"password_confirmation"}
                                inputPlaceholder={t("confirmPassword")}
                                inputError={formik.errors.password_confirmation}
                                inputTouched={formik.touched.password_confirmation}
                                input
                                type={'password'}
                                showPassword
                                stopAutoComplete
                            />
                            <div className="form_button double">
                                <Button type={loading ? "button" : 'submit'} loading={loading}>
                                    <span className="bold">{t("submit")}</span>
                                </Button>
                            </div>
                        </Form>
                    </>
                )}
            </Formik>
        </div >
    );
}

export default ChangePasswordForm;