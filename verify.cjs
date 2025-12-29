
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    await page.goto('http://localhost:5174/');

    // Wait for the correct dashboard title
    await page.waitForSelector('h1:has-text("Dashboard")');

    await page.screenshot({ path: 'L3_dashboard_verification.png' });
    console.log('Screenshot captured successfully.');

  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  } finally {
    await browser.close();
  }
})();
