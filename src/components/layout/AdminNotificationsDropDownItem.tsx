import { INotificationDropdownItem } from '../../modules/notifications/types/interfaces';
import { useEffect, useState } from 'react';
import { generalPut } from '../../API/api';
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { setReadNotifications } from '../../store/redux/notificationsData';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminNotificationsDropDownItem({ notification, setDropDownToggler }: INotificationDropdownItem) {
  const [isRead, setIsRead] = useState(!!notification.read_at);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { notificationsData } = useSelector((store: any) => store);
  const navigate = useNavigate();

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
    if (notification?.data?.url) {
      // navigate(notification?.data?.url);
      // window.open(notification?.data?.url, '_blank');
      setDropDownToggler && setDropDownToggler(false);
    }
  }

  useEffect(() => {
    if (notificationsData?.readNotifications.includes(notification.id)) {
      setIsRead(true);
    }
  }, [notificationsData?.readNotifications]);

  return (
    <Link to={notification?.data?.url || ''} style={{ width: '100%' }}>
      <div className={`notifications-item ${isRead ? 'read' : ''}`} onClick={handleNotificationClick}>
        <div className="notifications-content">
          <span className="notifications-dot-container">{!isRead && <div className="notifications-dot"></div>}</span>
          <span className="notification-message">{notification.data.message}</span>
        </div>
        <div className="notifications-item-footer">
          {isLoading && (
            <div className="loader-page login">
              <div className="submit_loading_container"></div>
            </div>
          )}
          <div className="notifications-date">{moment(notification.created_at).fromNow()}</div>
        </div>
      </div>
    </Link>
  );
}
