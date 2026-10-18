const { test, expect } = require("@playwright/test");
const { preparePage, stabilizeVisuals } = require("./helpers");

test("publications Abs toggle opens and closes", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/publications/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const absButton = page.getByRole("button", { name: "Abs" }).first();
  await expect(absButton).toBeVisible();

  const panel = page.locator(".abstract.hidden").first();
  await absButton.click();
  await expect(panel).toHaveClass(/open/);

  await absButton.click();
  await expect(panel).not.toHaveClass(/open/);
});

test("publication popover works without bootstrap compat runtime", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/publications/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const popoverTrigger = page.locator('[data-toggle="popover"]').first();
  test.skip((await popoverTrigger.count()) === 0, "no popover trigger found in fixture data");

  await popoverTrigger.hover();
  await expect(page.locator(".af-popover")).toBeVisible();
});

test("site nav renders as a vertical left sidebar on desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop-only sidebar contract");

  await preparePage(page, "light");
  await page.goto("/al-folio/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  await expect(page.locator(".navbar, .navbar-brand, .navbar-toggler")).toHaveCount(0);
  await expect(page.locator(".site-nav-bar")).toBeHidden();
  await expect(page.locator(".site-nav-link")).toHaveText(["home", "news", "publications", "projects", "blog"]);

  const geometry = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll(".site-nav-item")).map((el) => el.getBoundingClientRect());
    const nav = document.querySelector(".site-nav").getBoundingClientRect();
    const main = document.querySelector("[role='main']").getBoundingClientRect();
    return {
      stacked: items.every((box, index) => index === 0 || box.top >= items[index - 1].bottom - 1),
      navRight: nav.right,
      firstLinkTop: items[0].top,
      mainLeft: main.left,
      mainTop: main.top,
    };
  });

  expect(geometry.stacked).toBeTruthy();
  expect(geometry.navRight).toBeLessThanOrEqual(geometry.mainLeft);
  // starts near the content title (container mt-5), not in a fixed top bar
  expect(Math.abs(geometry.firstLinkTop - geometry.mainTop)).toBeLessThanOrEqual(24);
});

test("hamburger bar opens a left drawer with stacked links on narrow viewports", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "narrow-viewport nav contract");

  await preparePage(page, "light");
  await page.goto("/al-folio/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  // no gem navbar markup; a sticky site-local bar naming the current page instead
  await expect(page.locator(".navbar-toggler")).toHaveCount(0);
  const bar = page.locator(".site-nav-bar");
  await expect(bar).toBeVisible();
  await expect(bar.locator(".site-nav-current")).toHaveText("home");
  expect(await page.locator(".site-header").evaluate((el) => window.getComputedStyle(el).position)).toBe("sticky");

  // drawer starts closed (off-canvas + hidden), backdrop not shown
  const toggle = page.locator(".site-nav-toggle");
  const drawer = page.locator("#site-nav");
  const backdrop = page.locator(".site-nav-backdrop");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(drawer).toBeHidden();
  await expect(backdrop).toBeHidden();

  // open: the gem's nav-toggle.js adds .show / flips aria-expanded
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(drawer).toHaveClass(/show/);
  await expect(drawer).toBeVisible();
  await expect(backdrop).toBeVisible();
  await expect(page.locator(".site-nav-link")).toHaveText(["home", "news", "publications", "projects", "blog"]);

  const geometry = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll(".site-nav-item")).map((el) => el.getBoundingClientRect());
    const nav = document.getElementById("site-nav").getBoundingClientRect();
    const bar = document.querySelector(".site-nav-bar").getBoundingClientRect();
    return {
      stacked: items.every((box, index) => index === 0 || box.top >= items[index - 1].bottom - 1),
      navLeft: nav.left,
      navTop: nav.top,
      navWidth: nav.width,
      barBottom: bar.bottom,
      viewportWidth: window.innerWidth,
    };
  });
  expect(geometry.stacked).toBeTruthy();
  expect(geometry.navLeft).toBe(0);
  expect(geometry.navTop).toBeGreaterThanOrEqual(geometry.barBottom - 1);
  expect(geometry.navWidth).toBeLessThan(geometry.viewportWidth);

  // tapping the dimmed page (outside the panel) closes it
  await backdrop.click({ position: { x: 5, y: 5 } });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(drawer).toBeHidden();
  await expect(backdrop).toBeHidden();

  // Escape also closes it
  await toggle.click();
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
});

test("repositories page renders external stat cards with deterministic fixtures", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/repositories/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const repoImages = page.locator('img[src*="github-readme-stats"], img[src*="github-profile-trophy"]');
  await expect(repoImages.first()).toBeVisible();

  const renderedCount = await repoImages.evaluateAll((images) => images.filter((img) => img.complete && img.naturalWidth > 0).length);
  expect(renderedCount).toBeGreaterThan(0);
});

