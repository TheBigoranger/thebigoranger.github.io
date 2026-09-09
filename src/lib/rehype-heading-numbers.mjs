import { numberHeadings } from "./heading-numbers.mjs";

const headingPattern = /^h([1-6])$/;

function visit(node, headings) {
  if (!node || typeof node !== "object") return;

  const match = headingPattern.exec(node.tagName ?? "");
  if (match) headings.push({ depth: Number(match[1]), node });

  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child, headings);
  }
}

export default function rehypeHeadingNumbers() {
  return (tree) => {
    const headings = [];
    visit(tree, headings);

    for (const heading of numberHeadings(headings)) {
      const { node, number, relativeLevel } = heading;
      node.properties ??= {};
      node.properties.dataHeadingNumber = number;
      node.properties.dataHeadingLevel = String(relativeLevel);
      node.children.unshift({
        type: "element",
        tagName: "span",
        properties: {
          ariaHidden: "true",
          className: ["heading-number"],
          dataNumber: number,
        },
        children: [],
      });
    }
  };
}
