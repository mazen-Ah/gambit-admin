import { createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"

interface IBreadCrumbs {
	links: {
		label: string
		path: string
	}[]
	page_title: string
	serviceProviderId?: string | null
	distributorId?: string | null
	sellerId?: string | null
	applicationId?: string | null
	offerIsActive?: boolean | null
	insideOffer?: string | null
	editBtn?: {name : string, path: string, permission?: string} | null
}
interface BreadCrumbsState {
	breadCrumbsData: IBreadCrumbs
}
const initialState: BreadCrumbsState = {
	breadCrumbsData: {
		links: [{ label: "dashboard", path: "/" }],
		page_title: "Dashboard",
		serviceProviderId: Cookies.get("service_ID")
			? Cookies.get("service_ID")
			: null,
		distributorId: Cookies.get("distributor_ID")
			? Cookies.get("distributor_ID")
			: null,
		sellerId: Cookies.get("seller_ID") ? Cookies.get("seller_ID") : null,
		applicationId: Cookies.get("application_ID") ? Cookies.get("application_ID") : null,
		insideOffer: Cookies.get("insideOffer") ? Cookies.get("insideOffer") : null,
		offerIsActive: false,
		editBtn: null
	},
}

const breadCrumbsSlice = createSlice({
	name: "breadCrumbsData",
	initialState,
	reducers: {
		setBreadCrumbsData: (state, action) => {
			state.breadCrumbsData = action.payload
		},
		setOfferIsActive: (state, action) => {
			state.breadCrumbsData.offerIsActive = action.payload
		}
	},
})

export const setBreadCrumbsData = breadCrumbsSlice.actions.setBreadCrumbsData
export const setOfferIsActive = breadCrumbsSlice.actions.setOfferIsActive
export default breadCrumbsSlice.reducer
