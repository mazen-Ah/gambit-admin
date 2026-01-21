import { createSlice } from '@reduxjs/toolkit';

const initialState: { readNotifications: string[]; unReadNotificationsCount: number; refetch: number } = {
  readNotifications: [],
  unReadNotificationsCount: 0,
  refetch: 0
};

const notificationsSlice = createSlice({
  name: 'notificationsData',
  initialState,
  reducers: {
    setReadNotifications: (state, action) => {
      state.readNotifications = [...state.readNotifications, ...action.payload];
      state.unReadNotificationsCount = state.unReadNotificationsCount - 1
    },
    setUnReadNotificationsCount: (state, action) => {
      state.unReadNotificationsCount = action.payload;
    },
  }
});

export const setReadNotifications = notificationsSlice.actions.setReadNotifications;
export const setUnReadNotificationsCount = notificationsSlice.actions.setUnReadNotificationsCount;
export default notificationsSlice.reducer;
