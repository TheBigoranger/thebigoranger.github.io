import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/project/",
  "/project/grid-lmia/",
  "/project/3d-models/",
  "/blog/1/",
  "/blog/introducing-grid-lmia/",
  "/blog/on-dynamics/",
  "/blog/some-math-facts-algebra/",
  "/blog/some-math-facts-control/",
];

test("primary routes render without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.ok(), route).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /https:\/\/www\.ethanyxu\.com\//);
  }
  expect(errors).toEqual([]);
});

test("equation references navigate to stable anchors", async ({ page }) => {
  await page.goto("/blog/some-math-facts-algebra/");
  const reference = page.locator('a[href="#eq-cone-normal"]').first();
  const targetTag = page.locator("#eq-cone-normal .katex-html > .tag");
  await expect(reference).toHaveText(await targetTag.innerText());
  await reference.click();
  await expect(page).toHaveURL(/#eq-cone-normal$/);
  await expect(page.locator("#eq-cone-normal")).toBeVisible();
});

test("long GriD-LMIA equations keep their tags after the formula", async ({ page }) => {
  await page.goto("/blog/introducing-grid-lmia/");
  const equation = page.locator("#eq-pd-lmi-problem");
  const tag = equation.locator(".katex-html > .tag");
  const formulaRows = equation.locator(".katex-html > .base");
  await expect(tag).toHaveText("(1)");
  const tagBox = await tag.boundingBox();
  expect(tagBox).not.toBeNull();

  const rowBoxes = await formulaRows.evaluateAll((rows) =>
    rows.map((row) => {
      const rect = row.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    }),
  );
  const overlapsTag = rowBoxes.some(
    (row) => row.left < tagBox!.x + tagBox!.width && row.right > tagBox!.x,
  );
  expect(overlapsTag).toBe(false);
  expect(tagBox!.x).toBeGreaterThanOrEqual(Math.max(...rowBoxes.map((row) => row.right)));
  await expect(equation.locator(".katex-display")).toHaveCSS("overflow-x", "auto");

  await expect(page.locator(".certificate-flow")).toBeVisible();
  const code = page.locator("pre.astro-code code").first();
  await expect(code).toContainText("yalmip");
  const background = await code.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(background).toBe("rgba(0, 0, 0, 0)");

  await page.goto("/project/grid-lmia/");
  await expect(page.locator(".project-problem-equation .katex-display")).toBeVisible();
});

test("project routes isolate Three.js and format loaders stay lazy", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/project/", { waitUntil: "networkidle" });
  expect(requests.some((url) => /ModelBrowser|STLModel|FBXModel|GLBModel/.test(url))).toBeFalsy();

  requests.length = 0;
  await page.goto("/project/grid-lmia/", { waitUntil: "networkidle" });
  expect(requests.some((url) => /ModelBrowser|STLModel|FBXModel|GLBModel/.test(url))).toBeFalsy();

  requests.length = 0;
  await page.goto("/project/3d-models/", { waitUntil: "networkidle" });
  expect(requests.some((url) => /ModelBrowser/.test(url))).toBeTruthy();
  expect(requests.some((url) => /STLModel|OBJModel|PLYModel|FBXModel|GLBModel/.test(url))).toBeFalsy();

  await page.getByRole("button", { name: "snowboard_vise.STL" }).click();
  await expect(page.locator("canvas")).toBeVisible();
  await expect.poll(() => requests.some((url) => /STLModel/.test(url))).toBeTruthy();
  expect(requests.some((url) => /OBJModel|PLYModel|FBXModel|GLBModel/.test(url))).toBeFalsy();
});

test("navigation exposes an active page on desktop and mobile", async ({ page, isMobile }) => {
  await page.goto("/project/grid-lmia/");
  if (isMobile) await page.getByLabel("Open navigation").click();
  await expect(page.locator('a[aria-current="page"]')).toHaveText("Projects");
});

