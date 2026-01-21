import { Fragment } from 'react'
import { INotificationsCategory } from '../types/interfaces';
import NotificationsItem from './NotificationsItem';

export default function NotificationsList({ notifications }: { notifications: INotificationsCategory[] }) {

  if(!notifications?.length){
    return (
      <h6>No notifications</h6>
    )
  }

  return (
    <Fragment>
      {notifications.map((item, index) => (
        <div className="notifications-category">
          <h4>{item.date}</h4>
          <div className="notifications-items">
            {item.items.map((notification) => (
              <NotificationsItem notification={notification} key={`notifications-item-${index}`}/>
            ))}
          </div>
        </div>
      ))}
    </Fragment>
  )
}
