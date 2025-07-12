import { test, expect } from "@playwright/test";

test("test home page", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  // 홈페이지 진입 확인
  await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");

  // 페이지 타이틀 확인
  await expect(page).toHaveTitle("Practice Software Testing - Toolshop - v5.0");

  // 노출되는 제품 수 확인
  const productContainer = page.locator(".container");
  await expect(productContainer.locator(".card")).toHaveCount(9); // 방법 1. regacy locator
  // await expect(productContainer.getByRole("link")).toHaveCount(9, {
  //   timeout: 15000,
  // }); // 방법 2. inner locator // "role=link"가 명시되지 않아도 <a> 태그안에 href 속성이 있으면 암시적으로 role=link로 간주한다.
  // expect(await productContainer.getByRole("link").count()).toBe(9); // 방법 3. none-locator assertion

  // Hand Saw 검색 후 결과 확인
  await page.getByTestId("search-query").fill("Wood Saw");
  await page.getByTestId("search-query").press("Enter");
  await expect(page.getByTestId("search-term")).toHaveText("Wood Saw");
  await expect(page.getByRole("link", { name: "Wood Saw" })).toBeVisible;
});
