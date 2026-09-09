/**
 * Number Markdown headings relative to the shallowest heading in a document.
 * Heading-depth jumps are compressed to the next available level so numbering
 * never contains empty segments such as 1.0.1.
 *
 * @template {{ depth: number }} T
 * @param {T[]} headings
 * @returns {(T & { number: string, relativeLevel: number })[]}
 */
export function numberHeadings(headings) {
  if (headings.length === 0) return [];

  const baseDepth = Math.min(...headings.map((heading) => heading.depth));
  /** @type {number[]} */
  const counters = [];
  let previousLevel = 0;

  return headings.map((heading) => {
    const desiredLevel = Math.max(1, heading.depth - baseDepth + 1);
    const relativeLevel = Math.min(desiredLevel, previousLevel + 1 || 1);

    if (relativeLevel > previousLevel) {
      counters.push(1);
    } else {
      counters.length = relativeLevel;
      counters[relativeLevel - 1] = (counters[relativeLevel - 1] ?? 0) + 1;
    }

    previousLevel = relativeLevel;
    return {
      ...heading,
      number: counters.join("."),
      relativeLevel,
    };
  });
}

/**
 * @template {{ relativeLevel: number }} T
 * @param {T[]} headings
 * @returns {(T & { children: any[] })[]}
 */
export function buildHeadingTree(headings) {
  /** @type {(T & { children: any[] })[]} */
  const roots = [];
  /** @type {(T & { children: any[] })[]} */
  const stack = [];

  for (const heading of headings) {
    const node = { ...heading, children: [] };
    while (stack.length >= heading.relativeLevel) stack.pop();

    const parent = stack.at(-1);
    if (parent) parent.children.push(node);
    else roots.push(node);

    stack.push(node);
  }

  return roots;
}
