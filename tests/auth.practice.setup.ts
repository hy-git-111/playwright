import { test as setup, expect } from "@playwright/test";

setup("Create customer auth", async ({ page, context }) => {
  const email = "customer@practicesoftwaretesting.com";
  const password = "welcome01";
  const customerAuthFile = ".auth/customer.json";

  await page.goto("https://practicesoftwaretesting.com/auth/login");

  // 이메일 입력
  await page.getByTestId("email").fill(email);

  // 비밀번호 입력
  await page.getByTestId("password").fill(password);

  // 제출 버튼 클릭
  await page.getByTestId("login-submit").click();

  await expect(page.getByRole("button", { name: "Jane Doe" })).toContainText(
    "Jane Doe"
  );
  await context.storageState({ path: customerAuthFile });
});
