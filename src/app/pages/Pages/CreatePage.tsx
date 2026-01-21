import { useDispatch } from 'react-redux';
import { setBreadCrumbsData } from '../../../store/redux/breadCrumbsData';
import { useTranslation } from 'react-i18next';
import CreatePageForm from '../../../modules/pages/components/CreatePageForm';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const CreatePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const title = id ? t('edit_page') : t('create_page');

  useEffect(() => {
    dispatch(
      setBreadCrumbsData({
        links: [{ label: title, path: '/pages/create-page' }],
        page_title: title
      })
    );
  }, [title, dispatch]);

  return (
    <div>
      <CreatePageForm />
    </div>
  );
};

export default CreatePage;
