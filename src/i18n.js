import i18next from 'i18next';

const setupI18n = () => {
  return i18next.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru: {
        translation: {
          validation: {
            invalidUrl: 'Ссылка должна быть валидным URL',
            duplicateUrl: 'RSS уже существует',
            required: 'Обязательное поле',
          },
          errors: {
            network_error: 'Ошибка сети',
            request_timed_out: 'Превышено время ожидания',
            'rss.invalid': 'Ресурс не содержит валидный RSS',
          },
          submit: 'Добавить',
          loading: 'Загрузка...',
        },
      },
    },
  });
};

export default setupI18n;