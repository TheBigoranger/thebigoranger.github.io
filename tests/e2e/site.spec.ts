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
  await expect(reference).toHaveText("(3)");
  await reference.click();
  await expect(page).toHaveURL(/#eq-cone-normal$/);
  await expect(page.locator("#eq-cone-normal")).toBeVisible();
});

test("equation tags align right and GriD-LMIA content remains readable", async ({ page }) => {
  await page.goto("/blog/introducing-grid-lmia/");
  const equation = page.locator("#eq-pd-lmi-problem");
  const tag = equation.locator(".katex-html > .tag");
  await expect(tag).toHaveText("(1)");
  const equationBox = await equation.boundingBox();
  const tagBox = await tag.boundingBox();
  expect(equationBox).not.toBeNull();
  expect(tagBox).not.toBeNull();
  expect(Math.abs(equationBox!.x + equationBox!.width - tagBox!.x - tagBox!.width)).toBeLessThan(8);

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
