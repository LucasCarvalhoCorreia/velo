import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`HTTP ERROR: ${response.status()} ${response.url()}`);
    }
  });

  await page.goto('https://velo-2a5xdwiwa-lucascarvalhocorreias-projects.vercel.app/order', { waitUntil: 'networkidle' });
  await browser.close();
})();
