// e2e/publish-flow.spec.js

import { test, expect, devices } from "@playwright/test";

const viewports = [
  { name: "mobile", viewport: devices["iPhone 13"].viewport },
  { name: "desktop", viewport: { width: 1280, height: 800 } },
];

for (const viewport of viewports) {
  test.describe(`publish flow — ${viewport.name}`, () => {
    test.use({ viewport: viewport.viewport });

    test("a registered user can log in and publish a post", async ({
      page,
      request,
    }) => {
      const runId = Date.now();
      const email = `e2e-${viewport.name}-${runId}@example.com`;
      const title = `Hello from ${viewport.name} (${runId})`;

      const registerRes = await request.post(
        "http://localhost:4000/api/auth/register",
        {
          data: { email, displayName: "E2E Tester", password: "correcthorse" },
        },
      );
      expect(registerRes.ok()).toBe(true);

      await page.goto("http://localhost:5173/login");

      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("correcthorse");
      await page.getByRole("button", { name: "Log In" }).click();

      await expect(page).toHaveURL("http://localhost:5173/");

      await page.getByRole("link", { name: "Write", exact: true }).click();
      await page.getByLabel("Title").fill(title);
      await page.getByLabel("Body").fill("Published end to end.");
      await page.getByRole("button", { name: "Publish" }).click();

      await expect(page).toHaveURL("http://localhost:5173/");

      // Section 4.3 (UX testing): the actual, user-visible outcome —
      // the new post genuinely appears in the rendered feed.
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    });
  });
}