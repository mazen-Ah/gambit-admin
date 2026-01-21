import { useDispatch } from 'react-redux';
import { setBreadCrumbsData } from '../../../store/redux/breadCrumbsData';
import { useTranslation } from 'react-i18next';
import AdminsLeadsAssignForm from '../../../modules/admins/components/AdminsLeadsAssignForm';
import { useParams } from 'react-router-dom';

const AdminsLeadsAssign = () => {
  const { t } = useTranslation();
  const {id} = useParams()
  const dispatch = useDispatch();

  dispatch(
    setBreadCrumbsData({
      links: [{ label: t('assign_lead'), path: `/admins/assign-lead/${id}` }],
      page_title: t('assign_lead')
    })
  );

  return (
    <div>
      <AdminsLeadsAssignForm />
    </div>
  );
};

export default AdminsLeadsAssign;
