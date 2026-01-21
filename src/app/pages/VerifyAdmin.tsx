import AdminPanelHeader from "../../components/layout/AdminPanelHeader";
import VerifyAdminForm from "../../modules/auth/components/VerifyAdminForm";

const VerifyAdmin = () => {
    return (
        <div className="login_page_container authlayout verification">
        <div className="login_container verification">
            <AdminPanelHeader />
            <VerifyAdminForm />
        </div>
        </div>
    );
}

export default VerifyAdmin;