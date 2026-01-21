import { Lang_Icon } from '../../config/variables';
import Breadcrumbs from './Breadcrumbs';
import AdminDataBtn from './AdminDataBtn';
import { useTranslation } from 'react-i18next';
import AdminNotificationsBtn from './AdminNotificationsBtn';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../buttons/Button';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { hasPermission } from '../../utils/HelperFunctions';

const AdminPanelHeader = ({ setOpenMenu }: { setOpenMenu?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  const isEditable = useSelector((store: any) => store.breadCrumbsData.breadCrumbsData.editBtn);
  return (
    <>
      <div className={`admin_panel_header  ${pathname === '/auth/login' || pathname === '/auth/forgot-password' || pathname === '/verify-admin' || pathname.includes("/auth/reset-password") ? 'login_page_header' : ''}`}>
        {pathname === '/auth/login' || pathname === '/auth/forgot-password' || pathname === '/verify-admin' || pathname.includes("/auth/reset-password")  ? (
          <div className="auth_page_header">
            <div className="logo_container">
              <h4>Gambit</h4>
            </div>
          </div>
        ) : (
          <div className="normal_header">
            <Breadcrumbs />
            <div className="left-side">
              <div className={`burger`} onClick={() => setOpenMenu && setOpenMenu(true)}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              {isDesktop && isEditable?.path && isEditable?.name && (
                <div className="">
                  {isEditable?.permission ? (
                    hasPermission([isEditable?.permission]) && <Button text={t(`${isEditable?.name}`)} onClick={() => navigate(`${isEditable.path}`)} />
                  ) : (
                    <Button text={t(`${isEditable?.name}`)} onClick={() => navigate(`${isEditable.path}`)} />
                  )}
                </div>
              )}
              {/* {isDesktop && isEditable?.path && isEditable?.name == 'editProduct' && hasPermission(['products.edit']) && (
                <div className="">
                  <Button text={t(`${isEditable?.name}`)} onClick={() => navigate(`${isEditable.path}`)} />
                </div>
              )} */}
              <div className="lang" onClick={() => (i18n.language === 'ar' ? i18n.changeLanguage('en') : i18n.changeLanguage('ar'))}>
                <span className="lang-name">{i18n.language === 'en' ? 'عربي' : 'EN'}</span>
                {Lang_Icon}
              </div>
              <div className="hz-line"></div>
              <AdminNotificationsBtn />
              <AdminDataBtn />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanelHeader;
