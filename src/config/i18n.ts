import i18next from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import ar from "../assets/locale/ar/translation.json"
import en from "../assets/locale/en/translation.json"

const resources = {
	en: {
		translation: en,
	},
	ar: {
		translation: ar,
	},
}

i18next
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		lng: localStorage.getItem("i18nextLng") || "en",
		interpolation: {
			escapeValue: false,
		},
		react: {
			useSuspense: false,
		},
	})

export default i18next
