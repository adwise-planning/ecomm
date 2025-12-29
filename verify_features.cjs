const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const verificationDir = '/home/jules/verification';

  if (!fs.existsSync(verificationDir)) {
    fs.mkdirSync(verificationDir, { recursive: true });
  }

  try {
    // 1. Verify Orders Page
    await page.goto('http://localhost:5174/orders');
    await page.waitForSelector('h1:has-text("Order Management")');
    await page.screenshot({ path: `${verificationDir}/orders_page.png` });
    console.log('Orders page screenshot captured.');

    // 2. Verify AI Recommendations Page
    await page.goto('http://localhost:5174/recommendations');
    await page.waitForSelector('h1:has-text("AI Recommendations")');
    await page.screenshot({ path: `${verificationDir}/recommendations_page.png` });
    console.log('Recommendations page screenshot captured.');

    // 3. Verify Team Management Page
    await page.goto('http://localhost:5174/team');
    await page.waitForSelector('h1:has-text("Team Management")');
    await page.screenshot({ path: `${verificationDir}/team_page.png` });
    console.log('Team page screenshot captured.');

    // 4. Verify Dashboard Page
    await page.goto('http://localhost:5174/');
    await page.waitForSelector('h1:has-text("Dashboard")');
    await page.screenshot({ path: `${verificationDir}/dashboard_page.png` });
    console.log('Dashboard page screenshot captured.');

  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    await page.screenshot({ path: `${verificationDir}/error.png` });
  } finally {
    await browser.close();
  }
})();
