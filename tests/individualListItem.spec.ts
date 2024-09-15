import { test, expect } from '@playwright/test';
import { actionTypesRegexMap } from './constants';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});
test.describe('Individual List Item Tests', () => {
  test('Ensure list items have the expected elements', async ({
    page,
  }) => {
    // Get all list items
    const listItems = await page.getByTestId(/actions-list-item-/);

    // Check if each list item has the expected elements
    const count = await listItems.count();
    for (let i = 0; i < count; i++) {
      const item = listItems.nth(i);

      // User avatar
      const avatarImg = await item.getByTestId('avatar');
      await expect(avatarImg).toBeVisible();
      await expect(avatarImg.getAttribute('src')).toBeTruthy();

      // Title;
      await expect(item.getByTestId('actionTitle')).toBeVisible();

      // Status
      await expect(item.getByText(/Passed|Failed/i)).toBeVisible();

      // Date
      await expect(item.getByTestId('createdAt')).toBeVisible();

      // Team
      await expect(item.getByTestId('domainName')).toBeVisible();
    }
  });

  test('Ensure the title corresponds to the correct type', async ({
    page,
  }) => {
    // Get all list items
    const listItems = await page.getByTestId(/actions-list-item-/);
    const count = await listItems.count();

    for (let i = 0; i < count; i++) {
      const item = listItems.nth(i);
      const actionTitleText = await item
        .getByTestId('actionTitle')
        .textContent();

      // Extract the action type from the data-action-type attribute
      const actionType = await item.getAttribute('data-action-type');

      if (actionType && actionTitleText) {
        // Get the regex for the corresponding action type
        const expectedRegex = actionTypesRegexMap[actionType.trim()];

        // Verify that the action title matches the expected format
        expect(actionTitleText.trim()).toMatch(expectedRegex);
      } else {
        throw new Error(
          `Couldn't find action type or actionTitle of a list item, actionType - ${actionType},\
           actionTitleText - ${actionTitleText}`
        );
      }
    }
  });
});

test.describe('User Popover Component', () => {
  test('Ensure the user popover component opens and closes as expected', async ({
    page,
  }) => {
    const userAvatar = await page.getByTestId('avatar').first();
    await userAvatar.click();
    const popover = page.getByRole('tooltip');
    await expect(popover).toBeInViewport();

    await userAvatar.click();

    await expect(popover).not.toBeVisible();
  });

  test('Ensure the user popover component displays the correct user information: user avatar, user name, user address', async ({
    page,
  }) => {
    const firstItem = await page
      .getByTestId(/actions-list-item-/)
      .first();
    const userAvatar = await firstItem.getByTestId('avatar');
    const userAvatarInListItem = await userAvatar.getAttribute('src');
    await userAvatar.click();
    const walletAddressElement = await page
      .locator('[data-wallet-address]')
      .first();
    const username = await walletAddressElement.getAttribute(
      'data-username'
    );
    const walletAddress = await walletAddressElement.getAttribute(
      'data-wallet-address'
    );

    const popover = page.getByRole('tooltip');
    console.log('walle', walletAddress);
    console.log('username', username);
    await expect(popover).toContainText(walletAddress!);
    await expect(popover).toContainText(username!);

    const userAvatarInPopover = await popover
      .getByTestId('avatar')
      .getAttribute('src');

    await expect(popover.getByTestId('avatar')).toBeVisible();
    await expect(userAvatarInPopover).toEqual(userAvatarInListItem);

    const avatarBox = await popover
      .getByTestId('avatar')
      .boundingBox();
    // In the task description the size is expected to be 42x42 ????
    expect(avatarBox!.width).toBe(34);
    expect(avatarBox!.height).toBe(34);

    const popoverUsername = await popover.getByText(username!);

    // Verify font weight is 700
    const fontWeight = await popoverUsername.evaluate(
      (el) => window.getComputedStyle(el).fontWeight
    );
    expect(fontWeight).toBe('700');

    // Verify font size is 13px
    const fontSize = await popoverUsername.evaluate(
      (el) => window.getComputedStyle(el).fontSize
    );
    expect(fontSize).toBe('13px');

    // Verify the color is rgb(254, 94, 124)
    const color = await popoverUsername.evaluate(
      (el) => window.getComputedStyle(el).color
    );
    expect(color).toBe('rgb(254, 94, 124)');
  });
});
