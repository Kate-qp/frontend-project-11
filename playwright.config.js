import { defineConfig } from '@playwright/test'

export default defineConfig({
  projects: [
    {
      name: 'Yandex',
      use: {
        channel: 'chrome',
        executablePath: 'C:\\Users\\kpark\\AppData\\Local\\Yandex\\YandexBrowser\\Application\\browser.exe',
      },
    },
  ],
  timeout: 20000,
})
