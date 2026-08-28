import { visit } from "unist-util-visit";

const DISPLAY_CLASSES = new Set(["language-math", "math-display"]);
const INLINE_CLASSES = new Set(["language-math", "math-inline"]);
const LABEL_PATTERN = /\\label{([^{}]+)}/g;
const EQREF_PATTERN = /\\eqref{([^{}]+)}/g;
const VALID_LABEL = /^[A-Za-z0-9][A-Za-z0-9:._ -]*$/;

function hasClasses(node, required) {
  const classes = Array.isArray(node?.properties?.className)
    ? node.properties.className
    : [];
  return [...required].every((name) => classes.includes(name));
}

function mathText(node) {
  return node?.children?.map((child) => child.value ?? "").join("") ?? "";
}

function setMathText(node, value) {
  node.children = [{ type: "text", value }];
}

function anchorFor(label) {
  const slug = label
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `eq-${slug}`;
}

function fail(file, message, node) {
  if (file?.fail) file.fail(message, node);
  throw new Error(message);
}

/** Number labelled display equations and resolve eqref references before KaTeX. */
export default function rehypeEquationReferences() {
  return function transform(tree, file) {
    const labels = new Map();
    const anchors = new Set();
    let number = 0;

    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || index == null || !parent) return;

      const code = node.children?.find(
        (child) =>
          child.type === "element" &&
          child.tagName === "code" &&
          hasClasses(child, DISPLAY_CLASSES),
      );
      if (!code) return;

      const source = mathText(code);
      const matches = [...source.matchAll(LABEL_PATTERN)];
      if (matches.length === 0) return;
      if (matches.length > 1) {
        fail(file, "A display equation may contain only one \\label", code);
      }
      if (/\\tag\s*{/.test(source)) {
        fail(file, "A labelled display equation cannot also define \\tag", code);
      }

      const label = matches[0][1].trim();
      if (!VALID_LABEL.test(label)) {
        fail(file, `Invalid equation label: ${label}`, code);
      }
      if (labels.has(label)) {
        fail(file, `Duplicate equation label: ${label}`, code);
      }

      const anchor = anchorFor(label);
      if (anchor === "eq-" || anchors.has(anchor)) {
        fail(file, `Equation labels produce a duplicate anchor: ${label}`, code);
      }

      number += 1;
      anchors.add(anchor);
      labels.set(label, { anchor, number });
      setMathText(
        code,
        `${source.replace(LABEL_PATTERN, "").trim()}\\tag{${number}}`,
      );

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: {
          id: anchor,
          className: ["equation-anchor"],
          dataEquationNumber: String(number),
        },
        children: [node],
      };
    });

    visit(tree, "element", (node) => {
      if (node.tagName !== "code" || !hasClasses(node, INLINE_CLASSES)) return;

      const source = mathText(node);
      if (/\\label{/.test(source)) {
        fail(file, "Equation labels are only allowed in display math", node);
      }

      const resolved = source.replace(EQREF_PATTERN, (_match, rawLabel) => {
        const label = rawLabel.trim();
        const target = labels.get(label);
        if (!target) {
          fail(file, `Unknown equation label: ${label}`, node);
        }
        return `\\href{#${target.anchor}}{\\text{(${target.number})}}`;
      });
      setMathText(node, resolved);
    });
  };
}

export { anchorFor };
