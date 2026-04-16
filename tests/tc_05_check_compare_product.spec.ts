import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=common/home');
  await page.getByLabel('2 / 24', { exact: true }).getByRole('link', { name: 'HTC Touch HD HTC Touch HD HTC' }).click();
  await page.getByRole('button', { name: ' Compare this Product' }).click();
  await page.getByText('Success: You have added HTC Touch HD to your product comparison! Product').click();
  await page.getByText('Success: You have added HTC').click();
  await page.locator('#container').click();
  await page.getByRole('heading', { name: 'Product Comparison' }).click();
  await page.getByText('Product Details').click();
  await page.getByRole('cell', { name: 'Product', exact: true }).click();
  await page.locator('td').filter({ hasText: 'HTC Touch HD' }).click();
  await page.getByText('Product Comparison Product Comparison Product Details Product HTC Touch HD').click();
});