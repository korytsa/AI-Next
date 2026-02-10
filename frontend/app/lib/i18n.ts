import i18n from 'i18next'
import en from '../../public/locales/en/translation.json'
import ru from '../../public/locales/ru/translation.json'

if (!i18n.isInitialized) {
  void i18n.init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
}

export default i18n



