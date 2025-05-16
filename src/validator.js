import * as yup from 'yup';
import i18next from 'i18next';

const setupYupLocale = () => {
  yup.setLocale({
    mixed: {
      required: () => i18next.t('errors.required'),
      notOneOf: () => i18next.t('errors.exists'),
    },
    string: {
      url: () => i18next.t('errors.invalidUrl'),
    },
  });
};

export function validateUrl(url, feeds) {
  setupYupLocale();
  
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(feeds.map((feed) => feed.url));
    
  return schema.validate(url);
}
