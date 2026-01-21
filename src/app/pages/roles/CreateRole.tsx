import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setBreadCrumbsData } from '../../../store/redux/breadCrumbsData';
import CreateRoleForm from '../../../modules/roles/components/CreateRoleForm';
import { useParams } from 'react-router-dom';

const CreateRole = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { id } = useParams();

  const title = id ? t('edit_role') : t('createRole');
  dispatch(
    setBreadCrumbsData({
      links: [{ label: title, path: '/roles/create-role' }],
      page_title: title
    })
  );

  return (
    <div>
      <CreateRoleForm />
    </div>
  );
};

export default CreateRole;
