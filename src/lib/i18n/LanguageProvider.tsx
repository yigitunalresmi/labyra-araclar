"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Translation } from "./translations";

export type Lang = "tr" | "en";

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (entry: Translation) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: "tr",
  setLang: () => {},
  t: (entry) => entry.tr,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    const saved = localStorage.getItem("labyra-lang");
    if (saved === "tr" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("labyra-lang", l);
    } catch {
      // localStorage erişilemezse sessiz geç
    }
  };

  const t = (entry: Translation) => entry[lang] ?? entry.tr;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
