import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {

  
//   await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=common/home');
//   await page.getByLabel('2 / 24', { exact: true }).getByRole('link', { name: 'HTC Touch HD HTC Touch HD HTC' }).click();
//   await page.getByRole('button', { name: 'Popup' }).click();
//   await page.locator('#entry_216870').click();
//   await page.getByText('Popup content Place here any').click();
//   await page.getByRole('heading', { name: 'Popup content' }).click();
//   await page.getByText('Place here any module, widget, design or HTML.', { exact: true }).click();
//   await page.locator('#mz-component-983507417').click();
//   await page.getByRole('button', { name: 'Close' }).click();
// });

const BASE_URL = 'https://ecommerce-playground.lambdatest.io/index.php?route=common/home';
const PRODUCT_NAME = 'HTC Touch HD';

test.describe('TC_04 - Product Detail Page - Check Pop Up', () => {
  test('TC_PDP_004: Verify Pop Up opens when clicked', async ({ page }) => {
    // Navigate to product
    await test.step('Navigate to product detail page', async () => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      const searchInput = page.getByPlaceholder('Search For Products').first();
      await expect(searchInput).toBeVisible({ timeout: 10000 });
      await searchInput.fill(PRODUCT_NAME);
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');

      const productLink = page.getByRole('link', { name: PRODUCT_NAME }).first();
      await expect(productLink).toBeVisible({ timeout: 10000 });
      await productLink.click();
      await page.waitForLoadState('networkidle');
    });

    // Click on Pop Up button
    await test.step('Click on Pop Up button', async () => {
      const popUpButton = page.getByRole('button', { name: 'Popup' }).first();
      await expect(popUpButton).toBeVisible({ timeout: 10000 });
      await popUpButton.click();
    });

    // Verify Pop Up content
    await test.step('Verify Pop Up content', async () => {
      const popUpTitle = page.getByRole('heading', { name: 'Popup content' }).first();
      const popUpBody = page.getByText('Place here any module, widget, design or HTML.', { exact: true }).first();

      await expect(popUpTitle).toBeVisible({ timeout: 5000 });
      await expect(popUpBody).toBeVisible({ timeout: 5000 });
    });

    // Close the Pop Up
    await test.step('Close the Pop Up', async () => {
      const closeButton = page.getByRole('button', { name: 'Close' }).first();
      await expect(closeButton).toBeVisible({ timeout: 5000 });
      await closeButton.click();
    });

    // Verify Pop Up is closed
    await test.step('Verify Pop Up is closed', async () => {
      const popUpTitle = page.getByRole('heading', { name: 'Popup content' }).first();
      await expect(popUpTitle).not.toBeVisible({ timeout: 5000 });
    });
  });
});