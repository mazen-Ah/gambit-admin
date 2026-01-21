import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { editIcon } from '../../../config/variables';
import { navigateRoute } from '../../../utils/HelperFunctions';
import DeleteButton from '../../../components/buttons/DeleteButton';
import TableSkeleton from '../../../components/loaders/TableSkeleton';
import { ITableContainerProps } from '../../../types/Interfaces';
import { ISectionTypeTableItem } from '../types/interfaces';
import { useTranslation } from 'react-i18next';

const SectionTypesTableContainer = ({ tableHeaders, data, loading, noDataMessage, lessColumns }: ITableContainerProps<ISectionTypeTableItem[]>) => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const { i18n } = useTranslation();

  if (loading) return <TableSkeleton columns={6} withoutButton withoutHeader />;

  return (
    <div className={`table_container ${lessColumns && isDesktop && 'lessColumns'} hasPagination`}>
      <div className="table_header">
        {tableHeaders?.map((header: any, index: number) => (
          <span className={`head ${header.customClass}`} key={index}>
            {header.label}
          </span>
        ))}
      </div>
      <div className={`table_data ${(!data || data?.length === 0) && 'no_data'}`}>
        {data?.length > 0 ? (
          <>
            {data?.map((item: any, index: number) => (
              <div className="item has_logo fuel_types" key={index}>
                <div className="column">
                  <div className="capitalize">{(typeof item?.name === 'object' ? item?.name?.[i18n.language as 'en' | 'ar'] : item?.name) || '-'}</div>
                </div>
                <div className="column">
                  <div>{(typeof item?.description === 'object' ? item?.description?.[i18n.language as 'en' | 'ar'] : item?.description) || '-'}</div>
                </div>
                <div className="column actions actions_col">
                  <div
                    className="action_btn edit"
                    onClick={(e) => {
                      navigateRoute(e, `/section-types/create-section-type/${item.id}`, navigate);
                    }}
                  >
                    {editIcon}
                  </div>
                  <DeleteButton deleteRoute={`/cms/admin/section-types`} queryKey={`section-types`} id={item.id} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <h6>{noDataMessage}</h6>
        )}
      </div>
    </div>
  );
};

export default SectionTypesTableContainer;
