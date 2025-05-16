import i18next from 'i18next';

const setupI18n = () => {
  return i18next.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru: {
        translation: {
          rssAggregator: 'RSS агрегатор',
          description: 'Начните читать RSS сегодня! Это легко, это красиво.',
          example: 'Пример: https://ru.hexlet.io/lessons.rss',
          submit: 'Добавить',
          feeds: 'Фиды',
          posts: 'Посты',
          view: 'Просмотр',
          success: 'RSS успешно загружен',
          errors: {
            required: 'Не должно быть пустым',
            invalidUrl: 'Ссылка должна быть валидным URL',
            exists: 'RSS уже существует',
            network: 'Ошибка сети',
            invalidRss: 'Ресурс не содержит валидный RSS',
          },
          modal: {
            read: 'Читать полностью',
            close: 'Закрыть',
          },
        },
      },
    },
  });
};

export default setupI18n;
