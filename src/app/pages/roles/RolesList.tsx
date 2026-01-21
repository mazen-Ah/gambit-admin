import { useTranslation } from "react-i18next";
import TableSkeleton from "../../../components/loaders/TableSkeleton";
import RolesTableContainer from "../../../modules/roles/components/RolesTableContainer";
import useModuleTableHelpers from "../../../hooks/useModuleTableHelpers";
import ListHeader from "../../../components/ListHeader";
import Button from "../../../components/buttons/Button";
import { hasPermission } from "../../../utils/HelperFunctions";

const RolesList = () => {

    const { t } = useTranslation()

    const { apiData, apiDataLoading, paginationEle, searchEle } = useModuleTableHelpers({
        route: 'admin/roles',
        withBreadcrumb: true,
        withSearch: true,
        breadcrumbTitle: t('roles'),
        withPagination: true,
        queryKey: 'roles',
        extraParams: {
            relations: 'permissions'
        }
    });



    const tableHeaders = [
        { label: t("name") },
        hasPermission(['roles.edit', 'roles.delete','roles.show']) && { label: t("actions"), customClass: "actions_col" },
    ];

    if (apiDataLoading && !apiData) return <TableSkeleton columns={6} withoutButton withoutHeader />

    return (
        <div className="roles-page-container">
            <ListHeader customClass="table_filters">
                <div className="filter_container">{searchEle}</div>
                {hasPermission(['roles.edit']) && <Button text={t('createRole')} link="/roles/create-role" />}
            </ListHeader>

            <RolesTableContainer
                tableHeaders={tableHeaders}
                data={apiData}
                noDataMessage={t("no_roles_found")}
                border
            />
            {paginationEle}
        </div>
    );
}

export default RolesList;