test("blog page lists every post as a title/date row without pagination", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/blog/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const rows = page.locator("ul.writing-list li");
  expect(await rows.count()).toBeGreaterThan(5);

  const first = rows.first();
  await expect(first.locator(".writing-title a")).toBeVisible();
  await expect(first.locator(".writing-date")).toBeVisible();
  expect((await first.locator(".writing-date").innerText()).trim()).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/);

  // Single page: no pagination controls, descriptions or thumbnails.
  await expect(page.locator(".af-pagination")).toHaveCount(0);
  await expect(page.locator(".writing-list img")).toHaveCount(0);
});

test("active nav item shows the dot indicator and accent color", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/publications/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const active = page.locator(".site-nav-item.active");
  await expect(active).toHaveCount(1);
  await expect(active.locator(".site-nav-link")).toHaveText("publications");
  await expect(active.locator(".site-nav-link")).toHaveAttribute("aria-current", "page");

  const dot = await active.evaluate((el) => {
    const style = window.getComputedStyle(el, "::before");
    return { width: style.width, height: style.height, transform: style.transform, background: style.backgroundColor };
  });
  expect(dot.width).toBe("4px");
  expect(dot.height).toBe("4px");
  expect(dot.transform).toBe("matrix(1.25, 0, 0, 1.25, 0, 0)");
  expect(dot.background).toBe("rgb(22, 163, 74)");

  const inactiveTransform = await page
    .locator(".site-nav-item:not(.active)")
    .first()
    .evaluate((el) => window.getComputedStyle(el, "::before").transform);
  expect(inactiveTransform).toBe("matrix(0, 0, 0, 0, 0, 0)");

  const activeColor = await active.locator(".site-nav-link").evaluate((el) => window.getComputedStyle(el).color);
  expect(activeColor).toBe("rgb(22, 163, 74)");
});

test("search and theme controls are removed and the site renders light", async ({ page }) => {
  await preparePage(page, "dark"); // a stale dark localStorage preference must have no effect

  await page.goto("/al-folio/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  await expect(page.locator("#search-toggle")).toHaveCount(0);
  await expect(page.locator("#light-toggle")).toHaveCount(0);
  await expect(page.locator("ninja-keys")).toHaveCount(0);
  await expect(page.locator("progress#progress")).toHaveCount(0);

  // pins `site_theme: light` in _config.yml; adjust expectations if flipped to dark
  const rendering = await page.evaluate(() => ({
    dataTheme: document.documentElement.getAttribute("data-theme"),
    bodyBackground: window.getComputedStyle(document.body).backgroundColor,
  }));
  expect(rendering.dataTheme).toBeNull();
  expect(rendering.bodyBackground).toBe("rgb(255, 255, 255)"); // gem light theme $white-color
});

test("related posts are wrapped in a valid list", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/blog/2023/tables/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const heading = page.getByRole("heading", { name: "Enjoy Reading This Article?" });
  await expect(heading).toBeVisible();

  const relatedList = heading.locator("xpath=following::ul[1]");
  await expect(relatedList).toBeVisible();
  await expect(relatedList.locator("li").first()).toBeVisible();

  const relatedLinkWeight = await relatedList
    .locator("a")
    .first()
    .evaluate((el) => Number.parseInt(window.getComputedStyle(el).fontWeight, 10) || 400);
  expect(relatedLinkWeight).toBeLessThanOrEqual(400);
});

test("inline code uses compact normal-weight typography", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/blog/2023/sidebar-table-of-contents/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const inlineCodeStyle = await page.evaluate(() => {
    const candidate = Array.from(document.querySelectorAll("main code, [role='main'] code")).find((el) => !el.closest("pre"));
    if (!candidate) {
      return null;
    }
    const computed = window.getComputedStyle(candidate);
    const numericWeight = Number.parseInt(computed.fontWeight, 10);
    return {
      fontSize: Number.parseFloat(computed.fontSize),
      fontWeight: Number.isNaN(numericWeight) ? (computed.fontWeight === "bold" ? 700 : 400) : numericWeight,
    };
  });

  expect(inlineCodeStyle).not.toBeNull();
  expect(inlineCodeStyle.fontSize).toBeLessThan(16);
  expect(inlineCodeStyle.fontWeight).toBeLessThanOrEqual(400);
});

test("projects page renders a plain bulleted list of titles", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/projects/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const items = page.locator("ul.projects-list li a");
  expect(await items.count()).toBeGreaterThan(0);
  await expect(items.first()).toBeVisible();
  expect((await items.first().innerText()).trim()).not.toEqual("");

  // No card chrome or thumbnails: the list is titles only.
  await expect(page.locator(".projects-list .card")).toHaveCount(0);
  await expect(page.locator(".projects-list img")).toHaveCount(0);
});

