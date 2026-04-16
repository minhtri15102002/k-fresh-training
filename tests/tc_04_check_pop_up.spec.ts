import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=common/home');
  await page.getByLabel('2 / 24', { exact: true }).getByRole('link', { name: 'HTC Touch HD HTC Touch HD HTC' }).click();
  await page.getByRole('button', { name: 'Popup' }).click();
  await page.locator('#entry_216870').click();
  await page.getByText('Popup content Place here any').click();
  await page.getByRole('heading', { name: 'Popup content' }).click();
  await page.getByText('Place here any module, widget, design or HTML.', { exact: true }).click();
  await page.locator('#mz-component-983507417').click();
  await page.getByRole('button', { name: 'Close' }).click();
});