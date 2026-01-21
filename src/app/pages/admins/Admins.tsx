import TableSkeleton from '../../../components/loaders/TableSkeleton';
import ListHeader from '../../../components/ListHeader';
import { hasPermission } from '../../../utils/HelperFunctions';
import { useTranslation } from 'react-i18next';
import useModuleTableHelpers from '../../../hooks/useModuleTableHelpers';
import Button from '../../../components/buttons/Button';
import AdminsTableContainer from '../../../modules/admins/components/AdminsTableContainer';

const Admins = () => {
    const { t } = useTranslation();

    const { apiData, apiDataLoading, paginationEle, searchEle } = useModuleTableHelpers({
        route: 'admin/admins',
        withBreadcrumb: true,
        withSearch: true,
        breadcrumbTitle: t('links.admins'),
        withPagination: true,
        queryKey: 'admins',
        extraParams: {
            relations: 'roles,roles.permissions',
        },
        customSearchPlaceholder: `${t("search_by")} ${t("name")} ${t("or")} ${t("email")}`
    });

    const tableHeaders = [
        { label: t('name') },
        { label: t('email'), customClass: 'flex-grow-2' },
        { label: t('roles') },
        hasPermission(['admins.edit']) && { label: t('admin_approval'), customClass: 'status_col' },
        { label: t('verification'), customClass: 'status_col' },
        hasPermission(['admins.edit']) && { label: t('actions'), customClass: 'actions_col' }
    ];


    if (apiDataLoading && !apiData) return <TableSkeleton columns={5} withoutButton />;

    return (
        <div className="admins-page-container">
            <ListHeader customClass='table_filters'>
                <div className="filter_container">{searchEle}</div>
                {hasPermission(['admins.edit']) && <Button text={t('create_admin')} link="/admins/create-admin" />}
            </ListHeader>


            <AdminsTableContainer
                tableHeaders={tableHeaders}
                data={apiData}
                noDataMessage={t('no_admins_found')}
                lessColumns
            />
            {paginationEle}
        </div>
    );
};

export default Admins;
