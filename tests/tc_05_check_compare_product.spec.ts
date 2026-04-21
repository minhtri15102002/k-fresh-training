import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=common/home');
//   await page.getByLabel('2 / 24', { exact: true }).getByRole('link', { name: 'HTC Touch HD HTC Touch HD HTC' }).click();
//   await page.getByRole('button', { name: ' Compare this Product' }).click();
//   await page.getByText('Success: You have added HTC Touch HD to your product comparison! Product').click();
//   await page.getByText('Success: You have added HTC').click();
//   await page.locator('#container').click();
//   await page.getByRole('heading', { name: 'Product Comparison' }).click();
//   await page.getByText('Product Details').click();
//   await page.getByRole('cell', { name: 'Product', exact: true }).click();
//   await page.locator('td').filter({ hasText: 'HTC Touch HD' }).click();
//   await page.getByText('Product Comparison Product Comparison Product Details Product HTC Touch HD').click();
// });


const BASE_URL = 'https://ecommerce-playground.lambdatest.io/index.php?route=common/home';
const PRODUCT_NAME = 'HTC Touch HD';

test.describe('TC_05 - Product Comparison - Check Compare Product', () => {
  test('TC_PC_05: Verify product can be added to comparison and compared successfully', async ({ page }) => {
    const compareControl = page.getByTitle('Compare this Product').first();

    // Navigate to product
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

    // Click on Compare this Product button
    await test.step('Click on Compare this Product button', async () => {
      const compareButton = page.getByRole('button', { name: ' Compare this Product' }).first();
      await expect(compareButton).toBeVisible({ timeout: 10000 });
      await compareButton.click();
    });

    // Verify success message
    await test.step('Verify success message after adding product to comparison', async () => {
      const successMessage = page.getByText(
        `Success: You have added ${PRODUCT_NAME} to your product comparison!`,
      ).first();
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    });


    // Navigate to Product Comparison page
    await test.step('Navigate to Product Comparison page', async () => {
      const comparisonLinkInAlert = page.getByRole('link', { name: /product comparison/i }).first();
      await expect(comparisonLinkInAlert).toBeVisible({ timeout: 10000 });
      await comparisonLinkInAlert.click();

      const comparisonLink = page.getByRole('heading', { name: 'Product Comparison' }).first();
      await expect(comparisonLink).toBeVisible({ timeout: 10000 });
      await page.waitForLoadState('networkidle');
    });

    // Verify product is listed in comparison
    await test.step('Verify product is listed in comparison table', async () => {
      const productCell = page.locator('td').filter({ hasText: PRODUCT_NAME }).first();
      await expect(productCell).toBeVisible({ timeout: 5000 });
    });

    // Verify product details are displayed    
    await test.step('Verify product details are displayed in comparison', async () => {
      const productDetails = page.locator('td a, td').filter({ hasText: PRODUCT_NAME }).first();
      await expect(productDetails).toBeVisible({ timeout: 5000 });

      const productDetailsText = (await productDetails.innerText()).trim().replace(/\s+/g, ' ');
      console.log('Product Details Text:', productDetailsText);
      expect(productDetailsText).toBe(PRODUCT_NAME);
    });
  });

});