import assert from "node:assert/strict";
import test from "node:test";
import { VFile } from "vfile";
import rehypeEquationReferences from "../src/lib/rehype-equation-references.mjs";

const text = (value) => ({ type: "text", value });
const code = (value, mode) => ({
  type: "element",
  tagName: "code",
  properties: { className: ["language-math", mode] },
  children: [text(value)],
});
const display = (value) => ({
  type: "element",
  tagName: "pre",
  properties: {},
  children: [code(value, "math-display")],
});
const inline = (value) => code(value, "math-inline");
const root = (...children) => ({ type: "root", children });

function transform(tree) {
  rehypeEquationReferences()(tree, new VFile({ path: "post.md" }));
  return tree;
}

test("numbers labelled equations and resolves forward references", () => {
  const tree = transform(
    root(
      inline("\\eqref{second}"),
      display("a=b \\label{first}"),
      display("c=d \\label{second}"),
      inline("x+\\eqref{first}"),
    ),
  );

  assert.equal(tree.children[1].properties.id, "eq-first");
  assert.equal(tree.children[2].properties.id, "eq-second");
  assert.equal(tree.children[1].children[0].children[0].children[0].value, "a=b\\tag{1}");
  assert.equal(tree.children[0].children[0].value, "\\href{#eq-second}{\\text{(2)}}");
  assert.equal(tree.children[3].children[0].value, "x+\\href{#eq-first}{\\text{(1)}}");
});

test("leaves unlabelled display math unnumbered", () => {
  const tree = transform(root(display("a=b")));
  assert.equal(tree.children[0].tagName, "pre");
  assert.equal(tree.children[0].children[0].children[0].value, "a=b");
});

test("rejects duplicate labels", () => {
  assert.throws(
    () => transform(root(display("a=b \\label{x}"), display("c=d \\label{x}"))),
    /Duplicate equation label/,
  );
});

test("rejects unresolved references", () => {
  assert.throws(() => transform(root(inline("\\eqref{missing}"))), /Unknown equation label/);
});

test("rejects unsafe or ambiguous labels", () => {
  assert.throws(() => transform(root(display("a=b \\label{bad\/label}"))), /Invalid equation label/);
  assert.throws(() => transform(root(display("a=b \\label{x} \\label{y}"))), /only one/);
});
