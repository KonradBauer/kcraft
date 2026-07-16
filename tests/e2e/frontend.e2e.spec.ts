import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/KCRAFT/)
  })

  test('homepage renders hero heading', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Profesjonalne Spawanie i Ślusarstwo')
  })

  test('subpage doposazenie-linii-produkcyjnej loads', async ({ page }) => {
    await page.goto('http://localhost:3000/doposazenie-linii-produkcyjnej')
    await expect(page).toHaveTitle(/Doposażenie linii produkcyjnej/)
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Doposażenie linii produkcyjnej')
  })

  test('subpage maszyny-rolnicze loads', async ({ page }) => {
    await page.goto('http://localhost:3000/maszyny-rolnicze')
    await expect(page).toHaveTitle(/Maszyny rolnicze/)
  })

  test('subpage uslugi-slusarsko-spawalnicze loads', async ({ page }) => {
    await page.goto('http://localhost:3000/uslugi-slusarsko-spawalnicze')
    await expect(page).toHaveTitle(/Usługi ślusarsko-spawalnicze/)
  })
})
