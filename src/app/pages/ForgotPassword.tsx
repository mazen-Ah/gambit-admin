import AdminPanelHeader from "../../components/layout/AdminPanelHeader";
import ForgotPasswordForm from "../../modules/auth/components/ForgotPasswordForm";

const ForgotPassword = () => {
    return (
        <div className="login_page_container authlayout">
            <div className="login_container">
                <AdminPanelHeader />

                {/* <div className="form_container"> */}
                <ForgotPasswordForm />
                {/* </div> */}
            </div>
            <div className="img-wrapper">
                <img src="/images/hyundai.png" alt="logo" />
            </div>
        </div>
    );
}

export default ForgotPassword;