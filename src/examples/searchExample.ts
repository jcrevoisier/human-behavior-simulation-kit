import { chromium } from 'playwright';
import { 
  humanType, 
  humanClick, 
  humanScroll, 
  humanScrollToElement,
  setupBrowserEvasions,
  getStealthLaunchOptions,
  sleep
} from '../index';

async function searchExample() {
  // Launch the browser with stealth options
  const browser = await chromium.launch(getStealthLaunchOptions());
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Setup evasions
  await setupBrowserEvasions(page);
  
  try {
    // Navigate to a search engine
    await page.goto('https://www.google.com');
    
    // Accept cookies if present (common in EU)
    try {
      await humanClick(page, 'button:has-text("Accept all")');
    } catch (e) {
      // Ignore if not present
    }
    
    // Type a search query with human-like behavior
    await humanType(page, 'input[name="q"]', 'best restaurants in new york', {
      delay: { min: 80, max: 200 },
      mistakeProbability: 0.05
    });
    
    // Submit the search
    await page.keyboard.press('Enter');
    await page.waitForNavigation();
    
    // Scroll down to view results
    await humanScroll(page, { distance: 500, speed: 'medium' });
    
    // Wait as if reading
    await sleep(2000);
    
    // Find and click on a result
    await humanScrollToElement(page, '.g a', { offset: 150 });
    await humanClick(page, '.g a');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Scroll around the new page
    await humanScroll(page, { distance: 300 });
    await sleep(1000);
    await humanScroll(page, { distance: 500 });
    
    // Take a screenshot
    await page.screenshot({ path: 'search-result.png' });
    
    console.log('Search example completed successfully!');
  } catch (error) {
    console.error('Error during search example:', error);
  } finally {
    await browser.close();
  }
}

// Run the example
searchExample().catch(console.error);
