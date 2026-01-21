// 'use client';

// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { generalPut } from '../API/api';
// import { useDispatch } from 'react-redux';
// import { setReadNotifications } from '../store/redux/notificationsData';
// import { useNavigate } from 'react-router-dom';
// import { useQueryClient } from '@tanstack/react-query';

// interface NotificationsProps {
//   userId: number;
// }

// const NotificationsEcho: React.FC<NotificationsProps> = ({ userId }) => {
//   const dispatch = useDispatch();
//   const [clickedNotifications, setClickedNotifications] = useState<number[]>([]);
//   const navigate = useNavigate();
//   const queryClient = useQueryClient()

//   function handleReadMutation(id: number) {
//     if (clickedNotifications.includes(id)) return;

//     setClickedNotifications((prev) => [...prev, id]);

//     generalPut(`/notifications/${id}`, {})
//       .then(() => {
//         dispatch(setReadNotifications([id]));
//       })
//   }

//   useEffect(() => {
//     if(!userId) return
//     window.Echo.connect();
//     const channel = window.Echo.private(`notifications.${userId}`);
//     const commentsChannel = window.Echo.private(`responsibilities.${userId}`);
//     const entityChannel = window.Echo.private(`roles.${userId}`);

//     channel.notification((notification: any) => {
//       queryClient.invalidateQueries({queryKey: ["notifications"]});
//       toast.info(notification.message, {
//         icon: false,

//         onClick: () => {
//           toast.dismiss();
//           handleReadMutation(notification.id);
//           if (notification?.url) {
//             navigate(notification?.url);
//           }
//         }
//       });
//     });
//     commentsChannel.notification((notification: any) => {
//       queryClient.invalidateQueries({queryKey: ["notifications"]});
//       toast.info(notification.message, {
//         icon: false,

//         onClick: () => {
//           toast.dismiss();
//           handleReadMutation(notification.id);
//           if (notification?.url) {
//             navigate(notification?.url);
//           }
//         }
//       });
//     });
//     entityChannel.notification((notification: any) => {
//       queryClient.invalidateQueries({queryKey: ["notifications"]});
//       toast.info(notification.message, {
//         icon: false,

//         onClick: () => {
//           toast.dismiss();
//           handleReadMutation(notification.id);
//           if (notification?.url) {
//             navigate(notification?.url);
//           }
//         }
//       });
//     });

//     return () => {
//       window.Echo.disconnect();
//     }
//   }, [userId]);

//   return null;
// };

const NotificationsEcho = () => {
  return null;
};


export default NotificationsEcho;
