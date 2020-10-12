import { createI18n } from 'vue-i18n'

import de from './locales/de.json'

export function setupI18n(locale = 'de') {
  const i18n = createI18n({
    locale,
    fallbackLocale: 'de',
    messages: {
      de
    }
  })
  return i18n
}