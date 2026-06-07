import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    
    await page.waitForTimeout(2000);
    
    const loadingVisible = await page.isVisible('text=/Verfügbare Termine werden geladen/');
    console.log(`Loading message visible: ${loadingVisible}`);
    
    const courseOptions = await page.locator('text=/Einzelne Übungsstunde/').count();
    console.log(`Course options found: ${courseOptions}`);
    
    const bookingButton = await page.locator('button, [role="button"]').count();
    console.log(`Interactive elements found: ${bookingButton}`);
    
    const formElements = await page.locator('input, select, textarea').count();
    console.log(`Form fields found: ${formElements}`);
    
    await page.screenshot({ path: '/tmp/booking-form.png' });
    console.log('Screenshot saved');
    
    console.log('\n=== Console Messages ===');
    if (consoleLogs.length === 0) {
      console.log('(No console messages)');
    } else {
      consoleLogs.forEach(log => console.log(log));
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
