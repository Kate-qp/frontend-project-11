import i18n from 'i18next';
import resources from './index.js';

export default () => {
  const instance = i18n.createInstance();
  instance.init({
    lng: 'ru',
    debug: false,
    resources,
  });
  return instance;
};
