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

  await page.goto('https://velo-git-main-lucascarvalhocorreias-projects.vercel.app/order', { waitUntil: 'networkidle' });
  console.log('PAGE TITLE:', await page.title());
  const submitBtn = await page.getByTestId('checkout-submit').count();
  console.log('SUBMIT BTN COUNT:', submitBtn);
  await browser.close();
})();
