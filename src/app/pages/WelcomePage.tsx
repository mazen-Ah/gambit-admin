import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setBreadCrumbsData } from '../../store/redux/breadCrumbsData';

const WelcomePage = () => {
  const { t } = useTranslation();  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadCrumbsData({ page_title: t('home') }));
  }, [t, dispatch]);

  return (
    <div className="text-container">
      <div className="card">
        <h1>{t('welcome', { project_name: "Gambit Admin" })}</h1>
      </div>
    </div>
  );
};

export default WelcomePage;
