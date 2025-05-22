import { Page } from 'playwright';
import { sleep } from './common';

/**
 * Generates a random point along a Bezier curve between two points
 */
function bezierPoint(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const cX = 3 * (p1 - p0);
  const bX = 3 * (p2 - p1) - cX;
  const aX = p3 - p0 - cX - bX;
  
  return aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0;
}

/**
 * Generates points along a smooth curve between start and end coordinates
 */
function generateCurvePoints(
  startX: number, 
  startY: number, 
  endX: number, 
  endY: number, 
  numPoints: number = 25
): {x: number, y: number}[] {
  const points: {x: number, y: number}[] = [];
  
  // Control points for the Bezier curve
  const ctrlPoint1X = startX + (Math.random() * 0.4 + 0.3) * (endX - startX);
  const ctrlPoint1Y = startY + (Math.random() - 0.5) * 100;
  const ctrlPoint2X = startX + (Math.random() * 0.4 + 0.6) * (endX - startX);
  const ctrlPoint2Y = endY + (Math.random() - 0.5) * 100;
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x = bezierPoint(t, startX, ctrlPoint1X, ctrlPoint2X, endX);
    const y = bezierPoint(t, startY, ctrlPoint1Y, ctrlPoint2Y, endY);
    points.push({ x, y });
  }
  
  return points;
}

/**
 * Moves the mouse in a human-like pattern to the target element
 */
export async function humanMouseMove(
  page: Page, 
  selector: string, 
  options: { 
    speedFactor?: number,  // 1 is normal, 0.5 is faster, 2 is slower
    deviation?: number     // How much the path can deviate
  } = {}
): Promise<void> {
  const { speedFactor = 1, deviation = 1 } = options;
  
  // Get current mouse position or use a default starting point
  const currentPosition = await page.evaluate(() => {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  });
  
  // Get the target element's position
  const elementHandle = await page.$(selector);
  if (!elementHandle) {
    throw new Error(`Element with selector "${selector}" not found`);
  }
  
  const boundingBox = await elementHandle.boundingBox();
  if (!boundingBox) {
    throw new Error(`Could not get bounding box for element with selector "${selector}"`);
  }
  
  // Target center of the element
  const targetX = boundingBox.x + boundingBox.width / 2;
  const targetY = boundingBox.y + boundingBox.height / 2;
  
  // Generate a curve with points
  const points = generateCurvePoints(
    currentPosition.x, 
    currentPosition.y, 
    targetX, 
    targetY,
    Math.floor(25 * deviation)
  );
  
  // Move through each point with realistic timing
  for (const point of points) {
    await page.mouse.move(point.x, point.y);
    
    // Random delay between movements (humans don't move at constant speed)
    const delay = Math.random() * 10 * speedFactor + 5;
    await sleep(delay);
  }
}

/**
 * Performs a human-like hover over an element
 */
export async function humanHover(page: Page, selector: string): Promise<void> {
  await humanMouseMove(page, selector);
  
  // Slight pause after reaching the element (like a human would)
  await sleep(Math.random() * 300 + 200);
}

/**
 * Performs a human-like click on an element
 */
export async function humanClick(
  page: Page, 
  selector: string, 
  options: { doubleClick?: boolean } = {}
): Promise<void> {
  await humanMouseMove(page, selector);
  
  // Slight pause before clicking (like a human would)
  await sleep(Math.random() * 200 + 100);
  
  if (options.doubleClick) {
    await page.dblclick(selector);
  } else {
    await page.click(selector);
  }
  
  // Slight pause after clicking
  await sleep(Math.random() * 200 + 50);
}
