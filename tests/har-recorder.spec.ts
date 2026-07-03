// tests/har-recorder.spec.ts — запускать ОДИН раз для записи
import { test, expect } from '@playwright/test';

test.describe('запись HAR-файлов', () => {
  test('запись HAR для ингредиентов', async ({ browser }) => {
    const context = await browser.newContext({
      recordHar: {
        path: './tests/hars/ingredients.har',
        mode: 'full',
        urlFilter: '**/api/ingredients'
      }
    });
    const page = await context.newPage();
    await page.goto('http://localhost:4000/');
    await expect(page.getByTestId('ingredients-section')).toBeVisible();
    await context.close();
  });

  test('запись HAR для авторизации', async ({ browser }) => {
    const context = await browser.newContext({
      recordHar: {
        path: './tests/hars/auth.har',
        mode: 'full',
        urlFilter: '**/api/auth/**'
      }
    });
    const page = await context.newPage();
    await page.goto('http://localhost:4000/login');
    await page.fill('[name="email"]', 'lera210803@yandex.ru');
    await page.fill('[name="password"]', 'rR2-SeG-gmz-kKr');
    await page.getByRole('button', { name: 'Войти' }).click();
    await page.waitForURL('http://localhost:4000/');
    await context.close();
  });

  test('запись HAR для создания заказа', async ({ browser }) => {
    const context = await browser.newContext({
      recordHar: {
        path: './tests/hars/order.har',
        mode: 'full',
        urlFilter: '**/api/orders'
      }
    });
    const page = await context.newPage();

    // Логинимся
    await page.goto('http://localhost:4000/login');
    await page.fill('[name="email"]', 'lera210803@yandex.ru');
    await page.fill('[name="password"]', 'rR2-SeG-gmz-kKr');
    await page.getByRole('button', { name: 'Войти' }).click();
    await page.waitForURL('http://localhost:4000/');
    await expect(page.getByTestId('ingredients-section')).toBeVisible();

    // Собираем бургер
    await page
      .locator('button')
      .filter({ hasText: 'Добавить' })
      .first()
      .click();

    // Заказываем
    await page.getByTestId('order-button').click();
    await page.waitForResponse('**/api/orders');

    await context.close();
  });
});