test("blog routes lock light mode and restore the saved preference after navigation", async ({ page, isMobile }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto("/blog/1/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator('[data-toggle-theme]')).toHaveCount(0);

  if (isMobile) await page.getByLabel("Open navigation").click();
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("blog index renders an open article stream with full metadata", async ({ page }) => {
  await page.goto("/blog/1/");
  const posts = page.locator(".blog-stream-item");

  await expect(posts).toHaveCount(4);
  await expect(posts.first().locator("h2")).toHaveText("Introducing GriD-LMIA");
  await expect(posts.first().locator("p")).toHaveText(
    "An introduction to GriD-LMIA, a MATLAB toolbox for constructing and certifying parameter-dependent LMIs on boxes.",
  );
  await expect(posts.first().locator(".blog-tags span")).toHaveCount(3);
  await expect(page.getByText("Linear Algebra", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Read Introducing GriD-LMIA/ })).toContainText("Read article");
  await expect(page.locator('.blog-pagination [aria-current="page"]')).toHaveText("1 / 1");
});

test("article and table of contents share numbered stable anchors", async ({ page, isMobile }) => {
  await page.goto("/blog/some-math-facts-algebra/");
  const heading = page.locator('.blog-prose [data-heading-number="1"]').first();
  const headingId = await heading.getAttribute("id");

  expect(headingId).toBe("norm-comparisons");
  await expect(heading.locator('.heading-number[aria-hidden="true"]')).toHaveAttribute("data-number", "1");
  await expect(page.locator(`[data-toc-link][data-toc-slug="${headingId}"]`).first()).toContainText("1.");
  if (isMobile) {
    await page.getByRole("button", { name: "Open table of contents" }).click();
    await page.locator("#blog-toc-dialog").locator(`a[href="#${headingId}"]`).click();
  } else {
    await page.locator(".blog-toc-desktop").locator(`a[href="#${headingId}"]`).click();
  }
  await expect(page).toHaveURL(new RegExp(`#${headingId}$`));

  const equationReference = page.locator('a[href="#eq-cone-normal"]').first();
  const equationTag = page.locator("#eq-cone-normal .katex-html > .tag");
  await expect(equationReference).toHaveText(await equationTag.innerText());
});

test("desktop table of contents stays sticky and follows reading position", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Desktop-only persistent table of contents");
  await page.goto("/blog/some-math-facts-algebra/");

  const toc = page.locator(".blog-toc-desktop");
  await expect(toc).toBeVisible();
  await expect(toc).toHaveCSS("position", "sticky");
  await expect(toc.locator('[data-toc-link][aria-current="location"]')).toHaveCount(1);

  const target = page.locator('.blog-prose [data-heading-number="4"]');
  await target.evaluate((element) => {
    const top = element.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "instant" });
  });
  await expect.poll(async () => toc.locator('[data-toc-link][aria-current="location"]').getAttribute("data-toc-number"))
    .toBe("4");
  await expect.poll(async () => Number(await toc.locator('[role="progressbar"]').getAttribute("aria-valuenow")))
    .toBeGreaterThan(0);
});

test("mobile table of contents supports every close path", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile-only table of contents drawer");
  await page.goto("/blog/some-math-facts-control/");

  const trigger = page.getByRole("button", { name: "Open table of contents" });
  const dialog = page.locator("#blog-toc-dialog");
  await expect(dialog).not.toHaveAttribute("open", "");

  await trigger.click();
  await expect(dialog).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toHaveAttribute("open", "");

  await trigger.click();
  await page.getByRole("button", { name: "Close table of contents" }).click();
  await expect(dialog).not.toHaveAttribute("open", "");

  await trigger.click();
  await dialog.locator('a[href="#discrete-time-lyapunov-stability"]').click();
  await expect(dialog).not.toHaveAttribute("open", "");
  await expect(page).toHaveURL(/#discrete-time-lyapunov-stability$/);

  await trigger.click();
  await dialog.click({ position: { x: 8, y: 120 } });
  await expect(dialog).not.toHaveAttribute("open", "");
});

test("proof details preserve keyboard behavior, nesting, and contained math", async ({ page }) => {
  await page.goto("/blog/some-math-facts-control/");
  const outer = page.locator(".blog-prose details").filter({
    has: page.getByText("Proof of the continuous-time Lyapunov theorem", { exact: true }),
  }).first();
  const summary = outer.locator(":scope > summary");
  const converse = outer.locator(":scope > details").filter({
    has: page.getByText("Converse direction", { exact: true }),
  }).first();

  await expect(outer).toHaveAttribute("open", "");
  await expect(converse).not.toHaveAttribute("open", "");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(outer).not.toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(outer).toHaveAttribute("open", "");
  await expect(outer.locator(".katex-display").first()).toBeVisible();
  expect(await outer.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy();
});
