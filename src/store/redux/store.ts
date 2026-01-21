import { configureStore } from "@reduxjs/toolkit"
import breadCrumbsData from "./breadCrumbsData"
import notificationsData from "./notificationsData"
import rolesData from "./rolesData"
import authData from "../../modules/auth/store/redux/authData"

export const store = configureStore({
	reducer: {
		breadCrumbsData,
		authData,
		rolesData,
		notificationsData,
	},
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
