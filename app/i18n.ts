import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

i18n
  .use(Backend)
  // https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  .use(initReactI18next)
  // https://www.i18next.com/overview/configuration-options
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: "zh-CN", // use en if detected lng is not available
    saveMissing: true, // send not translated keys to endpoint
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
