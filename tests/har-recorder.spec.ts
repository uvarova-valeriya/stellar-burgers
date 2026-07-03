import { test, expect } from '@playwright/test';

test.describe('запись HAR-файлов', () => {
  test('запись полного HAR', async ({ browser }) => {
    const context = await browser.newContext({
      recordHar: {
        path: './tests/hars/full.har',
        mode: 'full'
      }
    });
    const page = await context.newPage();

    await page.goto('http://localhost:4000/login');
    await page.fill('[name="email"]', 'lera210803@yandex.ru');
    await page.fill('[name="password"]', 'rR2-SeG-gmz-kKr');
    await page.getByRole('button', { name: 'Войти' }).click();
    await page.waitForURL('http://localhost:4000/');
    await expect(page.getByTestId('ingredients-section')).toBeVisible();

    await page
      .locator('button')
      .filter({ hasText: 'Добавить' })
      .first()
      .click();

    const orderResponse = page.waitForResponse('**/api/orders');
    await page.getByTestId('order-button').click();
    await orderResponse;
    await expect(page.getByTestId('modal')).toBeVisible();

    await context.close();
  });
});
