import { useEffect, useRef } from "react";
import { ErrorMessage, Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import "react-phone-number-input/style.css";
import FieldWrapper from "../../../components/formInputs/FieldWrapper";
import Button from "../../../components/buttons/Button";
import { generalGet } from "../../../API/api";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import SectionHeader from "../../../components/SectionHeader";
import { scrollToError } from "../../../utils/HelperFunctions";
import useFormsIntegrationHelpers from "../../../hooks/useFormsIntegrationHelpers";
import { useQuery } from "@tanstack/react-query";
import FormSkeleton from "../../../components/loaders/FormSkeleton";

const CreateRoleForm = () => {
    const formRef = useRef(null)
    const { t } = useTranslation()
    const { id } = useParams();
    const formikRef = useRef<FormikProps<any>>(null);

    const { apiData, getDataLoading, handleSubmit, submitLoading } = useFormsIntegrationHelpers({
        queryKey: ['single role data', id],
        id,
        singleGetApi: `/admin/roles/${id}?relations=permissions`,
        addApi: '/admin/roles',
        editApi: `/admin/roles/${id}`,
        listRoute: '/roles',
        itemName: t('role'),
    });

    const {
        data: permissionsData,
        isSuccess: permissionsIsSuccess
    } = useQuery({
        queryKey: ['permissions'],
        queryFn: () => generalGet(`/select/permissions`)
    });

    const validationSchema = Yup.object({
        name: Yup.string()
            .required(t("required"))
            .matches(/^\S+$/, t("remove_space")),
        permissions: Yup.array()
            .of(Yup.string())
            .min(1, t("one_permission_required"))
    });

    const initialValues = {
        ...apiData,
        
        name: apiData?.name || '',
        permissions: apiData?.permissions || []
    };



    useEffect(() => {
        if (id && apiData && permissionsData?.data?.data) {
            const allowedValues = apiData.permissions.map((permission: { name: string }) => permission.name);
            const filteredPermissions = permissionsData.data.data.filter((permission: { value: string }) =>
                allowedValues.includes(permission.value)
            );
            const values = filteredPermissions.map((permission: { value: string }) => permission.value);

            formikRef.current?.setFieldValue?.('permissions', values, false);
        }
    }, [apiData, permissionsData, id]);

    if (getDataLoading) return <FormSkeleton featuredSections={1} />;

    return (
        <div className={'form_section'} ref={formRef}>
            <Formik
                innerRef={formikRef}
                enableReinitialize
                validateOnMount={!id}
                validateOnBlur={true}
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={(values, { setErrors }) => {
                    let value = { ...values, _method: 'POST' };
                    if (id) {
                        value = { ...value, _method: 'PUT' };
                    }
                    handleSubmit({ ...value }, setErrors);
                }}
            >
                {(formik) => (
                    <>
                        <Form>
                            <SectionHeader title={t("role_name")}>
                                <div className="form_inputs">
                                    <div className="inputs_group">
                                        <FieldWrapper
                                            title={t("name")}
                                            inputName={"name"}
                                            inputPlaceholder={t("name")}
                                            input
                                        />
                                        <FieldWrapper noPadding />
                                    </div>
                                </div>
                            </SectionHeader>

                            <SectionHeader customStyle="last" title={t('role_permissions')}>
                                <ErrorMessage name="permissions">
                                    {msg => <p className="general-error">{msg}</p>}
                                </ErrorMessage>
                                <div className="permissions-data">
                                    {permissionsData?.data?.data?.map((item: any, i: number) => {
                                        const permName = item?.value;
                                        return (
                                            <FieldWrapper title={item?.text} key={i} customClass="roles-form-checkbox">
                                                <div className="checkboxes_wrapper">
                                                    <label className="pointer">
                                                        <input
                                                            id={item?.text?.replace(/\s+/g, '-')}
                                                            type="checkbox"
                                                            checked={formik.values.permissions.includes(permName)}
                                                            onChange={() => {
                                                                const updated = formik.values.permissions.includes(permName)
                                                                    ? formik.values.permissions.filter((p: any) => p !== permName)
                                                                    : [...formik.values.permissions, permName];
                                                                formik.setFieldValue('permissions', updated);
                                                            }}
                                                        />
                                                        {item?.name}
                                                    </label>
                                                </div>
                                            </FieldWrapper>
                                        );
                                    })}

                                </div>
                            </SectionHeader>

                            <div className="form_button reverse">
                                <Button
                                    loading={submitLoading}
                                    onClick={() => {
                                        scrollToError(!formik.isValid, formRef);
                                    }}
                                >
                                    <span className="bold">{t("save")}</span>
                                </Button>
                            </div>
                        </Form>
                    </>
                )}
            </Formik>

        </div >
    );
};

export default CreateRoleForm;



