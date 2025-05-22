import { chromium } from 'playwright';
import { 
  humanType, 
  humanClick, 
  humanScroll,
  humanHover,
  setupBrowserEvasions,
  getStealthLaunchOptions,
  sleep
} from '../index';

async function formFillExample() {
  // Launch the browser with stealth options
  const browser = await chromium.launch(getStealthLaunchOptions());
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Setup evasions
  await setupBrowserEvasions(page);
  
  try {
    // Navigate to a demo form page
    await page.goto('https://demoqa.com/automation-practice-form');
    
    // Fill out the form with human-like behavior
    await humanType(page, '#firstName', 'John', { delay: { min: 100, max: 250 } });
    await humanType(page, '#lastName', 'Smith', { delay: { min: 90, max: 200 } });
    await humanType(page, '#userEmail', 'john.smith@example.com', { delay: { min: 80, max: 180 } });
    
    // Click on a radio button
    await humanClick(page, 'label[for="gender-radio-1"]');
    
    // Type phone number
    await humanType(page, '#userNumber', '1234567890', { delay: { min: 70, max: 150 } });
    
    // Scroll down to see more fields
    await humanScroll(page, { distance: 300 });
    
    // Click on date picker
    await humanClick(page, '#dateOfBirthInput');
    
    // Select a date
    await humanClick(page, '.react-datepicker__day--010');
    
    // Type in subjects
    await humanClick(page, '#subjectsInput');
    await humanType(page, '#subjectsInput', 'Math');
    await page.keyboard.press('Enter');
    
    // Check a checkbox
    await humanClick(page, 'label[for="hobbies-checkbox-1"]');
    
    // Scroll to the bottom
    await humanScroll(page, { distance: 500 });
    
    // Type address
    await humanType(page, '#currentAddress', '123 Main St, New York, NY 10001', { 
      delay: { min: 90, max: 200 },
      mistakeProbability: 0.08
    });
    
    // Submit the form
    await humanClick(page, '#submit');
    
    // Take a screenshot
    await page.screenshot({ path: 'form-submission.png' });
    
    console.log('Form fill example completed successfully!');
  } catch (error) {
    console.error('Error during form fill example:', error);
  } finally {
    await browser.close();
  }
}

// Run the example
formFillExample().catch(console.error);
