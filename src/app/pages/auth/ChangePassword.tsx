import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import ChangePasswordForm from "../../../modules/auth/components/ChangePasswordFrom";
import TextContainer from "../../../modules/auth/components/TextContainer";
import { setBreadCrumbsData } from '../../../store/redux/breadCrumbsData';


const ChangePasswordPageComponents = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch();
    dispatch(setBreadCrumbsData({
        links: [{ label: t("changePassword"), path: "/auth/change-password" }],
        page_title: t("changePassword"),
    }))

    return (
        <div className="login_page_container change_password_page">
            <TextContainer
                title={t("changePassword")}
            // desc="Forgot your password? Don't worry, we will send a reset password link to your email."
            />
            <ChangePasswordForm />
        </div>
    );
}

export default ChangePasswordPageComponents;