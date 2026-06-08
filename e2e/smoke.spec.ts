import { test, expect } from "@playwright/test";

// Live-readiness smoke suite. Verifies public pages render and the analyse route
// is reachable. Does NOT require OpenRouter/DB secrets and never asserts analysis
// success (the analyse page may show an error boundary without secrets — that is
// fine here; real analysis is a separate manual smoke step, see DEPLOY.md).

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Verstehe GitHub");
  await expect(page.getByPlaceholder(/Repository \(owner\/repo\)/)).toBeVisible();
});

test("submitting a GitHub URL reaches the analyse route", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder(/Repository \(owner\/repo\)/).fill("https://github.com/vercel/next.js");
  await page.getByRole("button", { name: /Los|Go/ }).click();
  await page.waitForURL(/\/analyse\/vercel\/next\.js/, { timeout: 30_000 });
  expect(page.url()).toContain("/analyse/vercel/next.js");
});

test("knowledge hub pages load", async ({ page }) => {
  await page.goto("/github");
  await expect(page.locator("h1")).toContainText("Git & GitHub");

  await page.goto("/github/shortcuts");
  await expect(page.locator("h1")).toContainText("Shortcuts");

  await page.goto("/github/trending");
  await expect(page.locator("h1")).toContainText("Weekly Top 10");
});

test("homepage shows discovery sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Daily Top 5" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Weekly Top 10" })).toBeVisible();
});

test("knowledge search route works for a term", async ({ page }) => {
  await page.goto("/github/search?q=git%20push");
  await expect(page.locator("h1")).toContainText("git push");
});

test("authority pages load", async ({ page }) => {
  await page.goto("/what-is-github");
  await expect(page.locator("h1")).toContainText("Was ist GitHub");
  await page.goto("/what-is-whats-in-it");
  await expect(page.locator("h1")).toContainText("What's in it");
});

test("blog hub and an article load", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator("h1")).toContainText("Blog");
  await page.goto("/blog/merge-konflikt-loesen");
  await expect(page.locator("h1")).toContainText("Merge-Konflikt");
});

test("tools load and debugger matches an error", async ({ page }) => {
  await page.goto("/tools");
  await expect(page.locator("h1")).toContainText("Tools");

  await page.goto("/tools/debugger");
  await page.getByPlaceholder(/Fehlermeldung/).fill("git@github.com: Permission denied (publickey)");
  await expect(page.getByText("Permission denied (publickey)").first()).toBeVisible();

  await page.goto("/tools/ai-credit-calculator");
  await page.getByPlaceholder(/Text oder Prompt/).fill("Hallo Welt, das ist ein Test.");
  await expect(page.getByText(/Tokens/).first()).toBeVisible();
});

test("a knowledge detail page loads", async ({ page }) => {
  await page.goto("/github/was-ist-git");
  await expect(page.locator("h1")).toContainText("Was ist Git");
});

test("legal/trust pages load", async ({ page }) => {
  for (const [path, heading] of [
    ["/about", "Über"],
    ["/privacy", "Datenschutz"],
    ["/impressum", "Impressum"],
  ] as const) {
    await page.goto(path);
    await expect(page.locator("h1")).toContainText(heading);
  }
});

test("robots.txt and sitemap.xml respond", async ({ request }) => {
  expect((await request.get("/robots.txt")).ok()).toBeTruthy();
  expect((await request.get("/sitemap.xml")).ok()).toBeTruthy();
  expect((await request.get("/ads.txt")).ok()).toBeTruthy();
});
