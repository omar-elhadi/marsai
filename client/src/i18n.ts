import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonFR from "./locales/fr/common.json";
import errorsFR from "./locales/fr/errors.json";
import adminFR from "./locales/fr/admin.json";
import commonEN from "./locales/en/common.json";
import errorsEN from "./locales/en/errors.json";
import adminEN from "./locales/en/admin.json";

const resources = {
  fr: {
    common: commonFR,
    errors: errorsFR,
    admin: adminFR,
  },
  en: {
    common: commonEN,
    errors: errorsEN,
    admin: adminEN,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    ns: ["common", "errors", "admin"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
