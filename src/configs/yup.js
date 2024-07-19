import * as yup from 'yup'

import * as yupLocaleEN from './utils/yup-en'
import * as yupLocaleJA from './utils/yup-jp'

const yupLocales = {
  ja: yupLocaleJA,
  en: yupLocaleEN,
}

export const loadYupValidate = (locale) => {
  const selectedLocale = yupLocales[locale]?.suggestive

  if (selectedLocale) {
    yup.setLocale({
      ...selectedLocale,
      mixed: {
        ...selectedLocale.mixed,
      },
    })
  }
}
