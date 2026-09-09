import assert from "node:assert/strict";
import test from "node:test";
import { buildHeadingTree, numberHeadings } from "../src/lib/heading-numbers.mjs";
import rehypeHeadingNumbers from "../src/lib/rehype-heading-numbers.mjs";

const headings = (...depths) => depths.map((depth, index) => ({
  depth,
  slug: `section-${index + 1}`,
  text: `Section ${index + 1}`,
}));

test("numbers same-level headings relative to the shallowest depth", () => {
  const result = numberHeadings(headings(2, 2, 2));
  assert.deepEqual(result.map(({ number }) => number), ["1", "2", "3"]);
  assert.deepEqual(result.map(({ relativeLevel }) => relativeLevel), [1, 1, 1]);
});

test("numbers six levels and resets descendants when returning upward", () => {
  const result = numberHeadings(headings(1, 2, 3, 4, 5, 6, 3, 1));
  assert.deepEqual(result.map(({ number }) => number), [
    "1", "1.1", "1.1.1", "1.1.1.1", "1.1.1.1.1", "1.1.1.1.1.1", "1.1.2", "2",
  ]);
});

test("compresses skipped Markdown depths instead of emitting zero segments", () => {
  const result = numberHeadings(headings(2, 4, 6, 3, 5));
  assert.deepEqual(result.map(({ number }) => number), ["1", "1.1", "1.1.1", "1.2", "1.2.1"]);
  assert.ok(result.every(({ number }) => !number.includes(".0")));
});

test("supports documents whose first visible level starts at any depth", () => {
  assert.deepEqual(
    numberHeadings(headings(4, 5, 4)).map(({ number }) => number),
    ["1", "1.1", "2"],
  );
});

test("builds a nested table-of-contents tree from the same relative levels", () => {
  const tree = buildHeadingTree(numberHeadings(headings(2, 3, 4, 3, 2)));
  assert.equal(tree.length, 2);
  assert.equal(tree[0].children.length, 2);
  assert.equal(tree[0].children[0].children[0].number, "1.1.1");
  assert.equal(tree[0].children[1].number, "1.2");
});

test("rehype injection preserves anchors and hides visual numbers from assistive technology", () => {
  const node = {
    type: "element",
    tagName: "h2",
    properties: { id: "stable-anchor" },
    children: [{ type: "text", value: "A heading" }],
  };
  const tree = { type: "root", children: [node] };

  rehypeHeadingNumbers()(tree);

  assert.equal(node.properties.id, "stable-anchor");
  assert.equal(node.properties.dataHeadingNumber, "1");
  assert.equal(node.properties.dataHeadingLevel, "1");
  assert.deepEqual(node.children[0], {
    type: "element",
    tagName: "span",
    properties: { ariaHidden: "true", className: ["heading-number"], dataNumber: "1" },
    children: [],
  });
  assert.equal(node.children[1].value, "A heading");
});

test("handles an article without headings", () => {
  assert.deepEqual(numberHeadings([]), []);
  assert.deepEqual(buildHeadingTree([]), []);
});
