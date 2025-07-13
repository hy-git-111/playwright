import { test as setup, expect } from "@playwright/test";

setup("Create customer auth", async ({ page, context }) => {
  // const email = "customer@practicesoftwaretesting.com";
  const email = "customer2@practicesoftwaretesting.com";
  const password = "welcome01";
  const customerAuthFile = ".auth/customer.json";

  await page.goto("https://practicesoftwaretesting.com/auth/login");

  // 이메일 입력
  await page.getByTestId("email").fill(email);

  // 비밀번호 입력
  await page.getByTestId("password").fill(password);

  // 제출 버튼 클릭
  await page.getByTestId("login-submit").click();

  await expect(
    page.getByRole("button", { name: /Jane Doe|Jack Howe/ })
  ).toBeVisible();

  // 토큰 저장 대기
  await context.storageState({ path: customerAuthFile });

  // 스토리지 초기화(토큰 유지시간 2분)
  await page.addInitScript(() => {
    // evaulate : 즉시 실행, addInitScript : 이후 새 브라우저 실행 시 실행
    localStorage.clear();
  });

});
