import { useMediaQuery } from 'react-responsive';
import { ITableContainerProps } from '../../../types/Interfaces';
import { INewsLetterFormItem } from '../types/interfaces';

const NewsLetterFormsTableContainer = ({ tableHeaders, data, noDataMessage, lessColumns }: ITableContainerProps<INewsLetterFormItem[]>) => {
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <div className={`table_container ${lessColumns && isDesktop && 'lessColumns'} hasPagination`}>
      <div className="table_header">
        {tableHeaders?.map((header, index) => !header ? null : (
          <span className={`head ${header.customClass}`} key={index}>
            {header.label}
          </span>
        ))}
      </div>
      <div className={`table_data ${(!data || data?.length === 0) && 'no_data'}`}>
        {data?.length > 0 ? (
          <>
            {data?.map((item, index) => (
              <div className="item has_logo fuel_types" key={index}>
                <div className="column small">{item?.id || '-'}</div>
                <div className="column text-start">{item?.email || '-'}</div>
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

export default NewsLetterFormsTableContainer;