test("teaching calendar toggle has pointer cursor and toggles calendar visibility", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/teaching/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const button = page.locator("#calendar-toggle-btn");
  await expect(button).toBeVisible();

  const buttonStyles = await button.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return { cursor: computed.cursor, fontSize: computed.fontSize };
  });
  expect(buttonStyles.cursor).toBe("pointer");
  expect(Number.parseFloat(buttonStyles.fontSize)).toBeGreaterThan(12);

  await button.click();
  await expect(page.locator("#calendar-container")).toBeVisible();
  await expect(button).toContainText("Hide Calendar");
});

test("toc sidebar renders with tocbot styling and data-toc-text label", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "TOC sidebar is hidden on mobile viewport");

  await preparePage(page, "light");
  await page.goto("/al-folio/blog/2023/sidebar-table-of-contents/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const tocSidebar = page.locator("#toc-sidebar");
  const tocLinks = tocSidebar.locator(".toc-link");
  await expect.poll(async () => tocLinks.count()).toBeGreaterThan(0);
  await expect(tocSidebar.getByText("Customizing")).toHaveCount(1);

  const firstLink = tocLinks.first();
  await firstLink.hover();
  const tocDecor = await firstLink.evaluate((el) => {
    const linkStyle = window.getComputedStyle(el);
    const listBorders = Array.from(document.querySelectorAll("#toc-sidebar .toc-list")).map((list) => window.getComputedStyle(list).borderLeftWidth);
    return {
      linkBorderLeftWidth: linkStyle.borderLeftWidth,
      listBorders,
    };
  });
  expect(tocDecor.linkBorderLeftWidth).toBe("0px");
  expect(tocDecor.listBorders.every((value) => value === "0px")).toBeTruthy();

  await page.getByRole("heading", { name: "Customizing Your Table of Contents" }).scrollIntoViewIfNeeded();
  await expect.poll(async () => tocSidebar.locator(".toc-link.is-active-link").count()).toBeGreaterThan(0);

  const activeDecor = await tocSidebar
    .locator(".toc-link.is-active-link")
    .first()
    .evaluate((el) => {
      const activeStyle = window.getComputedStyle(el);
      const activeMarkerStyle = window.getComputedStyle(el, "::before");
      return {
        activeColor: activeStyle.color,
        markerColor: activeMarkerStyle.backgroundColor,
      };
    });
  expect(activeDecor.markerColor).toBe(activeDecor.activeColor);
});

test("tailwind table engine provides search, pagination, and sorting in pretty tables", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/blog/2023/tables/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const interactiveTable = page.locator('table[data-search="true"]');
  await expect(interactiveTable).toBeVisible();
  await expect(interactiveTable).toHaveClass(/af-table-enhanced/);

  const searchInput = page.locator(".af-table-search").first();
  await expect(searchInput).toBeVisible();
  await searchInput.fill("Item 19");
  await expect(interactiveTable.locator("tbody tr")).toHaveCount(1);

  await searchInput.fill("");
  const sortableHeader = interactiveTable.locator('thead th[data-field="id"]');
  await sortableHeader.click();
  await sortableHeader.click();
  await expect(interactiveTable.locator("tbody tr").first().locator("td").nth(1)).toHaveText("20");
});

test("lightbox galleries open in-page modal instead of navigating away", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/blog/2024/photo-gallery/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const firstLightboxLink = page.locator("a[data-lightbox]").first();
  const firstHref = await firstLightboxLink.getAttribute("href");
  await firstLightboxLink.click();

  const overlay = page.locator(".al-lightbox-overlay");
  await expect(overlay).toHaveClass(/is-open/);
  await expect(page.locator(".al-lightbox-image")).toHaveAttribute("src", firstHref);

  const firstImageSrc = await page.locator(".al-lightbox-image").getAttribute("src");
  await page.locator(".al-lightbox-next").click();
  await expect(page.locator(".al-lightbox-image")).not.toHaveAttribute("src", firstImageSrc);

  await page.keyboard.press("Escape");
  await expect(overlay).not.toHaveClass(/is-open/);
});

test("core pages no longer emit jQuery-style runtime errors", async ({ page }) => {
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      failures.push(message.text());
    }
  });

  await preparePage(page, "light");
  const pages = ["/al-folio/", "/al-folio/projects/", "/al-folio/blog/2024/photo-gallery/", "/al-folio/blog/2023/tables/"];

  for (const target of pages) {
    await page.goto(target, { waitUntil: "networkidle" });
    await stabilizeVisuals(page);
  }

  const jqueryFailures = failures.filter((message) => /\$\s*is not defined|lightbox/i.test(message));
  expect(jqueryFailures).toEqual([]);
});
