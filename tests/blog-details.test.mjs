import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const contentURL = (name) => new URL(`../src/content/BlogPosts/${name}`, import.meta.url);

test("the Math Facts articles keep primary proofs expanded and subproofs foldable", async () => {
  const [algebra, control] = await Promise.all([
    readFile(contentURL("some-math-facts-algebra.md"), "utf8"),
    readFile(contentURL("some-math-facts-control.md"), "utf8"),
  ]);

  assert.match(algebra, /<details open>\s*<summary>Proof of the norm comparison<\/summary>/);
  assert.match(algebra, /<details open>\s*<summary>Proof of the trace criterion<\/summary>/);
  assert.match(algebra, /<details open>\s*<summary>Proof of the bipolar theorem<\/summary>/);
  assert.match(algebra, /<details open>\s*<summary>Proof of the normal-cone identity<\/summary>/);
  assert.match(control, /<details open>\s*<summary>Proof of the continuous-time Lyapunov inequality<\/summary>/);
  assert.match(control, /<details open>\s*<summary>Proof of the continuous-time Lyapunov theorem<\/summary>/);
  assert.match(control, /<details open>\s*<summary>Proof of the discrete-time Lyapunov inequality<\/summary>/);
  assert.match(control, /<details open>\s*<summary>Proof of the discrete-time Lyapunov theorem<\/summary>/);
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
test("migrated posts retain the Hexo article structure and detailed derivations", async () => {
  const [algebra, control, dynamics] = await Promise.all([
    readFile(contentURL("some-math-facts-algebra.md"), "utf8"),
    readFile(contentURL("some-math-facts-control.md"), "utf8"),
    readFile(contentURL("on-dynamics.md"), "utf8"),
  ]);

  for (const marker of [
    "## Norm comparisons",
    "## Cone",
    "### Bipolar theorem",
    "### Normal cone",
    "## Positive semidefinite matrices",
    "## Linear matrix inequalities and semidefinite programming",
  ]) assert.ok(algebra.includes(marker), `missing algebra marker: ${marker}`);

  for (const marker of [
    "#### Lyapunov inequality",
    "Hurwitz stability implies the inequality: Jordan construction",
    "Schur stability implies the inequality: complex Jordan construction",
    "Approximate the left half-plane with a large circle",
    "Recover the infinitesimal inequality from the matrix exponential",
    "Euler approximation",
    "From the left half-plane to the unit disk",
    "Matrix logarithm viewpoint and its limitation",
    "From the unit disk back to the left half-plane",
  ]) assert.ok(control.includes(marker), `missing control marker: ${marker}`);

  assert.match(dynamics, /## Lagrangian mechanics[\s\S]*### Euler–Lagrange equation and generalized force/);
  assert.match(dynamics, /\\partial\\dot r_i[\s\S]*\\partial\\dot q_j/);
});
