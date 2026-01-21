import TableSkeleton from '../../../components/loaders/TableSkeleton';
import { useTranslation } from 'react-i18next';
import useModuleTableHelpers from '../../../hooks/useModuleTableHelpers';
import NewsLetterFormsTableContainer from '../../../modules/generalForms/components/NewsLetterFormsTableContainer';

const NewsLetterForms = () => {
  const { t } = useTranslation();

  const { apiData, apiDataLoading, paginationEle } = useModuleTableHelpers({
    route: 'admin/general-forms',
    withBreadcrumb: true,
    breadcrumbTitle: t('links.news-letter_forms'),
    withPagination: true,
    extraParams: {
      type: 3
    }
  });

  const tableHeaders = [
    { label: t('id'), customClass: "small" },
    { label: t('email'), customClass: "text-start" },
  ];

  if (apiDataLoading) return <TableSkeleton columns={6} withoutButton />;

  return (
    <div className="pages-page-container">
      <NewsLetterFormsTableContainer tableHeaders={tableHeaders} data={apiData} noDataMessage={t('no_messages_found')} lessColumns />
      {paginationEle}
    </div>
  );
};

export default NewsLetterForms;
