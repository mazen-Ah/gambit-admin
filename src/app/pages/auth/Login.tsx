import AdminPanelHeader from "../../../components/layout/AdminPanelHeader";
import LoginForm from "../../../modules/auth/components/LoginForm";

const Login = () => {
    return (
        <div className="login_page_container authlayout">
        <div className="login_container">
        <AdminPanelHeader />

            {/* <div className="form_container"> */}
                <LoginForm />
            {/* </div> */}
        </div>
        <div className="img-wrapper">
            <img src="/images/hyundai.png" alt="logo" />
        </div>
    </div>
    );
}

export default Login;