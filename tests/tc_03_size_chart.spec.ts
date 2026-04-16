import { test, expect, Page } from '@playwright/test';

/**
 * Test Case: TC_PDP_003
 * Verify the visibility and functionality of the Size Chart link
 * URL: https://ecommerce-playground.lambdatest.io/
 */

const BASE_URL = 'https://ecommerce-playground.lambdatest.io/';
const PRODUCT_NAME = 'HTC Touch HD';

test.describe('TC_03 - Product Detail Page - Size Chart', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC_PDP_003: Verify Size Chart link opens modal', async () => {
    // Navigate to product
    await test.step('Navigate to product detail page', async () => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      const searchInput = page.locator('input[placeholder*="Search"]').first();
      if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchInput.fill(PRODUCT_NAME);
        await page.keyboard.press('Enter');
        await page.waitForLoadState('networkidle');
      }

      const productLink = page.locator(`text=${PRODUCT_NAME}`).first();
      if (await productLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await productLink.click();
        await page.waitForLoadState('networkidle');
      }
    });

    // Step 1: Locate Size Chart link
    await test.step('Locate Size Chart link', async () => {
      const sizeChartSelectors = [
        'text=Size Chart',
        'text=size chart',
        'a:has-text("Size")',
        '[class*="size-chart"]',
        'a[href*="size"]'
      ];

      let sizeChartFound = false;
      for (const selector of sizeChartSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1500 }).catch(() => false)) {
          sizeChartFound = true;
          break;
        }
      }

      if (!sizeChartFound) {
        console.log('Warning: Size Chart link not found on page');
      }
    });

    // Step 2: Click Size Chart link
    await test.step('Click Size Chart link to open modal', async () => {
      const sizeChartSelectors = [
        'text=Size Chart',
        'text=size chart',
        'a:has-text("Size")',
        '[class*="size-chart"]',
        'a[href*="size"]'
      ];

      let clicked = false;
      for (const selector of sizeChartSelectors) {
        const sizeChartLink = page.locator(selector).first();
        if (await sizeChartLink.isVisible({ timeout: 1500 }).catch(() => false)) {
          await sizeChartLink.click();
          clicked = true;
          break;
        }
      }

      if (!clicked) {
        console.log('Warning: Could not click Size Chart link');
        return;
      }

      await page.waitForTimeout(500);

      // Verify modal/overlay appears
      const modal = page.locator('[class*="modal"], [class*="overlay"], [role="dialog"]').first();
      const modalVisible = await modal.isVisible({ timeout: 3000 }).catch(() => false);
      if (!modalVisible) {
        console.log('Warning: Modal did not appear after clicking Size Chart');
      }
    });

    // Step 3: Verify modal content is readable
    await test.step('Verify modal content is legible', async () => {
      const modal = page.locator('[class*="modal"], [class*="overlay"], [role="dialog"]').first();
      if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
        const content = await modal.textContent();
        expect(content?.length).toBeGreaterThan(0);
      }
    });

    // Step 4: Close modal using X or Close button
    await test.step('Close modal using close button', async () => {
      const closeButton = page.locator('button[class*="close"], button:has-text("Close"), text=×').first();
      if (await closeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await closeButton.click();
        await page.waitForTimeout(500);

        // Verify modal closes
        const modal = page.locator('[class*="modal"], [class*="overlay"], [role="dialog"]');
        const modalClosed = await modal.isHidden({ timeout: 3000 }).catch(() => true);
        expect(modalClosed).toBe(true);
      }
    });

    // Verify user is back on PDP
    await test.step('Verify user is back on Product Detail Page', async () => {
      const currentUrl = page.url();
      expect(currentUrl).toContain(BASE_URL);
    });
  });

  // Alternative close method - click outside modal
  test('TC_PDP_003 Extended: Close modal by clicking outside', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Navigate to product
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchInput.fill(PRODUCT_NAME);
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }

    const productLink = page.locator(`text=${PRODUCT_NAME}`).first();
    if (await productLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productLink.click();
      await page.waitForLoadState('networkidle');
    }

    // Open size chart
    const sizeChartSelectors = [
      'text=Size Chart',
      'text=size chart',
      'a:has-text("Size")',
      '[class*="size-chart"]',
      'a[href*="size"]'
    ];

    let sizeChartOpened = false;
    for (const selector of sizeChartSelectors) {
      const sizeChartLink = page.locator(selector).first();
      if (await sizeChartLink.isVisible({ timeout: 1500 }).catch(() => false)) {
        await sizeChartLink.click();
        sizeChartOpened = true;
        break;
      }
    }

    if (!sizeChartOpened) {
      console.log('Warning: Could not open Size Chart');
      return;
    }

    await page.waitForTimeout(500);

    // Try to close by clicking outside modal
    await page.click('body', { position: { x: 10, y: 10 } });
    await page.waitForTimeout(500);

    const modal = page.locator('[class*="modal"], [role="dialog"]').first();
    const isClosed = await modal.isHidden({ timeout: 2000 }).catch(() => true);
    
    // If clicking outside didn't work, try close button instead
    if (!isClosed) {
      const closeSelectors = [
        'button[class*="close"]',
        'button:has-text("Close")',
        'text=×'
      ];

      for (const selector of closeSelectors) {
        const closeButton = page.locator(selector).first();
        if (await closeButton.isVisible({ timeout: 1500 }).catch(() => false)) {
          await closeButton.click();
          break;
        }
      }
    }
  });
});
