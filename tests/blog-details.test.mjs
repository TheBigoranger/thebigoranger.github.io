import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const contentURL = (name) => new URL(`../src/content/BlogPosts/${name}`, import.meta.url);

test("the two Math Facts articles expose the four approved proof folds", async () => {
  const [algebra, control] = await Promise.all([
    readFile(contentURL("some-math-facts-algebra.md"), "utf8"),
    readFile(contentURL("some-math-facts-control.md"), "utf8"),
  ]);

  assert.match(algebra, /<details open>\s*<summary>Proof of the norm comparison<\/summary>/);
  assert.match(algebra, /<details open>\s*<summary>Proof of the trace criterion<\/summary>/);
  assert.match(control, /<details open>\s*<summary>Proof of the continuous-time Lyapunov theorem<\/summary>/);
  assert.match(control, /<details open>\s*<summary>Proof of the forward direction<\/summary>/);
  assert.equal((`${algebra}\n${control}`.match(/<details open>/g) ?? []).length, 4);
});

test("the continuous-time converse remains a nested, initially closed fold", async () => {
  const control = await readFile(contentURL("some-math-facts-control.md"), "utf8");
  assert.match(
    control,
    /<details open>[\s\S]*?<details>\s*<summary>Converse direction<\/summary>[\s\S]*?<\/details>\s*<\/details>/,
  );
  assert.doesNotMatch(control, /<details open>\s*<summary>Converse direction<\/summary>/);
});

test("corrected math wording is retained and known erroneous forms do not reappear", async () => {
  const [algebra, control] = await Promise.all([
    readFile(contentURL("some-math-facts-algebra.md"), "utf8"),
    readFile(contentURL("some-math-facts-control.md"), "utf8"),
  ]);

  assert.match(algebra, /squared Frobenius norm, not the square of/);
  assert.match(control, /It is not true\s+that \*every\* nonzero initial condition must fail to converge/);
  assert.doesNotMatch(algebra, /\\operatorname\{tr\}\(P\^\\top Q\)\^2\s*=/);
  assert.doesNotMatch(control, /every nonzero initial condition does not converge/);
});
