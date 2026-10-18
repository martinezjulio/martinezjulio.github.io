const { test, expect } = require("@playwright/test");
const { preparePage, stabilizeVisuals } = require("./helpers");

test("distill style remains stable after load", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("al-folio/blog/2021/distill/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const before = await page.evaluate(() => {
    const article = document.querySelector("d-article");
    return article ? getComputedStyle(article).color : null;
  });

  await page.waitForTimeout(3000);

  const after = await page.evaluate(() => {
    const article = document.querySelector("d-article");
    return article ? getComputedStyle(article).color : null;
  });

  expect(after).toBe(before);

  const hasRemoteDistillLoader = await page.evaluate(() => {
    return performance.getEntriesByType("resource").some((entry) => entry.name.includes("distill.pub/template.v2.js"));
  });
  expect(hasRemoteDistillLoader).toBe(false);
});
