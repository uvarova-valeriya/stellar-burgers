// tests/constructor.spec.ts
import { test, expect } from '@playwright/test';

test.describe('добавление ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    await expect(page.getByTestId('ingredients-section')).toBeVisible();
  });

  test('должен добавлять булку в конструктор', async ({ page }) => {
    const addButton = page
      .getByTestId('ingredients-section')
      .locator('button')
      .filter({ hasText: 'Добавить' })
      .first();
    await addButton.click();

    await expect(page.getByTestId('bun-top')).toBeVisible();
    await expect(page.getByTestId('bun-bottom')).toBeVisible();
  });

  test('должен добавлять начинку в конструктор', async ({ page }) => {
    await page.locator('text=Начинки').first().click();

    const fillingSection = page
      .getByRole('heading', { name: 'Начинки' })
      .locator('..');

    const addButton = fillingSection
      .getByRole('button', { name: 'Добавить' })
      .last();

    await addButton.click();
    await expect(page.getByTestId('no-ingredients')).not.toBeVisible();
  });

  test('должен добавлять соус в конструктор', async ({ page }) => {
    await page.locator('text=Соусы').first().click();

    const sauceSection = page
      .getByRole('heading', { name: 'Соусы' })
      .locator('..');

    const addButton = sauceSection
      .getByRole('button', { name: 'Добавить' })
      .last();

    await addButton.click();
    await expect(page.getByTestId('no-ingredients')).not.toBeVisible();
  });

  test('должен добавлять булку и начинку вместе', async ({ page }) => {
    const bunButton = page.getByRole('button', { name: 'Добавить' }).first();
    await bunButton.click();

    await page.locator('text=Начинки').first().click();
    const fillingSection = page
      .getByRole('heading', { name: 'Начинки' })
      .locator('..');
    const mainButton = fillingSection
      .getByRole('button', { name: 'Добавить' })
      .last();

    await mainButton.click();
    await expect(page.getByTestId('bun-top')).toBeVisible();
    await expect(page.getByTestId('bun-bottom')).toBeVisible();
    await expect(page.getByTestId('no-ingredients')).not.toBeVisible();
  });
});

test.describe('модальные окна', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.goto('/');
    await expect(page.getByTestId('ingredients-section')).toBeVisible();
  });

  test('должен открывать модальное окно ингредиента', async ({ page }) => {
    await page.getByTestId('ingredient-link').first().click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).not.toBeEmpty();
  });

  test('должен закрывать модальное окно по крестику', async ({ page }) => {
    await page.getByTestId('ingredient-link').first().click();
    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});

test.describe('создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.route('**/api/orders', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Краторный бургер',
          order: { number: 107566 }
        })
      });
    });
    await page.route('**/api/auth/user', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { name: 'Test', email: 'test@test.ru' }
        })
      });
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-token');
      document.cookie = 'accessToken=mock-token; path=/';
    });

    await page.goto('/');
    await expect(page.getByTestId('ingredients-section')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('должен создать заказ', async ({ page }) => {
    await page
      .locator('button')
      .filter({ hasText: 'Добавить' })
      .first()
      .click();
    await expect(page.getByTestId('bun-top')).toBeVisible();

    await page.getByTestId('order-button').click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('107566')).toBeVisible();
    await expect(page.getByTestId('no-buns').first()).toBeVisible();

    await page.getByTestId('modal-close').click();
  });
});
