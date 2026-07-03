import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

const har = JSON.parse(readFileSync('./tests/hars/full.har', 'utf-8'));
const loginEntry = har.log.entries.find(
  (entry: any) =>
    entry.request.url.includes('/api/auth/login') &&
    entry.request.method === 'POST'
);
const { email, password } = JSON.parse(loginEntry.request.postData.text);

test.describe('добавление ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/full.har', {
      url: '**/api/**',
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
    await page.routeFromHAR('./tests/hars/full.har', {
      url: '**/api/**',
      update: false
    });
    await page.goto('/');
    await expect(page.getByTestId('ingredients-section')).toBeVisible();
  });

  test('должен открывать модальное окно ингредиента', async ({ page }) => {
    const ingredientName = await page
      .getByTestId('ingredient-link')
      .first()
      .locator('p')
      .last()
      .textContent();
    await page.getByTestId('ingredient-link').first().click();
    await expect(page.getByTestId('modal')).toBeVisible();
    if (ingredientName) {
      await expect(page.getByTestId('modal')).toContainText(ingredientName);
    }
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
    await page.routeFromHAR('./tests/hars/full.har', {
      url: '**/api/**',
      update: false
    });

    await page.goto('http://localhost:4000/login');
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', password);
    await page.getByRole('button', { name: 'Войти' }).click();
    await page.waitForURL('http://localhost:4000/');
    await expect(page.getByTestId('ingredients-section')).toBeVisible();
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
    await expect(page.getByText(/1076\d+/)).toBeVisible();
    await expect(page.getByTestId('no-buns').first()).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
