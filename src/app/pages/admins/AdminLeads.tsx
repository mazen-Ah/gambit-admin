import TableSkeleton from '../../../components/loaders/TableSkeleton';
import ListHeader from '../../../components/ListHeader';
import { useTranslation } from 'react-i18next';
import useModuleTableHelpers from '../../../hooks/useModuleTableHelpers';
import Button from '../../../components/buttons/Button';
import AdminsLeadsTableContainer from '../../../modules/admins/components/AdminsLeadsTableContainer';
import { useParams } from 'react-router-dom';
import { hasPermission } from '../../../utils/HelperFunctions';

const AdminLeads = () => {
  const { t } = useTranslation();
  const {id} = useParams()

  const { apiData, apiDataLoading, paginationEle, searchEle } = useModuleTableHelpers({
    route: `admin/sales-assigned-leads/${id}`,
    withBreadcrumb: true,
    withSearch: true,
    breadcrumbTitle: t('links.assigned_leads'),
    withPagination: true,
    queryKey: ['assigned-leads', id],
  });

  const tableHeaders = [
    { label: t('name') },
    { label: t('email') },
    { label: t('mobile') },
    { label: t('actions'), customClass: 'actions_col' }
  ];

  if (apiDataLoading && !apiData) return <TableSkeleton columns={5} withoutButton />;

  return (
    <div className="admins-page-container">
      <ListHeader customClass="table_filters">
        <div className="filter_container">{searchEle}</div>
        {hasPermission(['leeds.assign_sales_to_leads']) && <Button text={t('assign_lead')} link={`/admins/assign-lead/${id}`} />}
      </ListHeader>

      <AdminsLeadsTableContainer tableHeaders={tableHeaders} data={apiData} noDataMessage={t('no_admins_found')} lessColumns />
      {paginationEle}
    </div>
  );
};

export default AdminLeads;
