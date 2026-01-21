import '../styles/app.scss';
import '../styles/app-rtl.scss';
import Layout from '../components/layout/Layout';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Providers from './Providers';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Login from './pages/auth/Login';
import ProtectedRoutes from '../utils/ProtectedRoutes';
import ProtectedAuth from '../utils/ProtectedAuth';
import NotFound from './pages/NotFound';
import ChangePasswordPageComponents from './pages/auth/ChangePassword';
import VerifyAdminByMail from './pages/VerifyAdminByMail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CreatePage from './pages/Pages/CreatePage';
import Pages from './pages/Pages/Pages';
import PageSections from './pages/Pages/PageSections';
import SectionTypes from './pages/SectionTypes/SectionTypes';
import CreateSectionType from './pages/SectionTypes/CreateSectionType';

import WelcomePage from './pages/WelcomePage';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n, i18n.language]);

  return (
    <BrowserRouter>
      <Providers>
        <Layout>
          <Routes>
            <Route path="/" element={<ProtectedRoutes />}>
              <Route path="/" element={<Navigate to={'/dashboard'} />} />
              <Route path="/dashboard" element={<WelcomePage />} />
              <Route path="/auth/change-password" element={<ChangePasswordPageComponents />} />

              {/* <Route element={<PermittedRoutes permissions={['roles.show']} />}>
                <Route path="/roles" element={<RolesList />} />
              </Route> */}

              {/* <Route element={<PermittedRoutes permissions={['roles.edit']} />}>
                <Route path="/roles/create-role" element={<CreateRole />} />
                <Route path="/roles/create-role/:id" element={<CreateRole />} />
              </Route> */}

              <Route path='/pages'>
                <Route path="" element={<Pages />} />
                <Route path="create-page" element={<CreatePage />} />
                <Route path="create-page/:id" element={<CreatePage />} />
                <Route path="page-sections/:id" element={<PageSections />} />
              </Route>
              <Route path='/section-types'>
                <Route path="" element={<SectionTypes />} />
                <Route path="create-section-type" element={<CreateSectionType />} />
                <Route path="create-section-type/:id" element={<CreateSectionType />} />
              </Route>
              <Route path="/not-found" element={<NotFound />} />
            </Route>

            <Route element={<ProtectedAuth />}>
              <Route path="/auth/login" element={<Login />} />
            </Route>

            <Route path="*" element={<Navigate to="/not-found" replace />} />
            <Route path='/auth/forgot-password/' element={<ForgotPassword />} />
            <Route path='/auth/reset-password/:id' element={<ResetPassword />} />
            <Route path='/verify-admin/' element={<VerifyAdminByMail />} />
          </Routes>
        </Layout>
      </Providers>
    </BrowserRouter>
  );
};

export default App;
