import { expect, test } from "@playwright/test";

// proxy.ts가 SITE_PASSWORD 쿠키 없이는 전체 페이지를 /login으로 돌려보내므로,
// 실제 페이지 검증 전에 로그인부터 한다. 비밀번호는 playwright.config.ts의
// webServer.env에 설정한 값과 같아야 한다.
test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("비밀번호").fill("e2e-test-password");
  await page.getByRole("button", { name: "입장하기" }).click();
  await page.waitForURL("/");
});

test("홈 화면이 열리고 시작 안내 제목이 보인다", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Create Next App");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "To get started"
  );
});
