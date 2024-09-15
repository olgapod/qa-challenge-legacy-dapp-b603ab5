import { test, expect, type Page } from '@playwright/test';
import { getSortedDates } from './utils/getSortedDates';

test.describe('Filtering and Sorting Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page containing the list component
    await page.goto('/');
  });

  test('Ensure the list is correctly filtered by type', async ({
    page,
  }) => {
    const typeFilterButton = await page.getByLabel('Type Filter');

    await typeFilterButton.click();
    const typeFilterDropdown = await page.getByRole('listbox');
    const options = await typeFilterDropdown.getByRole('option');
    const count = await options.count();

    for (let i = 0; i < count; i++) {
      const isDropdownOpen = await typeFilterDropdown.isVisible();

      // Open the dropdown if it's not already open
      if (!isDropdownOpen) {
        await typeFilterButton.click();
      }
      const option = options.nth(i);
      // Get the value of the current option
      const optionValue = await option.textContent();

      // Skip the options with no list items, as there is a bug where the filters disappear for those options
      if (
        optionValue?.trim() === 'All' ||
        optionValue?.trim() === 'Permissions' ||
        optionValue?.trim() === 'Generic'
      ) {
        continue;
      }

      // Select the filter option
      await option.scrollIntoViewIfNeeded();
      // The option only changes when the hover event is triggered — this is a bug
      await option.hover();
      await option.click();

      const listItems = await page.getByTestId(/actions-list-item-/);
      const listItemsCount = await listItems.count();

      for (let i = 0; i < listItemsCount; i++) {
        const dataActionType = await listItems
          .nth(i)
          .getAttribute('data-action-type');
        console.log('role', dataActionType);
        console.log('optionValue', optionValue);

        await expect(dataActionType?.toLowerCase()).toEqual(
          optionValue?.toLowerCase()
        );
      }
    }
  });

  test('Ensure the list is correctly filtered by team', async ({
    page,
  }) => {
    const teamFilterButton = await page.getByLabel(
      'Filter by Domain'
    );

    await teamFilterButton.click();
    const teamFilterDropdown = await page.getByRole('listbox');
    const options = await teamFilterDropdown.getByRole('option');
    const count = await options.count();

    for (let i = 0; i < count; i++) {
      const isDropdownOpen = await teamFilterDropdown.isVisible();

      // Open the dropdown if it's not already open
      if (!isDropdownOpen) {
        await teamFilterButton.click();
      }
      const option = options.nth(i);
      // Get the value of the current option
      const optionValue = await option.textContent();

      // Skip the All Teams option
      if (optionValue?.trim() === 'All Teams') {
        continue;
      }

      // Select the filter option
      await option.scrollIntoViewIfNeeded();
      // The option only changes when the hover event is triggered — this is a bug
      await option.hover();
      await option.click();

      const listItems = await page.getByTestId(/actions-list-item-/);
      const listItemsCount = await listItems.count();

      for (let i = 0; i < listItemsCount; i++) {
        const team = await listItems
          .nth(i)
          .getByTestId('domainName')
          .textContent();

        await expect(team?.toLowerCase()).toEqual(
          optionValue?.toLowerCase()
        );
      }
    }
  });

  test('Ensure the list is correctly sorted by date', async ({
    page,
  }) => {
    // Select ASC sorting option
    const sortingButton = await page.getByLabel('Sort Filter');
    sortingButton.click();
    const sortOptionAsc = await page
      .getByRole('listbox')
      .getByRole('option', { name: 'Oldest' });

    await sortOptionAsc.hover();
    await sortOptionAsc.click();

    // Extract timestamps and text content from each date element
    const sortedDatesAsc = await getSortedDates(page);

    console.log('Dates, ASC', sortedDatesAsc);

    // Verify that the dates are in ascending order
    for (let i = 0; i < sortedDatesAsc.length - 1; i++) {
      expect(sortedDatesAsc[i].getTime()).toBeLessThanOrEqual(
        sortedDatesAsc[i + 1].getTime()
      );
    }

    // Select DESC order
    sortingButton.click();
    const sortOptionDesc = await page
      .getByRole('listbox')
      .getByRole('option', { name: 'Oldest' });

    await sortOptionDesc.hover();
    await sortOptionDesc.click();

    let sortedDatesDesc = await getSortedDates(page);
    console.log('Dates, DESC', sortedDatesAsc);
    // Verify that the dates are in descending order
    for (let i = 0; i < sortedDatesDesc.length - 1; i++) {
      expect(sortedDatesDesc[i].getTime()).toBeLessThanOrEqual(
        sortedDatesDesc[i + 1].getTime()
      );
    }
  });

  test('Ensure all filters and sort can work in combination', async ({
    page,
  }) => {
    // Apply filter by team - Root option
    const teamFilterButton = await page.getByLabel(
      'Filter by Domain'
    );
    await teamFilterButton.click();

    const teamFilterDropdown = await page.getByRole('listbox');
    const teamFilterOption = await teamFilterDropdown.getByRole(
      'option',
      {
        name: 'Root',
      }
    );
    await teamFilterOption.hover();
    await teamFilterOption.click();

    // Apply Filter by type - Details option

    const typeFilterButton = await page.getByLabel('Type Filter');
    await typeFilterButton.click();

    const typeFilterDropdown = await page.getByRole('listbox');
    const typeFilterOption = await typeFilterDropdown.getByRole(
      'option',
      {
        name: 'Details',
      }
    );

    await typeFilterOption.hover();
    await typeFilterOption.click();

    // Sort By DESC
    const sortingButton = await page.getByLabel('Sort Filter');
    await sortingButton.click();
    const sortOptionDesc = await page
      .getByRole('listbox')
      .getByRole('option', { name: 'Oldest' });

    await sortOptionDesc.hover();
    await sortOptionDesc.click();
    // Select all items
    let dates = await getSortedDates(page);
    // Verify that the dates are in descending order
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i].getTime()).toBeLessThanOrEqual(
        dates[i + 1].getTime()
      );
    }

    // Verify only items of the selected team (Root) amd type (Details) are present on the list
    const listItems = await page.getByTestId(/actions-list-item-/);
    const listItemsCount = await listItems.count();
    for (let i = 0; i < listItemsCount; i++) {
      const team = await listItems
        .nth(i)
        .getByTestId('domainName')
        .textContent();

      const type = await await listItems
        .nth(i)
        .getAttribute('data-action-type');

      await expect(team?.toLowerCase()).toEqual('root');
      await expect(type?.toLowerCase()).toEqual('details');
    }
  });
});
