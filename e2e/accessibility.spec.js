import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("feed page has no automatically detectable accessibility violations", async ({
    page,
}) => {
    await page.goto("http://localhost:5173/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
});