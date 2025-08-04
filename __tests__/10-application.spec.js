import { test, expect } from '@playwright/test'

test('adding', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.locator('input[name="url"]').fill('https://example.com/rss')
  await page.locator('button[type="submit"]').click()
  
  console.log("URL:", await page.url())
  console.log("Content:", await page.content())
  
  await expect(page.locator('text=RSS успешно загружен')).toBeVisible({ timeout: 10000 })
})
