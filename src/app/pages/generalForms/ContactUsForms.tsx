import TableSkeleton from '../../../components/loaders/TableSkeleton';
import { useTranslation } from 'react-i18next';
import useModuleTableHelpers from '../../../hooks/useModuleTableHelpers';
import ContactUsFormsTableContainer from '../../../modules/generalForms/components/ContactUsFormsTableContainer';

const ContactUsForms = () => {
  const { t } = useTranslation();

  const { apiData, apiDataLoading, paginationEle } = useModuleTableHelpers({
    route: 'admin/general-forms',
    withBreadcrumb: true,
    breadcrumbTitle: t('links.news-letter_forms'),
    withPagination: true,
    extraParams: {
      type: 2
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
    // { label: t('enquiry_type') },
  ];

  if (apiDataLoading) return <TableSkeleton columns={6} withoutButton />;

  return (
    <div className="pages-page-container">
      <ContactUsFormsTableContainer tableHeaders={tableHeaders} data={apiData} noDataMessage={t('no_messages_found')} />
      {paginationEle}
    </div>
  );
};

export default ContactUsForms;
