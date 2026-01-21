import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUserData } from "../../types/Interfaces"
import Cookies from "js-cookie"

interface AuthDataState {
	userToken: string | null
	userPermissions: string[] | null
	userRoles: string[] | null
	userData: IUserData
}

const cookieData = localStorage.getItem("user_data")
const initialState: AuthDataState = {
	userToken: Cookies.get("token") || null,
	userPermissions:
		JSON.parse(localStorage.getItem("user_permissions") as string) || null,
	userData: cookieData ? (JSON.parse(cookieData) as IUserData) : {},
	userRoles: JSON.parse(localStorage.getItem("user_roles") as string) || null,

}

const authDataSlice = createSlice({
	name: "authData",
	initialState,
	reducers: {
		setUserToken: (state, action: PayloadAction<string | null>) => {
			state.userToken = action.payload
		},
		setUserData: (state, action: PayloadAction<IUserData>) => {
			state.userData = action.payload
		},
		setUserPermissions: (state, action: PayloadAction<string[]>) => {
			state.userPermissions = action.payload
		},
		setUserRoles: (state, action: PayloadAction<string[]>) => {
			state.userPermissions = action.payload
		},
		handleUnAuthenticated: (state) => {
			state.userToken = null
			state.userData = {}

			Cookies.remove("token")
		},
	},
})

export const {
	setUserToken,
	setUserData,
	handleUnAuthenticated,
	setUserPermissions,
	setUserRoles
} = authDataSlice.actions
export default authDataSlice.reducer
