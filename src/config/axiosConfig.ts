import axios from "axios"
import { API_URL, X_CLIENT_DOMAIN } from "./APIs"
import Cookies from "js-cookie"
import i18next from "i18next"


export const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		Accept: "application/json",
		'Accept-Language': i18next.language || 'en',
		'X-Client-Domain': X_CLIENT_DOMAIN,
	},
})

axiosInstance.interceptors.request.use(
	(config) => {
		const token = Cookies.get("token")
		const marketCode = Cookies.get("market")

		console.log(marketCode, "marketCode")

		if (token) {
			config.headers.authorization = `Bearer ${token}`
		}
		if (marketCode) {
			config.headers['X-Client-Code'] = marketCode
		}

		config.headers['Accept-Language'] = i18next?.language || "en"
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)
