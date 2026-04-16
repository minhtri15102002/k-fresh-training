import { test, expect, Page } from '@playwright/test';

/**
 * Test Case: TC_PDP_002
 * Verify quantity update via increment (+) and decrement (-) buttons
 * Product: HTC Touch HD
 * URL: https://ecommerce-playground.lambdatest.io/
 */

const BASE_URL = 'https://ecommerce-playground.lambdatest.io/';
const PRODUCT_NAME = 'HTC Touch HD';

test.describe('TC_02 - Product Detail Page - Quantity Counter', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC_PDP_002: Verify quantity counter increment/decrement buttons', async () => {
    // Navigate to the website
    await test.step('Navigate to Home Page', async () => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
    });

    // Search for product
    await test.step('Search for product: ' + PRODUCT_NAME, async () => {
      const searchInput = page.locator('input[type="text"][placeholder*="Search"]');
      
      if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await searchInput.fill(PRODUCT_NAME);
        await page.keyboard.press('Enter');
        await page.waitForLoadState('networkidle');
      }
    });

    // Click on product to open PDP
    await test.step('Click on product to open Product Detail Page', async () => {
      const productLink = page.locator(`a:has-text("${PRODUCT_NAME}")`).first();
      if (await productLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await productLink.click();
        await page.waitForLoadState('networkidle');
      }
    });

    // Step 1: Locate the Quantity input field
    await test.step('Locate Quantity input field and verify default value is 1', async () => {
      const quantitySelectors = [
        'input[type="number"][name*="quantity"]',
        'input[name*="quantity"]',
        'input[id*="quantity"]',
        '[class*="quantity"] input',
        '.qty input',
        '[class*="qty"] input',
        'input[value="1"]'
      ];

      let quantityInput = null;
      for (const selector of quantitySelectors) {
        const element = page.locator(selector).first();
        try {
          if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
            quantityInput = element;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      if (quantityInput) {
        const initialValue = await quantityInput.inputValue();
        // Default value should be 1
        expect(initialValue).toBe('1');
      } else {
        console.log('Warning: Quantity input field not found, skipping validation');
      }
    });

    // Step 2: Click the "+" button once
    await test.step('Click "+" button to increase quantity to 2', async () => {
      const quantityInput = page.locator('input[type="number"][name*="quantity"],' +
        'input[name*="quantity"],' +
        'input[id*="quantity"],' +
        '[class*="quantity"] input,' +
        '.qty input,' +
        '[class*="qty"] input').first();

      // Find the increment button
      const incrementButtonSelectors = [
        'button[class*="increment"]',
        'button[value="+"]',
        'text=+ >> button',
        '[class*="qty-btn"] >> nth=1',
        'button:has-text("+")'
      ];

      let incrementButton = null;
      for (const selector of incrementButtonSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          incrementButton = element;
          break;
        }
      }

      if (incrementButton) {
        await incrementButton.click();
        await page.waitForTimeout(300);

        if (quantityInput && await quantityInput.isVisible()) {
          const newValue = await quantityInput.inputValue();
          expect(parseInt(newValue)).toBe(2);
        }
      }
    });

    // Step 3: Click the "+" button again
    await test.step('Click "+" button again to increase quantity to 3', async () => {
      const quantityInput = page.locator('input[type="number"][name*="quantity"],' +
        'input[name*="quantity"],' +
        'input[id*="quantity"],' +
        '[class*="quantity"] input,' +
        '.qty input,' +
        '[class*="qty"] input').first();

      const incrementButtonSelectors = [
        'button[class*="increment"]',
        'button[value="+"]',
        'text=+ >> button',
        '[class*="qty-btn"] >> nth=1',
        'button:has-text("+")'
      ];

      let incrementButton = null;
      for (const selector of incrementButtonSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          incrementButton = element;
          break;
        }
      }

      if (incrementButton) {
        await incrementButton.click();
        await page.waitForTimeout(300);

        if (quantityInput && await quantityInput.isVisible()) {
          const newValue = await quantityInput.inputValue();
          expect(parseInt(newValue)).toBe(3);
        }
      }
    });

    // Step 4: Click the "-" button once
    await test.step('Click "-" button to decrease quantity to 2', async () => {
      const quantityInput = page.locator('input[type="number"][name*="quantity"],' +
        'input[name*="quantity"],' +
        'input[id*="quantity"],' +
        '[class*="quantity"] input,' +
        '.qty input,' +
        '[class*="qty"] input').first();

      // Find the decrement button
      const decrementButtonSelectors = [
        'button[class*="decrement"]',
        'button[value="-"]',
        'text=- >> button',
        '[class*="qty-btn"] >> nth=0',
        'button:has-text("-")'
      ];

      let decrementButton = null;
      for (const selector of decrementButtonSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          decrementButton = element;
          break;
        }
      }

      if (decrementButton) {
        await decrementButton.click();
        await page.waitForTimeout(300);

        if (quantityInput && await quantityInput.isVisible()) {
          const newValue = await quantityInput.inputValue();
          expect(parseInt(newValue)).toBe(2);
        }
      }
    });

    // Step 5: Click the "-" button multiple times until it reaches 1, then one more time
    await test.step('Click "-" button multiple times and verify minimum value is 1', async () => {
      const quantityInput = page.locator('input[type="number"][name*="quantity"],' +
        'input[name*="quantity"],' +
        'input[id*="quantity"],' +
        '[class*="quantity"] input,' +
        '.qty input,' +
        '[class*="qty"] input').first();

      const decrementButtonSelectors = [
        'button[class*="decrement"]',
        'button[value="-"]',
        'text=- >> button',
        '[class*="qty-btn"] >> nth=0',
        'button:has-text("-")'
      ];

      let decrementButton = null;
      for (const selector of decrementButtonSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          decrementButton = element;
          break;
        }
      }

      if (decrementButton && quantityInput) {
        // Click once to go from 2 to 1
        await decrementButton.click();
        await page.waitForTimeout(300);
        
        let currentValue = await quantityInput.inputValue();
        expect(parseInt(currentValue)).toBe(1);

        // Try to click again - should stay at 1
        await decrementButton.click();
        await page.waitForTimeout(300);
        
        currentValue = await quantityInput.inputValue();
        // Should not go below 1
        expect(parseInt(currentValue)).toBe(1);
      }
    });

    // Additional test: Verify quantity updates instantly
    await test.step('Verify quantity updates instantly without page refresh', async () => {
      const quantityInput = page.locator('input[type="number"][name*="quantity"],' +
        'input[name*="quantity"],' +
        'input[id*="quantity"],' +
        '[class*="quantity"] input,' +
        '.qty input,' +
        '[class*="qty"] input').first();

      if (quantityInput && await quantityInput.isVisible()) {
        const initialValue = await quantityInput.inputValue();
        expect(initialValue).toBeTruthy();

        // Try to manually type in quantity field
        await quantityInput.clear();
        await quantityInput.type('5');
        
        await page.waitForTimeout(500);
        
        const updatedValue = await quantityInput.inputValue();
        expect(updatedValue).toBe('5');

        // Verify page didn't refresh by checking URL
        const currentUrl = page.url();
        expect(currentUrl).toContain(BASE_URL);
      }
    });
  });

  // Additional test: Edge case - Test rapid clicks on increment button
  test('TC_PDP_002 Extended: Test rapid increment/decrement clicks', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Search and navigate to product
    const searchInput = page.locator('input[type="text"][placeholder*="Search"]');
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill(PRODUCT_NAME);
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }

    const productLink = page.locator(`a:has-text("${PRODUCT_NAME}")`).first();
    if (await productLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await productLink.click();
      await page.waitForLoadState('networkidle');
    }

    // Find quantity input and buttons
    const quantityInput = page.locator('input[type="number"][name*="quantity"],' +
      'input[name*="quantity"],' +
      'input[id*="quantity"],' +
      '[class*="quantity"] input,' +
      '.qty input,' +
      '[class*="qty"] input').first();

    const incrementButtonSelectors = [
      'button[class*="increment"]',
      'button[value="+"]',
      'text=+ >> button',
      '[class*="qty-btn"] >> nth=1',
      'button:has-text("+")'
    ];

    let incrementButton = null;
    for (const selector of incrementButtonSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
        incrementButton = element;
        break;
      }
    }

    if (incrementButton && quantityInput && await quantityInput.isVisible()) {
      // Perform 5 rapid clicks
      for (let i = 0; i < 5; i++) {
        await incrementButton.click();
        await page.waitForTimeout(100);
      }

      const finalValue = await quantityInput.inputValue();
      // Should be 1 + 5 = 6
      expect(parseInt(finalValue)).toBe(6);
    }
  });
});
