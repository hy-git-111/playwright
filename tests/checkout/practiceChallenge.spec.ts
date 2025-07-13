/* E2E 테스트
- storageState 사용
describe 항목
1. 장바구니에 항목 추가
2. 결제 프로세스 진행
3. 지금 구매

test 항목
1. 지금 구매
2. 나중에 지불

- 결제 흐름에 대한 visual test(스크린샷) 포함 */

/* API 테스트 생성
- product/{id} endpoint 사용
- API 응답에 따른 제품 세부 정보 반환
- 상품 ID는 2시간마다 랜덤 생성되므로 ID를 안정적으로 가져올 수 있는 방법 생각해보기 */

import { test, expect } from "@playwright/test";
// E2E Test
const baseUrl = "https://practicesoftwaretesting.com";
test.describe("payment flow test", () => {
  test.use({ storageState: ".auth/customer.json" });
  test.beforeEach(async ({ page }) => {
    // 홈페이지 진입
    await page.goto(baseUrl);
    await page.waitForLoadState("networkidle"); // 네트워크 요청 완료
    await expect(
      page.getByTitle("Practice Software Testing - Toolshop")
    ).toBeVisible();

    // 제품 상세 진입
    await page.getByText("Combination Pliers").click();
    await expect(page).toHaveURL(new RegExp(`${baseUrl}/product/.*`)); // URL에 product가 포함되는지 확인

    // 장바구니 담기
    await page.getByTestId("add-to-cart").click();

    let addToAlert = page.getByRole("alert", {
      name: "Product added to shopping cart.",
    });
    await expect(addToAlert).toBeVisible();
    await addToAlert.click();

    // 장바구니로 이동
    await page.locator('[data-test="nav-cart"]').click();
    await expect(page.locator('[data-test="proceed-1"]')).toBeVisible();

    // 결제 진행
    await page.locator('[data-test="proceed-1"]').click();
    await expect(page.locator("app-login")).toContainText(
      "you are already logged in. You can proceed to checkout."
    );

    await page.locator('[data-test="proceed-2"]').click();
    await expect(page.getByRole("heading")).toContainText("Billing Address");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await page.locator('[data-test="state"]').fill("state");
    await page.locator('[data-test="postal_code"]').fill("11-111");

    await page.locator('[data-test="proceed-3"]').click();
    await expect(page.getByRole("heading")).toContainText("Payment");
  });

  test("payment cash on delivery", async ({ page }) => {
    await page
      .locator('[data-test="payment-method"]')
      .selectOption("cash-on-delivery");
    await expect(page.locator('[data-test="payment-method"]')).toHaveValue(
      "cash-on-delivery"
    );

    await page.getByText("Confirm").click();
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^Payment was successful$/ })
        .first()
    ).toBeVisible();
    await page.waitForTimeout(5000);

    await page.getByText("Confirm").click();
    await page.waitForTimeout(5000);
    await expect(page.locator("#order-confirmation")).toBeVisible();
    // console.log(await page.locator("#order-confirmation").innerText());
    await expect(page.locator("#order-confirmation")).toContainText(
      "Thanks for your order!"
    );
  });

  test("payment buy now pay later", async ({ page }) => {
    // 결제 방법 선택
    await page
      .locator('[data-test="payment-method"]')
      .selectOption("buy-now-pay-later");
    await page.locator('[data-test="monthly_installments"]').selectOption("3");

    await expect(page.locator('[data-test="payment-method"]')).toHaveValue(
      "buy-now-pay-later"
    );
    await expect(
      page.locator('[data-test="monthly_installments"]')
    ).toHaveValue("3");

    await page.getByText("Confirm").click();
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^Payment was successful$/ })
        .first()
    ).toBeVisible();
    await page.waitForTimeout(5000);
    await page.getByText("Confirm").click();
    await page.waitForTimeout(5000);
    await expect(page.locator("#order-confirmation")).toBeVisible();
    // console.log(await page.locator("#order-confirmation").innerText());
    await expect(page.locator("#order-confirmation")).toContainText(
      "Thanks for your order!"
    );
  });
  // test("go to product detail", async ({ page }) => {
  //   // const randomChoice = (array) =>
  //   //   array[Math.floor(Math.random() * array.length)];
  //   await page.getByText("Combination Pliers").click();
  //   await expect(page).toHaveURL(new RegExp(`${baseUrl}/product/.*`)); // URL에 product가 포함되는지 확인
  // });

  // test("add cart", async ({ page }) => {
  //   await page.getByTestId("add-to-cart").click();
  //   await expect(
  //     page.getByRole("alert", { name: "Product added to shopping cart." })
  //   ).toBeVisible;
  // });

  // 여기부터 결제 흐름 확인 테스트 작성
});
