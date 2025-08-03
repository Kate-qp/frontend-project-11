import { test, expect } from '@playwright/test'

test('Проверка загрузки RSS в Яндекс', async ({ page }) => {
  await page.goto('http://localhost:8080')
  await expect(page).toHaveTitle(/RSS агрегатор/)
  await page.locator('input[name="url"]').fill('https://ru.hexlet.io/lessons.rss')
  await page.locator('button[type="submit"]').click()
  await expect(page.locator('text=RSS успешно загружен')).toBeVisible({ timeout: 20000 })
  await page.screenshot({ path: 'yandex-test.png' })
})
