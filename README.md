# Human Behavior Simulation Kit

A comprehensive TypeScript library for simulating human-like behavior in web automation and scraping projects. This toolkit helps you create more natural browser interactions that can bypass simple bot detection mechanisms.

## Features

- 🖱️ **Realistic Mouse Movements**: Smooth, natural cursor paths with acceleration and deceleration
- ⌨️ **Human-like Typing**: Variable speed typing with occasional typos and corrections
- 📜 **Natural Scrolling Patterns**: Randomized scroll behavior that mimics human reading patterns
- 🛡️ **Bot Detection Bypass**: Techniques to avoid common bot detection mechanisms
- 🧩 **Modular Design**: Import only the utilities you need for your project

## Installation

```bash
npm install human-behavior-simulation-kit
```

## Quick Start

```typescript
import { chromium } from 'playwright';
import { 
  createHumanBrowser,
  createHumanContext,
  createHumanPage,
  humanType,
  humanClick,
  humanScroll
} from 'human-behavior-simulation-kit';

async function example() {
  // Create a browser with human-like behavior
  const browser = await createHumanBrowser();
  const context = await createHumanContext(browser);
  const page = await createHumanPage(context);
  
  try {
    await page.goto('https://example.com');
    
    // Type like a human
    await humanType(page, 'input[name="search"]', 'example search query', {
      delay: { min: 50, max: 150 },
      mistakeProbability: 0.05
    });
    
    // Click like a human
    await humanClick(page, 'button[type="submit"]');
    
    // Scroll like a human
    await humanScroll(page, { 
      direction: 'down',
      distance: 500,
      speed: 'medium'
    });
    
  } finally {
    await browser.close();
  }
}

example().catch(console.error);
```

## API Documentation

### Mouse Movement

- `humanMouseMove(page, selector, options)`: Move the mouse to an element with natural motion
- `humanHover(page, selector)`: Hover over an element naturally
- `humanClick(page, selector, options)`: Click an element with realistic timing and movement

### Typing

- `humanType(page, selector, text, options)`: Type text with variable speed and occasional typos
  - Options include typing speed, mistake probability, and correction delay

### Scrolling

- `humanScroll(page, options)`: Perform natural scrolling with acceleration and deceleration
  - Options include direction, distance, speed, and smoothness
- `humanScrollToElement(page, selector, options)`: Scroll to a specific element naturally

### Bot Detection Bypass

- `setupBrowserEvasions(page)`: Configure the browser to avoid common detection techniques
- `getStealthLaunchOptions()`: Get recommended browser launch options to avoid detection
- `addRandomMouseMovements(page, duration)`: Add random mouse movements to appear more human-like
- `simulateHumanBehavior(page)`: Perform random interactions to simulate browsing behavior

### Convenience Functions

- `createHumanBrowser()`: Create a browser instance with human-like configurations
- `createHumanContext(browser)`: Create a browser context with human-like settings
- `createHumanPage(context)`: Create a page with human-like behavior configurations

### Utility Functions

- `sleep(ms)`: Pause execution for the specified time
- `randomInt(min, max)`: Generate a random integer within a range
- `randomFloat(min, max)`: Generate a random float within a range
- `addJitter(value, percentage)`: Add random variation to a value

## Advanced Usage

### Customizing Mouse Movement

```typescript
import { humanMouseMove } from 'human-behavior-simulation-kit';

// Slower, more precise movement
await humanMouseMove(page, '#precise-element', {
  speedFactor: 1.5,  // Slower movement
  deviation: 0.7     // Less deviation from direct path
});

// Faster, more casual movement
await humanMouseMove(page, '#casual-element', {
  speedFactor: 0.8,  // Faster movement
  deviation: 1.3     // More random path
});
```

### Realistic Form Filling

```typescript
import { humanType, humanClick, sleep } from 'human-behavior-simulation-kit';

// Fill out a form like a human would
async function fillForm(page) {
  // Type with occasional mistakes
  await humanType(page, '#username', 'johndoe', {
    delay: { min: 80, max: 200 },
    mistakeProbability: 0.08
  });
  
  // Pause briefly between fields (as humans do)
  await sleep(Math.random() * 300 + 200);
  
  await humanType(page, '#email', 'john.doe@example.com', {
    delay: { min: 70, max: 180 }
  });
  
  await sleep(Math.random() * 400 + 300);
  
  // Click the submit button
  await humanClick(page, '#submit-button');
}
```

### Natural Scrolling Patterns

```typescript
import { humanScroll, humanScrollToElement, sleep } from 'human-behavior-simulation-kit';

async function readArticle(page) {
  // Initial scroll to start reading
  await humanScroll(page, { distance: 300, speed: 'medium' });
  
  // Pause as if reading content
  await sleep(Math.random() * 3000 + 2000);
  
  // Continue scrolling
  await humanScroll(page, { distance: 500, speed: 'slow' });
  
  // Pause again
  await sleep(Math.random() * 4000 + 3000);
  
  // Scroll to a specific element (like a comment section)
  await humanScrollToElement(page, '#comments');
}
```

## Bot Detection Avoidance

This library implements several techniques to avoid common bot detection mechanisms:

1. **Natural Mouse Movements**: Uses Bezier curves to create smooth, human-like mouse paths
2. **Variable Typing Patterns**: Randomizes typing speed and adds occasional typos
3. **Realistic Scrolling**: Implements acceleration and deceleration in scrolling
4. **Browser Fingerprint Modification**: Alters properties that automation detection scripts check
5. **Randomized Behavior**: Adds unpredictability to all interactions

## Limitations

- This library helps avoid basic bot detection but may not bypass sophisticated anti-bot systems
- Some websites use advanced fingerprinting techniques that may require additional customization
- Headless browsers are more easily detected; use `headless: false` for better results

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
