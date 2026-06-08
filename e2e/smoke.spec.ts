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

  // OPEN-001: /github/trending is consolidated into /repositories (permanent redirect).
  await page.goto("/github/trending");
  await page.waitForURL(/\/repositories$/, { timeout: 10_000 });
  await expect(page.locator("h1")).toContainText("Repositories entdecken");
});

test("repositories hub renders Daily/Weekly/Niche + a ranking explanation (FR-013/AC-007)", async ({ page }) => {
  await page.goto("/repositories");
  await expect(page.locator("h1")).toContainText("Repositories entdecken");
  await expect(page.getByRole("heading", { name: "Daily Top 3" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Weekly Top 10" })).toBeVisible();
  // All three discovery sections render (the Niche section heading even when its honest
  // empty-state shows — niche has no seed by design, so items only appear with real data).
  await expect(page.getByRole("heading", { name: "Interesting Growth Repositories" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Wie wird hier bewertet?" })).toBeVisible();
  // Ranking explanation mentions the >50k giant exclusion (honest discovery).
  await expect(page.getByText(/50\.000 Sterne/)).toBeVisible();
});

test("nav reaches Repositories, Calculator and Debugger (AC-009)", async ({ page }) => {
  await page.goto("/");
  // Header 'Repositories' link lands on the hub.
  await page.getByRole("link", { name: "Repositories" }).first().click();
  await page.waitForURL(/\/repositories$/, { timeout: 10_000 });
  await expect(page.locator("h1")).toContainText("Repositories entdecken");

  // Footer reaches the standalone Calculator + Debugger.
  await expect(page.getByRole("link", { name: "Rechner" })).toHaveAttribute("href", "/tools/ai-credit-calculator");
  await expect(page.getByRole("link", { name: "Debugger" })).toHaveAttribute("href", "/tools/debugger");
});

test("homepage embeds a usable Calculator and Debugger (FR-002/VCHK-001)", async ({ page }) => {
  await page.goto("/");
  // (FR-001 "no example-repo prompt line" is precisely covered by the source guard in
  // homepage-structure.test.ts; a rendered-link check here would false-positive on
  // legitimate discovery links like vercel/next.js. This test proves the usable embed.)

  // Debugger embed must be usable ON the homepage: paste a real error → match card.
  const dbg = page.getByPlaceholder(/Fehlermeldung/);
  await expect(dbg).toBeVisible();
  await dbg.fill("git@github.com: Permission denied (publickey)");
  await expect(page.getByText("Permission denied (publickey)").first()).toBeVisible();

  // Calculator embed must be usable ON the homepage: type text → token count reacts (0 → >0).
  const calc = page.getByPlaceholder(/Text oder Prompt/);
  await expect(calc).toBeVisible();
  await calc.fill("Hallo Welt, das ist ein Test mit mehreren Wörtern.");
  await expect(page.getByText(/Eingabe:\s*[1-9]/).first()).toBeVisible();

  // VCHK-003: the placeholder-pricing disclaimer is visible (no official-bill claim).
  await expect(page.getByText(/Beispielwerte/).first()).toBeVisible();
});

test("homepage shows discovery sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Daily Top 3" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Weekly Top 10" })).toBeVisible();

  // BLOCKER-002: without a real 24h delta (no DB here → seed), the Daily list must be
  // labeled a sample and must NOT claim fabricated movement.
  await expect(page.getByText(/Beispiel-Auswahl/).first()).toBeVisible();
  await expect(page.getByText(/seit gestern/)).toHaveCount(0);
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

  // SEC-006: a destructive fix (git reset --hard) shows a visible danger warning.
  await page.getByPlaceholder(/Fehlermeldung/).fill("error: Your local changes to the following files would be overwritten by merge");
  await expect(page.getByText(/⚠ Achtung/).first()).toBeVisible();
  await expect(page.getByText(/unwiderruflich/i).first()).toBeVisible();

  // SEC-006: the history-rewrite (git filter-repo) danger pattern also shows the warning.
  await page.getByPlaceholder(/Fehlermeldung/).fill("remote: error: GH001: Large files detected. File data.csv is 142.00 MB; this exceeds GitHub's file size limit of 100 MB");
  await expect(page.getByText(/⚠ Achtung/).first()).toBeVisible();
  await expect(page.getByText(/Historie neu/i).first()).toBeVisible();

  await page.goto("/tools/ai-credit-calculator");
  await page.getByPlaceholder(/Text oder Prompt/).fill("Hallo Welt, das ist ein Test.");
  await expect(page.getByText(/Tokens/).first()).toBeVisible();
  // VCHK-003: example-rate disclaimer must be boundary-verified on the standalone route too.
  await expect(page.getByText(/Beispielwerte/).first()).toBeVisible();
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
