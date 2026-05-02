import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://velo-git-main-lucascarvalhocorreias-projects.vercel.app/order', { waitUntil: 'networkidle' });
  
  const content = await page.content();
  console.log('CONTAINS "Velô Sprint":', content.includes('Velô Sprint'));
  
  // also take a screenshot
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
