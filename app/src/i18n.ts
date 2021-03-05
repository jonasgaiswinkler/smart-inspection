import { createI18n } from "vue-i18n";

import de from "@/locales/de.json";
import en from "@/locales/en.json";

export function setupI18n(locale = "de") {
  const i18n = createI18n({
    locale,
    fallbackLocale: "de",
    messages: {
      de,
      en,
    },
  });
  return i18n;
}
