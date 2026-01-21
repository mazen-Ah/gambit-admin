
import { useContext } from "react";
import { Link } from "react-router-dom";
import { IAdminDataDropDown } from "../../types/Interfaces";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { authContext } from "../../store/context/authContext";

const AdminDataDropDown = ({ dropDownToggler }: IAdminDataDropDown) => {

    const { t } = useTranslation();
    const { handleLogout } = useContext(authContext)
    const { authData } = useSelector((store: any) => store)
    const logout = () => {
        handleLogout()
    }
    
    return (
        <div className={`admin_data_drop_down dropdown ${dropDownToggler && "show"}`}>
            <div className="drop-header">
                <div className="img-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z" />
                    </svg>
                </div>
                <div className="header">
                    <h6>{authData && authData?.userData?.first_name}</h6>
                </div>
            </div>
            <div className="drop-header titles">
                <p>{t("manageAccount")}
                    <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5547 0.878906C11.2383 0.195312 12.3594 0.195312 13.043 0.878906L13.3711 1.20703C14.0547 1.89062 14.0547 3.01172 13.3711 3.69531L7.35547 9.71094C7.10938 9.95703 6.80859 10.0938 6.50781 10.1758L4.01953 10.75C3.88281 10.7773 3.71875 10.75 3.60938 10.6406C3.5 10.5312 3.47266 10.3672 3.5 10.2305L4.07422 7.74219C4.15625 7.44141 4.29297 7.14062 4.53906 6.89453L10.5547 0.878906ZM12.4141 1.50781C12.0859 1.15234 11.5117 1.15234 11.1836 1.50781L10.4453 2.21875L12.0312 3.80469L12.7422 3.06641C13.0977 2.73828 13.0977 2.16406 12.7422 1.83594L12.4141 1.50781ZM4.92188 7.93359L4.51172 9.73828L6.28906 9.32812C6.45312 9.30078 6.61719 9.21875 6.72656 9.08203L11.4023 4.40625L9.84375 2.84766L5.16797 7.52344C5.03125 7.63281 4.94922 7.79688 4.92188 7.93359ZM5.6875 2C5.90625 2 6.125 2.21875 6.125 2.4375C6.125 2.68359 5.90625 2.875 5.6875 2.875H2.1875C1.44922 2.875 0.875 3.47656 0.875 4.1875V12.0625C0.875 12.8008 1.44922 13.375 2.1875 13.375H10.0625C10.7734 13.375 11.375 12.8008 11.375 12.0625V8.5625C11.375 8.34375 11.5664 8.125 11.8125 8.125C12.0312 8.125 12.25 8.34375 12.25 8.5625V12.0625C12.25 13.293 11.2656 14.25 10.0625 14.25H2.1875C0.957031 14.25 0 13.293 0 12.0625V4.1875C0 2.98438 0.957031 2 2.1875 2H5.6875Z" fill="#000" />
                    </svg>
                </p>
                <Link to={`/auth/change-password`}><span>{t("changePassword")}</span></Link>
            </div>

            <span className="log-out bold" onClick={() => logout()}>{t("logout")}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h7v2H5v14h7v2H5Zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5l-5 5Z" /></svg>
            </span>
        </div>
    );
}

export default AdminDataDropDown;