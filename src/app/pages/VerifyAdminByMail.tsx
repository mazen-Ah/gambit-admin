import { useState } from "react";
import { useLocation } from "react-router-dom";
import AdminPanelHeader from "../../components/layout/AdminPanelHeader";
import VerifyAdminByMailForm from "../../modules/auth/components/VerifyAdminByMailForm";
import VerifyWithCodeForm from "../../modules/auth/components/VerifyWithCodeForm";

const VerifyAdminByMail = () => {
    const [enterCodeMode, setEnterCodeMode] = useState(false);

    const location = useLocation();
    const { email } = location.state || {};

    return (
        <div className="login_page_container authlayout">
            <div className="login_container">
                <AdminPanelHeader />
                {
                    enterCodeMode ? (
                        <VerifyWithCodeForm email={email} />
                    ) : (
                        <VerifyAdminByMailForm email={email} setEnterCodeMode={setEnterCodeMode} />
                    )
                }

            </div>
            <div className="img-wrapper">
                <img src="/images/hyundai.png" alt="logo" />
            </div>
        </div>
    );
}

export default VerifyAdminByMail;