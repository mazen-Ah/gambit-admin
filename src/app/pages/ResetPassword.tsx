import AdminPanelHeader from "../../components/layout/AdminPanelHeader";
import ResetPasswordForm from "../../modules/auth/components/ResetPasswordForm";

const ResetPassword = () => {
    return (
        <div className="login_page_container authlayout">
        <div className="login_container">
        <AdminPanelHeader />

            {/* <div className="form_container"> */}
                <ResetPasswordForm />
            {/* </div> */}
        </div>
        <div className="img-wrapper">
             <img src="/images/hyundai.png" alt="logo" />
        </div>
    </div>
    );
}

export default ResetPassword;