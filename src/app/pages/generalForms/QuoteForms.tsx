import TableSkeleton from '../../../components/loaders/TableSkeleton';
import { useTranslation } from 'react-i18next';
import useModuleTableHelpers from '../../../hooks/useModuleTableHelpers';
import QuoteFormsTableContainer from '../../../modules/generalForms/components/QuoteFormsTableContainer';

const QuoteForms = () => {
  const { t } = useTranslation();

  const { apiData, apiDataLoading, paginationEle } = useModuleTableHelpers({
    route: 'admin/general-forms',
    withBreadcrumb: true,
    breadcrumbTitle: t('links.quote_forms'),
    withPagination: true,
    extraParams: {
      type: 4
    }
  });

  const tableHeaders = [
    { label: t('id'), customClass: "small" },
    { label: t('first_name') },
    { label: t('last_name') },
    { label: t('email') },
    { label: t('phone') },
    { label: t('vehicle_model') },
    { label: t('message') },
  ];

  if (apiDataLoading) return <TableSkeleton columns={6} withoutButton />;

  return (
    <div className="pages-page-container">
      <QuoteFormsTableContainer tableHeaders={tableHeaders} data={apiData} noDataMessage={t('no_messages_found')} />
      {paginationEle}
    </div>
  );
};

export default QuoteForms;
