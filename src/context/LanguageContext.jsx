import React, { createContext, useContext, useState } from "react";
import { translations } from "../utils/translations";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("ru");

  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  const switchLanguage = (lang) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
