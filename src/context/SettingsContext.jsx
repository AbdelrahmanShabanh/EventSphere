import { createContext, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { lightTheme, darkTheme, getThemeDirection } from "../theme/theme";
import { useTranslation } from "react-i18next";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";

export const SettingsContext = createContext();

const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const ltrCache = createCache({
  key: "muiltr",
  stylisPlugins: [prefixer],
});

export const SettingsProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedLanguage = localStorage.getItem("language");

    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true");
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const isRtl = language === "ar";

  const theme = createTheme(
    darkMode ? darkTheme : lightTheme,
    getThemeDirection(isRtl)
  );

  const contextValue = {
    darkMode,
    toggleDarkMode,
    language,
    changeLanguage,
    isRtl,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      <CacheProvider value={isRtl ? rtlCache : ltrCache}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </CacheProvider>
    </SettingsContext.Provider>
  );
};
