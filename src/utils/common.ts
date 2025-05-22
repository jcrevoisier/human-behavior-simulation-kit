/**
 * Sleep function that returns a promise which resolves after the specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random float between min and max
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Adds jitter to a value within a specified percentage range
 */
export function addJitter(value: number, percentage: number = 10): number {
  const jitterFactor = 1 + (randomFloat(-percentage, percentage) / 100);
  return value * jitterFactor;
}
