import { useMediaQuery } from 'react-responsive';
import { ITableContainerProps } from '../../../types/Interfaces';
import { IAdmin } from '../types/interfaces';
import DeleteButton from '../../../components/buttons/DeleteButton';

const AdminsTableContainer = ({ tableHeaders, data, noDataMessage, lessColumns }: ITableContainerProps<IAdmin[]>) => {
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <div className={`table_container ${lessColumns && isDesktop && 'lessColumns'} hasPagination`}>
      <div className="table_header">
        {tableHeaders?.map((header: any, index: number) => (
          <span className={`head ${header.customClass}`} key={index}>
            {header.label}
          </span>
        ))}
      </div>
      <div className={`table_data ${(!data || !data?.length) && 'no_data'}`}>
        {data?.length > 0 ? (
          data?.map((item: any, index: number) => (
            <div className="item" key={index}>
              <div className="column">{item?.first_name + ' ' + item?.last_name || '-'}</div>
              <div className="column">{item?.email || '-'}</div>
              <div className="column">{item?.mobile}</div>
              <div className="column actions actions_col">
                <DeleteButton
                  deleteRoute={`/admin/remove-leeds-assigned-sales`}
                  queryKey="assigned-leads"
                  id={item.id}
                  post
                  values={{
                    leads_ids: [item.id]
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <h6>{noDataMessage}</h6>
        )}
      </div>
    </div>
  );
};

export default AdminsTableContainer;
