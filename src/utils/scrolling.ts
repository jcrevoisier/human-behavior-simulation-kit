import { Page } from 'playwright';
import { sleep } from './common';

/**
 * Performs a human-like scroll with natural acceleration and deceleration
 */
export async function humanScroll(
  page: Page, 
  options: {
    direction?: 'down' | 'up',
    distance?: number,
    speed?: 'slow' | 'medium' | 'fast',
    smoothness?: number
  } = {}
): Promise<void> {
  const {
    direction = 'down',
    distance = 800,
    speed = 'medium',
    smoothness = 15
  } = options;
  
  // Convert speed setting to actual values
  const speedFactor = {
    slow: 1.5,
    medium: 1,
    fast: 0.7
  }[speed];
  
  // Calculate the number of steps based on smoothness
  const steps = Math.max(5, Math.floor(smoothness));
  
  // Calculate step sizes with easing (smaller at start and end, larger in middle)
  const stepSizes: number[] = [];
  for (let i = 0; i < steps; i++) {
    // Easing function - starts slow, speeds up in the middle, slows down at the end
    const t = i / (steps - 1);
    const easeInOut = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    
    // Calculate step size with some randomness
    const baseStep = (distance / steps) * easeInOut;
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    stepSizes.push(baseStep * randomFactor);
  }
  
  // Normalize step sizes to ensure we scroll the exact distance
  const totalSize = stepSizes.reduce((sum, size) => sum + size, 0);
  const normalizedSteps = stepSizes.map(size => (size / totalSize) * distance);
  
  // Perform the scroll in steps
  let scrolledSoFar = 0;
  for (const stepSize of normalizedSteps) {
    const roundedStep = Math.round(stepSize) * (direction === 'up' ? -1 : 1);
    scrolledSoFar += Math.abs(roundedStep);
    
    await page.evaluate((y: number) => {
      window.scrollBy(0, y);
    }, roundedStep);
    
    // Random delay between scroll steps
    const delay = (Math.random() * 30 + 20) * speedFactor;
    await sleep(delay);
    
    // Occasionally pause during scrolling (like a human reading)
    if (Math.random() < 0.1) {
      await sleep(Math.random() * 400 + 200);
    }
  }
  
  // Pause after scrolling (as if reading content)
  await sleep(Math.random() * 500 + 300);
}

/**
 * Scrolls to a specific element in a human-like way
 */
export async function humanScrollToElement(
  page: Page, 
  selector: string, 
  options: {
    offset?: number,
    behavior?: 'smooth' | 'instant'
  } = {}
): Promise<void> {
  const { offset = 100, behavior = 'smooth' } = options;
  
  // Check if element exists
  const elementHandle = await page.$(selector);
  if (!elementHandle) {
    throw new Error(`Element with selector "${selector}" not found`);
  }
  
  // Get element position
  const boundingBox = await elementHandle.boundingBox();
  if (!boundingBox) {
    throw new Error(`Could not get bounding box for element with selector "${selector}"`);
  }
  
  if (behavior === 'instant') {
    // Instant scroll (less human-like but sometimes needed)
    await page.evaluate(({ yPosition, offsetValue }) => {
      window.scrollTo({
        top: yPosition - offsetValue,
        behavior: 'auto'
      });
    }, { yPosition: boundingBox.y, offsetValue: offset });
    return;
  }
  
  // Get current scroll position
  const currentScroll = await page.evaluate(() => window.scrollY);
  
  // Calculate distance to scroll
  const targetScroll = boundingBox.y - offset;
  const scrollDistance = targetScroll - currentScroll;
  
  // Determine direction
  const direction = scrollDistance > 0 ? 'down' : 'up';
  
  // Perform human-like scroll
  await humanScroll(page, {
    direction,
    distance: Math.abs(scrollDistance),
    smoothness: 20
  });
}
