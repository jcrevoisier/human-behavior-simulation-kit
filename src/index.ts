// Export all utilities
export * from './utils/mouseMovement';
export * from './utils/typing';
export * from './utils/scrolling';
export * from './utils/common';
export * from './utils/botDetectionBypass';

// Export a convenience function to create a human-like browser
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { getStealthLaunchOptions, setupBrowserEvasions } from './utils/botDetectionBypass';

/**
 * Creates a browser instance with human-like behavior configurations
 */
export async function createHumanBrowser(): Promise<Browser> {
  return await chromium.launch(getStealthLaunchOptions());
}

/**
 * Creates a browser context with human-like behavior configurations
 */
export async function createHumanContext(browser: Browser): Promise<BrowserContext> {
  const context = await browser.newContext({
    viewport: {
      width: 1280 + Math.floor(Math.random() * 100),
      height: 720 + Math.floor(Math.random() * 100)
    },
    userAgent: getStealthLaunchOptions().args.find(arg => arg.startsWith('--user-agent='))?.substring(12) || '',
    geolocation: { longitude: -122.084, latitude: 37.422 }, // Example location
    permissions: ['geolocation'],
    colorScheme: 'light',
    deviceScaleFactor: 1 + Math.random() * 0.5
  });
  
  // Set cookies, localStorage, etc. if needed
  
  return context;
}

/**
 * Creates a page with human-like behavior configurations
 */
export async function createHumanPage(context: BrowserContext): Promise<Page> {
  const page = await context.newPage();
  await setupBrowserEvasions(page);
  return page;
}
