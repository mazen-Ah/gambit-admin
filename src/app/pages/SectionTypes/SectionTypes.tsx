import TableSkeleton from '../../../components/loaders/TableSkeleton';
import ListHeader from '../../../components/ListHeader';
import { useTranslation } from 'react-i18next';
import useModuleTableHelpers from '../../../hooks/useModuleTableHelpers';
import SectionTypesTableContainer from '../../../modules/sectionTypes/components/SectionTypesTableContainer';
import Button from '../../../components/buttons/Button';

const SectionTypes = () => {
  const { t } = useTranslation();

  const { apiData, apiDataLoading, paginationEle, searchEle } = useModuleTableHelpers({
    route: 'cms/admin/section-types',
    withBreadcrumb: true,
    breadcrumbTitle: t('section_types'),
    withPagination: true,
    queryKey: "section-types",
  });

  const tableHeaders = [
    { label: t('name') },
    { label: t('description') },
    { label: t('actions'), customClass: 'actions_col' }
  ];

  if (apiDataLoading && !apiData) return <TableSkeleton columns={6} withoutButton />;

  return (
    <div className="section-types-page-container">
      <ListHeader customClass='table_filters'>
        <Button text={t('create_section_type')} link="/section-types/create-section-type" />
      </ListHeader>
      <SectionTypesTableContainer tableHeaders={tableHeaders} data={apiData} loading={apiDataLoading} noDataMessage={t('no_section_types_found')} lessColumns />
      {paginationEle}
    </div>
  );
};

export default SectionTypes;
