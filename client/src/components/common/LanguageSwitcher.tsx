import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(
    (lng: string) => {
      i18n.changeLanguage(lng);
      document.documentElement.lang = lng;
      localStorage.setItem("marsai_lang", lng);
    },
    [i18n],
  );

  useEffect(() => {
    const savedLang =
      localStorage.getItem("marsai_lang") || i18n.language || "fr";
    document.documentElement.lang = savedLang;
  }, [i18n.language]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage("fr")}
        className={`text-xs uppercase font-bold tracking-widest transition-opacity ${i18n.language === "fr" ? "opacity-100 text-[var(--color-primary)]" : "opacity-50 hover:opacity-80"}`}
      >
        FR
      </button>
      <span className="opacity-30 text-xs">/</span>
      <button
        onClick={() => changeLanguage("en")}
        className={`text-xs uppercase font-bold tracking-widest transition-opacity ${i18n.language === "en" ? "opacity-100 text-[var(--color-primary)]" : "opacity-50 hover:opacity-80"}`}
      >
        EN
      </button>
    </div>
  );
};
