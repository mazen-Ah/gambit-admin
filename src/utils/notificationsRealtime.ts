// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';
// import { generalCreate } from '../API/api';

// declare global {
//   interface Window {
//     Pusher: typeof Pusher;
//     Echo: Echo;
//   }
// }

// window.Pusher = Pusher;
// // Pusher.logToConsole = true;

// const echo = new Echo({
//   broadcaster: 'reverb',
//   key: process.env.REACT_APP_REVERB_KEY as string,
//   wsHost: process.env.REACT_APP_REVERB_HOST as string,
//   wsPort: Number(process.env.REACT_APP_REVERB_PORT),
//   wssPort: Number(process.env.REACT_APP_REVERB_PORT),
//   forceTLS: (process.env.REACT_APP_REVERB_SCHEME ?? 'https') === 'https',
//   enabledTransports: ['ws', 'wss'],
//   authorizer: (channel: any, options: any) => {
//     return {
//       authorize: (socketId: any, callback: any) => {
//         generalCreate({
//           route: 'broadcasting/auth',
//           values: {
//             socket_id: socketId,
//             channel_name: channel.name
//           }
//         })
//           .then((response) => {
//             callback(null, response.data);
//           })
//           .catch((error) => {
//             callback(error);
//           });
//       }
//     };
//   }
// });

// window.Echo = echo;

const echo = null;

export { echo };
