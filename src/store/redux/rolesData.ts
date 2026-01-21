import { createSlice } from "@reduxjs/toolkit"


const initialState = {
	roles: [
		{
			label: "",
			value: "",
		},
	],
	permissions: [],
}

const rolesSlice = createSlice({
	name: "rolesData",
	initialState,
	reducers: {
		setRoles: (state, action) => {
			state.roles = action.payload
		},
		setPermissions: (state, action) => {
			state.permissions = action.payload
		},
	},
})

export const setRolesData = rolesSlice.actions.setRoles
export const setPermissions = rolesSlice.actions.setPermissions
export default rolesSlice.reducer
