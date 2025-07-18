import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("@smoke get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await page.getByRole("navigation", { name: "Main" }).click();
  // 테스트 제목에 태그를 포함시켜야 함
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
  await page.goto("http://playwright.com/");
});
