import { ReactNode, useContext, useEffect, useState } from 'react';
import InitialLoader from '../loaders/InitialLoader';
import AdminPanelHeader from './AdminPanelHeader';
import SideMenu from './sideMenu/SideMenu';
import { useLocation } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { setUserData, setUserToken } from '../../modules/auth/store/redux/authData';
import { useQuery } from '@tanstack/react-query';
import { generalGet } from '../../API/api';
import { setPermissions, setRolesData } from '../../store/redux/rolesData';
import { hasPermission } from '../../utils/HelperFunctions';
// import NotificationsEcho from '../NotificationsEcho';
// import '../../utils/notificationsRealtime.ts';
import { authContext } from '../../store/context/authContext';

const Layout = ({ children }: { children: ReactNode }) => {
  const [openMenu, setOpenMenu] = useState(false);
  let { pathname } = useLocation();
  const dispatch = useDispatch();
  const { userData } = useSelector((store: any) => store.authData);
  const { catchError } = useContext(authContext);

  const { data, isSuccess } = useQuery({
    queryKey: ['App roles'],
    queryFn: () => generalGet(`/admin/roles`),
    refetchOnWindowFocus: false,
    enabled: !!hasPermission(['roles.show'])
  });

  const {
    isSuccess: userIsSuccess,
    error: userError
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => generalGet(`admin/admins/${userData.id}`),
    refetchOnWindowFocus: false,
    enabled: !!userData.id
  });

  const { data: permissionsData, isSuccess: permissionsSuccess } = useQuery({
    queryKey: ['App permissions'],
    queryFn: () => generalGet(`/admin/roles/permissions`),
    refetchOnWindowFocus: false,
    enabled: userData.role_id === 1 && !!userIsSuccess
  });

  useEffect(() => {
    if (Cookies.get('user_data')) dispatch(setUserData(JSON.parse(Cookies.get('user_data') as string)));
    if (Cookies.get('token')) dispatch(setUserToken(Cookies.get('token') as string));
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const roles: { label: string; value: string }[] = [];
      data.data.data.forEach((item: any) => {
        item.name !== 'super-admin' && roles.push({ label: item.name, value: item.id });
      });
      dispatch(setRolesData([...roles]));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (permissionsSuccess) {
      dispatch(setPermissions(permissionsData?.data?.data?.map((item: { name: string }) => item.name)));
    }
  }, [permissionsSuccess, permissionsData, dispatch]);

  useEffect(() => {
    const contentContainer = document.querySelector('.layout_content');
    contentContainer?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    if (!userIsSuccess && userError) {
      if (!pathname.includes('/auth/forgot-password') && !pathname.includes('/auth/reset-password') && !pathname.includes('/verify-admin')) {
        catchError(userError);
      }
    }
  }, [userIsSuccess, userError]);

  return (
    <main className="layout layout-with-loader">
      <InitialLoader />
      {/* <NotificationsEcho userId={userData?.id} /> */}
      <div className="layout_inner">
        <SideMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <ToastContainer autoClose={2000} draggable={false} hideProgressBar={true} position="top-right" transition={Slide} />
        <div className={`layout_wrapper`}>
          <div
            className={`layout_content ${pathname.includes('/auth/login') || pathname.includes('/verify-admin') || pathname.includes('/auth/forgot-password') || pathname.includes('/auth/reset-password') ? 'login_layout' : ''}`}
          >
            {!pathname.includes('/auth/login') &&
              !pathname.includes('/verify-admin') &&
              !pathname.includes('/auth/forgot-password') &&
              !pathname.includes('/auth/reset-password') &&
              <AdminPanelHeader setOpenMenu={setOpenMenu} />}
            <div className="content_container">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Layout;
