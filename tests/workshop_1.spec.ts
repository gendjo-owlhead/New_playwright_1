import { test, expect } from '@playwright/test';

test('Basic navigation test', async ({ page }) => {
    // Navigate to GitLab
    await page.goto('https://gitlab.com');

    // Wait for and verify the GitLab logo is visible
    await page.waitForTimeout(3000);

    // Reload the page
    await page.reload();

});