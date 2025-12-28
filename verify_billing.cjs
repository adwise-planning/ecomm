
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5174/billing');

    // Wait for the billing page to load
    await page.waitForSelector('h1:has-text("Billing")');

    await page.screenshot({ path: 'L3_billing_verification.png' });
    console.log('Screenshot of L3 billing page captured successfully.');

  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  } finally {
    await browser.close();
  }
})();
