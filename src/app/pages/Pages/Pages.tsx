import TableSkeleton from '../../../components/loaders/TableSkeleton';
import ListHeader from '../../../components/ListHeader';
import { useTranslation } from 'react-i18next';
import useModuleTableHelpers from '../../../hooks/useModuleTableHelpers';
import PagesTableContainer from '../../../modules/pages/components/PagesTableContainer';
import Button from '../../../components/buttons/Button';

const Pages = () => {
  const { t } = useTranslation();

  const { apiData, apiDataLoading, paginationEle, searchEle } = useModuleTableHelpers({
    route: 'cms/admin/pages',
    withBreadcrumb: true,
    // withSearch: true,
    breadcrumbTitle: t('links.pages'),
    withPagination: true,
    queryKey: "pages",
  });

  const tableHeaders = [
    { label: t('name') },
    { label: t('actions'), customClass: 'actions_col' }
  ];

  if (apiDataLoading && !apiData) return <TableSkeleton columns={6} withoutButton />;
  
  return (
    <div className="pages-page-container">
      <ListHeader customClass='table_filters'>
        {/* <div className="filter_container">{searchEle}</div> */}
        {<Button text={t('create_page')} link="/pages/create-page" />}
      </ListHeader>
      <PagesTableContainer tableHeaders={tableHeaders} data={apiData} loading={apiDataLoading} noDataMessage={t('no_pages_found')} lessColumns />
      {paginationEle}
    </div>
  );
};

export default Pages;
