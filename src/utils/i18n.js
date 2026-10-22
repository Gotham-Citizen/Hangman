import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.js";
import zhTranslation from "./locales/zh/translation.js";
import esTranslation from "./locales/es/translation.js";

const browserLng = (() => {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("zh")) return "zh";
  if (lang.startsWith("es")) return "es";
  return "en";
})();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    zh: { translation: zhTranslation },
    es: { translation: esTranslation },
  },
  lng: browserLng,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

document.documentElement.lang = i18n.resolvedLanguage || i18n.language;
document.title = i18n.t("pageTitle");
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  document.title = i18n.t("pageTitle");
});

export default i18n;
