import { type Page } from '@playwright/test';

export async function getSortedDates(page: Page) {
  const dateElements = await page.getByTestId('createdAt');
  const dateElementsArray = await dateElements.all();
  // Extract timestamps and text content from each date element
  const dates = await Promise.all(
    dateElementsArray.map(async (element) => {
      const text = (await element.textContent())?.trim();
      const timestampStr = await element.getAttribute(
        'data-timestamp'
      );
      if (timestampStr === null) {
        throw new Error(`Invalid timestamp: ${timestampStr}`);
      }
      const timestamp = parseInt(timestampStr, 10);
      if (isNaN(timestamp)) {
        throw new Error(`Invalid timestamp: ${timestampStr}`);
      }
      return new Date(timestamp);
    })
  );

  return dates;
}
