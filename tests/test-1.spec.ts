import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Community' }).click();
  await page.getByLabel('Docs sidebar').getByRole('link', { name: 'Ambassadors' }).click();
  await expect(page.getByRole('img', { name: 'Butch Mayhew\'s avatar' })).toBeVisible();
  await expect(page.locator('section')).toContainText('Butch Mayhew');
  await expect(page.locator('section')).toMatchAriaSnapshot(`
    - listitem:
      - img "Butch Mayhew's avatar"
      - text: Butch Mayhew
      - paragraph: Birmingham
      - paragraph: USA
      - paragraph: English
      - link "Twitter":
        - /url: https://twitter.com/butchmayhew
      - link "Website":
        - /url: https://playwrightsolutions.com/
    `);
  await page.goto('https://playwright.dev/');
});
