import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { hasPermission, navigateRoute } from '../../../utils/HelperFunctions';
import { ITableContainerProps } from '../../../types/Interfaces';
import { IAdmin } from '../types/interfaces';
import { editIcon, Sales } from '../../../config/variables';
import DeleteButton from '../../../components/buttons/DeleteButton';
import SwitchActivation from '../../../components/layout/SwitchActivation';
import { generalCreate } from '../../../API/api';
import { authContext } from '../../../store/context/authContext';

const AdminsTableContainer = ({ tableHeaders, data, noDataMessage, lessColumns }: ITableContainerProps<IAdmin[]>) => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { catchError } = useContext(authContext);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});

  const handleChangeStatus = (item: any) => {
    setLoadingItems((prev) => ({ ...prev, [item.id]: true }));
    let value = { status: item?.status === 'APPROVED' ? '1' : '2', _method: 'POST' };

    let route = `/admin/admins/change-status/${item?.id}`;
    generalCreate({
      route: route,
      values: { ...value }
    })
      .then((res) => {
        setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
        toast.success(`${t('status_changed_successfully')}`);
        queryClient.invalidateQueries({ queryKey: ['admins'] });
      })
      .catch((error) => {
        setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
        catchError(error);
      });
  };

  const hasEditPermission = hasPermission(['admins.edit']);

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
            <div
              className={`item ${hasEditPermission && 'clickable'}`}
              key={index}
              onClick={(e) => {
                hasEditPermission && navigateRoute(e, `/admins/create-admin/${item.id}`, navigate);
              }}
            >
              <div className="column">{item?.first_name + ' ' + item?.last_name || '-'}</div>
              <div className="column flex-grow-2">{item?.email || '-'}</div>
              <div className="column">{item?.roles?.length ? item.roles.map((role: { id: number; name: string }) => <div key={role.id}>{role.name}</div>) : '-'}</div>
              <div className={`column status_col  `}>
                <div className="centered-flex min-height-38">
                  <div onClick={(e) => e.stopPropagation()}>
                    <SwitchActivation onChange={() => handleChangeStatus(item)} active={item?.status === 'APPROVED'} loading={loadingItems[item.id] || false} />
                  </div>
                </div>
              </div>
              <div className={`column status_col  capitalize`}>
                <div className={`change_bg_color ${item?.verified ? 'active' : 'pending'}`}>{`${item?.verified ? t('verification_done') : t('verification_pending')}`}</div>
              </div>
              {hasEditPermission && (
                <div className="column actions actions_col">
                  {item?.roles?.some((role: any) => role.permissions?.some((permission: any) => permission.name === 'leeds.leads_can_be_assigned')) && (
                    <div
                      className="action_btn edit"
                      onClick={(e) => {
                        navigateRoute(e, `/admins/assigned-leads/${item.id}`, navigate);
                      }}
                    >
                      {Sales}
                    </div>
                  )}
                  <div
                    className="action_btn edit"
                    onClick={(e) => {
                      navigateRoute(e, `/admins/create-admin/${item.id}`, navigate);
                    }}
                  >
                    {editIcon}
                  </div>
                  <DeleteButton deleteRoute={`/admin/admins`} queryKey="admins" id={item.id} />
                </div>
              )}
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
