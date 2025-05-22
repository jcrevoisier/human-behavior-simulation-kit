import { Page, Browser } from 'playwright';
import { sleep, randomInt } from './common';

// Define types for plugin data
interface PluginData {
  name: string;
  description: string;
  filename: string;
  length: number;
}

// Define type for the plugins object
interface PluginsObject {
  length: number;
  item(index: number): PluginData | null;
  namedItem(name: string): PluginData | null;
  refresh(): void;
  [index: number]: PluginData;
}

/**
 * Configures the browser to avoid common bot detection techniques
 */
export async function setupBrowserEvasions(page: Page): Promise<void> {
  // Modify navigator properties to appear more human-like
  await page.addInitScript(() => {
    // Override properties that automation detection scripts check
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    
    // Add a fake user-agent plugins array
    Object.defineProperty(navigator, 'plugins', {
      get: () => {
        const pluginData: PluginData[] = [
          {
            name: 'Chrome PDF Plugin',
            description: 'Portable Document Format',
            filename: 'internal-pdf-viewer',
            length: 1
          },
          {
            name: 'Chrome PDF Viewer',
            description: '',
            filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
            length: 1
          },
          {
            name: 'Native Client',
            description: '',
            filename: 'internal-nacl-plugin',
            length: 2
          }
        ];
        
        // Create a proper PluginArray-like object
        const plugins: PluginsObject = {
          length: pluginData.length,
          item(index: number): PluginData | null {
            return pluginData[index] || null;
          },
          namedItem(name: string): PluginData | null {
            return pluginData.find(p => p.name === name) || null;
          },
          refresh(): void {}
        };
        
        // Add indexed properties
        for (let i = 0; i < pluginData.length; i++) {
          Object.defineProperty(plugins, i, { 
            value: pluginData[i], 
            enumerable: true 
          });
        }
        
        return plugins;
      }
    });
    
    // Add a fake languages array
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en']
    });
    
    // Modify other properties commonly checked by fingerprinting scripts
    Object.defineProperty(navigator, 'permissions', {
      get: () => ({
        query: () => Promise.resolve({ state: 'granted' })
      })
    });
    
    // Hide automation-related objects
    // Use type assertion to handle the chrome property
    const win = window as any;
    if (win.chrome) {
      win.chrome.runtime = undefined;
    }
    
    // Override toString methods to hide native code markers
    const originalFunction = Function.prototype.toString;
    Function.prototype.toString = function() {
      if (this === Function.prototype.toString) {
        return originalFunction.call(this);
      }
      
      const fnStr = originalFunction.call(this);
      const isBrowserObj = this.name === '' || 
        this.name === 'toString' || 
        fnStr.includes('[native code]');
        
      return isBrowserObj ? 
        `function ${this.name}() { [native code] }` : 
        fnStr;
    };
  });
  
  // Set a realistic viewport size
  await page.setViewportSize({ 
    width: randomInt(1280, 1920), 
    height: randomInt(720, 1080) 
  });
}

/**
 * Adds random mouse movements to appear more human-like
 */
export async function addRandomMouseMovements(page: Page, duration: number = 10000): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < duration) {
    // Get viewport dimensions
    const dimensions = await page.evaluate(() => {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    });
    
    // Move to a random position
    await page.mouse.move(
      Math.floor(Math.random() * dimensions.width),
      Math.floor(Math.random() * dimensions.height)
    );
    
    // Wait a random amount of time
    await sleep(Math.random() * 1000 + 500);
  }
}

/**
 * Simulates human-like browser behavior by interacting with the page randomly
 */
export async function simulateHumanBehavior(page: Page): Promise<void> {
  // Get all clickable elements
  const clickableElements = await page.$$('a, button, [role="button"], input[type="submit"]');
  
  if (clickableElements.length > 0) {
    // Randomly hover over some elements
    for (let i = 0; i < Math.min(3, clickableElements.length); i++) {
      const randomIndex = Math.floor(Math.random() * clickableElements.length);
      const element = clickableElements[randomIndex];
      
      try {
        await element.hover({ force: true });
        await sleep(Math.random() * 1000 + 500);
      } catch (e) {
        // Ignore errors if element is not visible or has been detached
      }
    }
  }
  
  // Random scrolling
  if (Math.random() > 0.5) {
    const scrollAmount = Math.floor(Math.random() * 500) + 100;
    await page.evaluate((amount: number) => {
      window.scrollBy(0, amount);
    }, scrollAmount);
    
    await sleep(Math.random() * 1000 + 500);
  }
}

/**
 * Sets a realistic user agent
 */
export function getRealisticUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
  ];
  
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

/**
 * Configures browser launch options to avoid detection
 */
export function getStealthLaunchOptions() {
  return {
    headless: false, // Headless browsers are easier to detect
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--disable-blink-features=AutomationControlled',
      `--user-agent=${getRealisticUserAgent()}`
    ],
    ignoreDefaultArgs: ['--enable-automation']
  };
}
