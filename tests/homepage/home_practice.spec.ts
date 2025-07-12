import { test, expect } from "@playwright/test";

test.describe("test home page with no auth", () => {
  // 브라우저 실행을 위한 반복 함수 작성
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("visual test", async ({ page }) => {
    await page.waitForLoadState("networkidle"); // 네트워크 요청 완료 대기
    await expect(page).toHaveScreenshot("home-page-no-auth.png", {
      mask: [page.getByTitle("Practice Software Testing - Toolshop - v5.0")],
    });
  });

  // 홈페이지 진입 확인
  test("check sign in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");
  });

  // 페이지 타이틀 확인
  test("page title", async ({ page }) => {
    await expect(page).toHaveTitle(
      "Practice Software Testing - Toolshop - v5.0"
    );
  });

  // 노출되는 제품 수 확인
  test("grid loads with 9 items", async ({ page }) => {
    const productContainer = page.locator(".container");
    await expect(productContainer.locator(".card")).toHaveCount(9); // 방법 1. regacy locator
    // await expect(productContainer.getByRole("link")).toHaveCount(9, {
    //   timeout: 15000,
    // }); // 방법 2. inner locator // "role=link"가 명시되지 않아도 <a> 태그안에 href 속성이 있으면 암시적으로 role=link로 간주한다.
    // expect(await productContainer.getByRole("link").count()).toBe(9); // 방법 3. none-locator assertion
  });

  // Hand Saw 검색 후 결과 확인
  test("search for Wood Saw", async ({ page }) => {
    await page.getByTestId("search-query").fill("Wood Saw");
    await page.getByTestId("search-query").press("Enter");
    await expect(page.getByTestId("search-term")).toHaveText("Wood Saw");
    await expect(page.getByRole("link", { name: "Wood Saw" })).toBeVisible;
  });
});

// 로그인 상태 확인
test.describe("home page customer auth", () => {
  test.use({ storageState: ".auth/customer.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("visual test authorized", async ({ page }) => {
    await page.waitForLoadState("networkidle"); // 네트워크 요청 완료 대기
    await expect(page).toHaveScreenshot("home-page-with-auth.png", {
      mask: [page.getByTitle("Practice Software Testing - Toolshop - v5.0")],
    });
  });

  test("check customer is signed in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Jane Doe" })).toContainText(
      "Jane Doe"
    );
  });
});
