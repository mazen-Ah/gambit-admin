import moment from 'moment/moment';
// import "moment/locale/ar";
import { INotification } from '../types/interfaces';
import { useEffect, useState } from 'react';
import { generalPut } from '../../../API/api';
import { useDispatch, useSelector } from 'react-redux';
import { setReadNotifications } from '../../../store/redux/notificationsData';
import { Link, useNavigate } from 'react-router-dom';

export default function NotificationsItem({ notification }: { notification: INotification }) {
  const [isRead, setIsRead] = useState(!!notification.read_at);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { notificationsData } = useSelector((store: any) => store);
  const navigate = useNavigate();


  // moment.locale(i18n?.language)

  function handleReadMutation() {
    setIsLoading(true);
    generalPut(`/notifications/${notification?.id}`, {})
      .then(() => {
        setIsRead(true);
        dispatch(setReadNotifications([notification.id]));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleNotificationClick() {
    if (!notification.read_at) {
      handleReadMutation();
    }
  }

  useEffect(() => {
    if (notificationsData?.readNotifications.includes(notification.id)) {
      setIsRead(true);
    }
  }, [notificationsData?.readNotifications]);

  return (
    <Link to={ notification?.data?.url || '/'} replace style={{ width: '100%' }}>
      <div className={`notifications-item ${isRead ? 'read' : ''}`} onClick={handleNotificationClick}>
        <div className="notifications-left">
          <div className="notifications-time">
            <div className="notifications-dot-container">{!isRead && <div className="notifications-dot"></div>}</div>
            <div>{moment(notification.created_at).format('hh:mm A')}</div>
          </div>
          <div className="notifications-content">{notification?.data?.message}</div>
        </div>

        {isLoading && (
          <div className="loader-page login">
            <div className="submit_loading_container"></div>
          </div>
        )}
      </div>
    </Link>
  );
}
