import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Actions List', () => {
  test('Page Title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Home/);
  });

  test('New Action Button is rendered as expected', async ({
    page,
  }) => {
    // Expects page to have a button with text "New Action".
    const newActionButton = page.getByRole('button', {
      name: 'New Action',
    });
    await expect(newActionButton).toBeVisible();

    // Expects that button to be disabled
    await expect(newActionButton).toBeDisabled();
  });

  test('Ensure ActionsList is rendered as expected', async ({
    page,
  }) => {
    const actionsList = await page.getByTestId('actions-list');
    await expect(actionsList).toBeVisible();

    const listItems = await page.getByTestId(/actions-list-item-/);
    // Assuming 10 intial items are present on the page
    await expect(listItems).toHaveCount(10);
    const count = await listItems.count();

    for (let i = 0; i < count; i++) {
      await expect(listItems.nth(i)).toBeVisible();
    }
  });

  test('Ensure team filter is rendered', async ({ page }) => {
    // Check if the title is rendered
    const title = page.getByLabel('Filter by Domain');
    await expect(title).toBeVisible();
  });

  test('Ensure date sort and type filter are rendered', async ({
    page,
  }) => {
    // Check if the date sort is rendered
    const dateSort = page.getByLabel('Sort Filter');
    await expect(dateSort).toBeVisible();

    // Check if the type filter is rendered
    const typeFilter = page.getByLabel('Type Filter');
    await expect(typeFilter).toBeVisible();
  });

  test('Ensure LoadMore button is present on the page', async ({
    page,
  }) => {
    const loadMoreButton = page.getByRole('button', {
      name: 'Load More',
    });
    await expect(loadMoreButton).toBeVisible();
  });

  test('LoadMore button loads more items and disappears when there are no more items to load', async ({
    page,
  }) => {
    const loadMoreButton = page.getByRole('button', {
      name: 'Load More',
    });

    const maxIterations = 10;
    let iteration = 0;
    const initialItems = 10;
    let items = initialItems;

    // Loop while the Load More button is visible and under the max iteration limit
    while (
      (await loadMoreButton.isVisible()) &&
      iteration < maxIterations
    ) {
      iteration++;

      // Click the Load More button
      await loadMoreButton.click();

      // Check that the number of items has increased
      const newItems = await page
        .getByTestId(/actions-list-item-/)
        .count();

      expect(newItems).toBeGreaterThan(items); // Ensure more items were loaded

      items = newItems;
    }

    await expect(loadMoreButton).not.toBeVisible();

    // Ensure the final number of items is greater than the initial count
    const finalItems = await page
      .getByTestId(/actions-list-item-/)
      .count();
    console.log('finael', finalItems, initialItems);
    expect(finalItems).toBeGreaterThan(initialItems);
  });

  test('Should render the correct loader component', async ({
    page,
  }) => {
    // Check that the loading indicator is visible immediately after reload
    const loadingIndicator = page.getByTestId('spinner');

    await page.reload();

    await expect(page.getByTestId('spinner')).toBeVisible();

    await expect(page.getByTestId('actions-list')).toBeVisible();

    // Verify that the loading indicator is no longer visible
    await expect(loadingIndicator).not.toBeVisible();
  });
});
