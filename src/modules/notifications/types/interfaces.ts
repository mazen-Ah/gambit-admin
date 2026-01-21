export interface INotification {
  id: string;
  data: {
    message: string;
    url?: string;
  },
  created_at: string;
  read_at: string;
}
export interface INotificationDropdownItem {
  notification: INotification;
  setDropDownToggler?: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface INotificationsCategory {
  date: string;
  items: INotification[]
}

export interface INotificationsSkeleton {
  columns: number,
  withSelectFilter?: boolean,
  withoutButton?: boolean,
  withoutHeader?: boolean,
  small?: string,
}