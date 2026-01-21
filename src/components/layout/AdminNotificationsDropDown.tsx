import { useQuery } from '@tanstack/react-query';
import { IAdminDataDropDown } from '../../types/Interfaces';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { generalGet } from '../../API/api';
import { INotification } from '../../modules/notifications/types/interfaces';
import NotificationsSkeleton from '../../modules/notifications/components/NotificationsSkeleton';
import { Fragment } from 'react/jsx-runtime';
import AdminNotificationsDropDownItem from './AdminNotificationsDropDownItem';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUnReadNotificationsCount } from '../../store/redux/notificationsData';

const AdminNotificationsDropDown = ({ dropDownToggler, setDropDownToggler }: IAdminDataDropDown) => {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const {userData} = useSelector((store: any) => store.authData);

  const { isSuccess: userIsSuccess } = useQuery({
    queryKey: ['user'],
    queryFn: () => generalGet(`admin/admins/${userData.id}`),
    refetchOnWindowFocus: false,
    enabled: !!userData.id
  });

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['notifications', i18n],
    queryFn: () => generalGet(`/notifications`),
    refetchOnWindowFocus: false,
    enabled: !!userIsSuccess && false
  });

  useEffect(() => {
    const reqData = data?.data?.data;

    isSuccess && setNotifications(reqData?.notifications);
    isSuccess && dispatch(setUnReadNotificationsCount(reqData?.unread_count));
  }, [data]);

  return (
    <div className={`admin_notifications_drop_down dropdown ${dropDownToggler && 'show'}`}>
      <div className="drop-header">
        <div className="header">
          <h6>{t('notifications')}</h6>
          <Link to="/notifications" onClick={() => setDropDownToggler && setDropDownToggler(false)}>
            {t('seeAll')}
          </Link>
        </div>
      </div>

      <div className="notifications">
        {isLoading ? (
          <NotificationsSkeleton insideHeader />
        ) : (
          <Fragment>
            {notifications?.map((ele: INotification) => {
              return <AdminNotificationsDropDownItem notification={ele} key={`notification-item-${ele.id}`} setDropDownToggler={setDropDownToggler} />;
            })}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsDropDown;
