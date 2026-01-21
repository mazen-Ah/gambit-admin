import { useMediaQuery } from 'react-responsive';
import { ITableContainerProps } from '../../../types/Interfaces';
import { IContactUsFormItem } from '../types/interfaces';
import { useTranslation } from 'react-i18next';

const ContactUsFormsTableContainer = ({ tableHeaders, data, noDataMessage, lessColumns }: ITableContainerProps<IContactUsFormItem[]>) => {
  const {i18n} = useTranslation()
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
                <div className="column">
                  <div className="capitalize">{item?.first_name || '-'}</div>
                </div>
                <div className="column">
                  <div className="capitalize">{item?.last_name || '-'}</div>
                </div>
                <div className="column">{item?.email || '-'}</div>
                <div className="column">{item?.phone || '-'}</div>
                <div className="column">{item?.vehicleModel?.name?.[i18n.language as 'en' | 'ar'] || '-'}</div>
                <div className="column">{item?.message || '-'}</div>
                {/* <div className="column">{item?.enquiry_type || '-'}</div> */}
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

export default ContactUsFormsTableContainer;
