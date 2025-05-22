import { Page } from 'playwright';
import { sleep } from './common';

/**
 * Types text with human-like delays and occasional mistakes
 */
export async function humanType(
  page: Page, 
  selector: string, 
  text: string, 
  options: {
    delay?: { min: number, max: number },
    mistakeProbability?: number,
    correctionDelay?: { min: number, max: number }
  } = {}
): Promise<void> {
  const {
    delay = { min: 50, max: 150 },
    mistakeProbability = 0.05,
    correctionDelay = { min: 200, max: 350 }
  } = options;
  
  await page.click(selector);
  
  for (let i = 0; i < text.length; i++) {
    // Decide if we'll make a typo
    const makeMistake = Math.random() < mistakeProbability;
    
    if (makeMistake) {
      // Type a wrong character (adjacent on keyboard)
      const wrongChar = getAdjacentKey(text[i]);
      await page.type(selector, wrongChar, { delay: 0 });
      
      // Wait a bit before correcting
      await sleep(
        Math.random() * (correctionDelay.max - correctionDelay.min) + correctionDelay.min
      );
      
      // Delete the wrong character
      await page.keyboard.press('Backspace');
      
      // Wait a bit before typing the correct character
      await sleep(
        Math.random() * (correctionDelay.max - correctionDelay.min) / 2 + correctionDelay.min / 2
      );
    }
    
    // Type the correct character with a random delay
    const typeDelay = Math.random() * (delay.max - delay.min) + delay.min;
    await page.type(selector, text[i], { delay: typeDelay });
    
    // Occasionally pause as if thinking (especially after punctuation)
    if (['.', ',', '!', '?', ';', ':'].includes(text[i]) || i === text.length - 1) {
      await sleep(Math.random() * 500 + 200);
    } else if (text[i] === ' ' && Math.random() < 0.1) {
      await sleep(Math.random() * 300 + 100);
    }
  }
}

/**
 * Returns an adjacent key on the keyboard to simulate typos
 */
function getAdjacentKey(char: string): string {
  const keyboardLayout: { [key: string]: string[] } = {
    'a': ['q', 'w', 's', 'z'],
    'b': ['v', 'g', 'h', 'n'],
    'c': ['x', 'd', 'f', 'v'],
    // Add more keys as needed
    // This is a simplified version - you can expand it
  };
  
  // Default to a random letter if the character isn't in our layout
  if (!keyboardLayout[char.toLowerCase()]) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  
  const adjacentKeys = keyboardLayout[char.toLowerCase()];
  return adjacentKeys[Math.floor(Math.random() * adjacentKeys.length)];
}
