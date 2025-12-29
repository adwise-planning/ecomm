
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5174/team');

    // Wait for the team page to load
    await page.waitForSelector('h1:has-text("Team Management")');

    await page.screenshot({ path: 'L3_team_verification.png' });
    console.log('Screenshot of L3 team page captured successfully.');

  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  } finally {
    await browser.close();
  }
})();
