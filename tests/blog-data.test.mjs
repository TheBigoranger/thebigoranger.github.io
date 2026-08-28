import assert from "node:assert/strict";
import test from "node:test";
import { blogDateISO, compareBlogPosts, formatBlogDate } from "../src/lib/blog.ts";
import { projects } from "../src/data/projects.ts";

const post = (id, iso) => ({ id, data: { date: new Date(`${iso}T00:00:00Z`) } });

test("blog sorting is newest-first with a stable id tie-break", () => {
  const input = [post("z-post", "2025-01-22"), post("a-post", "2025-01-22"), post("new", "2026-01-01")];
  assert.deepEqual(input.sort(compareBlogPosts).map((item) => item.id), ["new", "a-post", "z-post"]);
});

test("blog dates share one UTC representation", () => {
  const date = new Date("2025-05-09T14:35:46Z");
  assert.equal(blogDateISO(date), "2025-05-09");
  assert.equal(formatBlogDate(date), "May 9, 2025");
});

test("project records expose unique slugs and required links", () => {
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  for (const project of projects) {
    assert.ok(project.title);
    assert.ok(project.summary);
    assert.ok(project.links.length >= 1);
    for (const link of project.links) assert.match(link.href, /^(\/|https:\/\/)/);
  }
});
