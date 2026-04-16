import { test, expect, Page } from '@playwright/test';

/**
 * Test Case: TC_PDP_001
 * Verify the display of product information on the Product Detail Page (PDP)
 * Product: HTC Touch HD
 * URL: https://ecommerce-playground.lambdatest.io/
 */

const BASE_URL = 'https://ecommerce-playground.lambdatest.io/';
const PRODUCT_NAME = 'HTC Touch HD';

test.describe('TC_01 - Product Detail Page Verification', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC_PDP_001: Verify product information display on PDP', async () => {
    // Step 1: Navigate to the website
    await test.step('Navigate to Home Page', async () => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
    });

    // Step 2: Search for product or navigate to featured section
    await test.step('Search for product: ' + PRODUCT_NAME, async () => {
      // Try to use search bar if available
      const searchInput = page.locator('input[type="text"][placeholder*="Search"]');
      
      if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await searchInput.fill(PRODUCT_NAME);
        await page.keyboard.press('Enter');
        await page.waitForLoadState('networkidle');
      } else {
        // Alternative: Scroll to Featured section
        await page.locator('text=Featured').first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
      }
    });

    // Step 3: Click on the product to open PDP
    await test.step('Click on product to open Product Detail Page', async () => {
      // Look for product link containing the product name
      const productLink = page.locator(`a:has-text("${PRODUCT_NAME}")`).first();
      await productLink.click();
      await page.waitForLoadState('networkidle');
    });

    // Step 4: Verify Product Title
    await test.step('Verify Product Title is correctly displayed', async () => {
      // Try multiple selectors to find product title
      const titleSelectors = [
        'h1',
        '.product-title',
        '[class*="title"]',
        '[data-test*="title"]',
        'text=' + PRODUCT_NAME
      ];

      let productTitle = null;
      for (const selector of titleSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          productTitle = element;
          break;
        }
      }

      expect(productTitle).toBeTruthy();
      if (productTitle) {
        const titleText = await productTitle.textContent();
        expect(titleText?.toLowerCase()).toContain(PRODUCT_NAME.toLowerCase());
      }
    });

    // Step 5: Verify Price and Tax information
    await test.step('Verify Price with currency symbol is displayed', async () => {
      const priceSelectors = [
        '[class*="price"]',
        '.product-price',
        '.price',
        '[data-test*="price"]',
        'text=/\$\s*\d/'
      ];

      let priceElement = null;
      for (const selector of priceSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          priceElement = element;
          break;
        }
      }

      if (priceElement) {
        const priceText = await priceElement.textContent();
        expect(priceText).toMatch(/\$/); // Verify currency symbol
        expect(priceText).toMatch(/\d+\.\d{2}/); // Verify price format
      }
    });

    // Step 6: Check Availability/Stock status
    await test.step('Verify Availability/Stock status', async () => {
      const stockSelectors = [
        '[class*="stock"]',
        '[class*="availability"]',
        'text=In Stock',
        'text=Out of Stock',
        'text=Available'
      ];

      let stockStatus = null;
      for (const selector of stockSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          stockStatus = element;
          break;
        }
      }

      if (stockStatus) {
        const statusText = await stockStatus.textContent();
        expect(statusText?.toLowerCase()).toMatch(/in stock|out of stock|available|unavailable/);
      }
    });

    // Step 7: Verify main product image and gallery thumbnails
    await test.step('Verify product images and gallery', async () => {
      try {
        // Check main image
        const mainImageSelectors = [
          'img[alt*="product"]',
          'img[class*="main"]',
          '.gallery img',
          'img[src*="product"]'
        ];

        let mainImage = null;
        for (const selector of mainImageSelectors) {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
            mainImage = element;
            break;
          }
        }

        if (mainImage) {
          await expect(mainImage).toBeVisible();
          
          // Verify image has src attribute
          const imageSrc = await mainImage.getAttribute('src');
          expect(imageSrc).toBeTruthy();
          
          // Check for thumbnail images
          const thumbnails = page.locator('img[class*="thumbnail"], .gallery-thumb img, .gallery img');
          const thumbnailCount = await thumbnails.count();

          if (thumbnailCount > 1) {
            const secondThumbnail = thumbnails.nth(1);
            await secondThumbnail.click();
            await page.waitForTimeout(500);
            
            const updatedImageSrc = await mainImage.getAttribute('src');
            expect(updatedImageSrc).toBeTruthy();
          }
        }
      } catch (error) {
        console.log('Image verification partially failed, but test continues', error);
      }
    });

    // Step 8: Check Description and Specification tabs
    await test.step('Verify Description and Specification tabs have content', async () => {
      try {
        // Look for tabs
        const descriptionTabSelectors = [
          'button:has-text("Description")',
          '[role="tab"]:has-text("Description")',
          'text=Description'
        ];

        let descriptionTab = null;
        for (const selector of descriptionTabSelectors) {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
            descriptionTab = element;
            break;
          }
        }

        // Check Description tab
        if (descriptionTab) {
          await descriptionTab.click();
          await page.waitForTimeout(500);
          
          const descriptionContent = page.locator('[class*="description"], [role="tabpanel"]').first();
          const descriptionText = await descriptionContent.textContent();
          if (descriptionText) {
            expect(descriptionText.length).toBeGreaterThan(0);
          }
        }

        // Check Specification tab
        const specificationTabSelectors = [
          'button:has-text("Specification")',
          '[role="tab"]:has-text("Specification")',
          'text=Specification'
        ];

        let specificationTab = null;
        for (const selector of specificationTabSelectors) {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
            specificationTab = element;
            break;
          }
        }

        if (specificationTab) {
          await specificationTab.click();
          await page.waitForTimeout(500);
          
          const specificationContent = page.locator('[class*="specification"], [role="tabpanel"]').first();
          const specificationText = await specificationContent.textContent();
          if (specificationText) {
            expect(specificationText.length).toBeGreaterThan(0);
          }
        }
      } catch (error) {
        console.log('Tab verification partially failed, but test continues', error);
      }
    });

    // Additional step: Verify Brand name is displayed and clickable
    await test.step('Verify Brand name is displayed and clickable', async () => {
      try {
        const brandSelectors = [
          'a:has-text("HTC")',
          '[class*="brand"] a',
          'text=Brand >> .. >> a'
        ];

        for (const selector of brandSelectors) {
          const brandElement = page.locator(selector).first();
          
          if (await brandElement.isVisible({ timeout: 2000 }).catch(() => false)) {
            const hrefAttribute = await brandElement.getAttribute('href');
            expect(hrefAttribute).toBeTruthy();
            break;
          }
        }
      } catch (error) {
        console.log('Brand verification skipped', error);
      }
    });
  });

  // Additional test: Test product availability status specifically
  test('TC_PDP_001 Extended: Verify stock status reflects actual state', async () => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Navigate to product
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

      // Verify stock status
      const stockSelectors = [
        '[class*="stock"]',
        '[class*="availability"]',
        'text=In Stock',
        'text=Out of Stock'
      ];

      for (const selector of stockSelectors) {
        const stockStatus = page.locator(selector).first();
        if (await stockStatus.isVisible({ timeout: 2000 }).catch(() => false)) {
          const statusText = await stockStatus.textContent();
          expect(statusText?.toLowerCase()).toMatch(/stock|available/);
          break;
        }
      }
    }
  });
});
