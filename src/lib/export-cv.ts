import fs from "fs";
import path from "path";

import {
  links,
  experiences,
  education,
  presentations,
  skills,
  selfDescription,
} from "../data/cv_plain";

// ======================
// Date parsing + sorting
// ======================

// 3-letter month index
const MONTH_INDEX: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

/**
 * Parse the start date from a "time" string into a sortable number.
 */
function parseStartMonthIndex(time: string): number {
  const re = /([A-Za-z]{3,9})\s+(\d{4})/;
  const m = time.match(re);
  if (!m) return 0;

  const monthKey = m[1].slice(0, 3).toLowerCase();
  const month = MONTH_INDEX[monthKey] ?? 1;
  const year = parseInt(m[2], 10) || 0;

  return year * 12 + month;
}

/**
 * Generic sorter: newest → oldest
 */
const sortByTimeDescending = <T extends { time: string }>(arr: T[]): T[] =>
  arr
    .slice()
    .sort((a, b) => parseStartMonthIndex(b.time) - parseStartMonthIndex(a.time));

// ======================
// LaTeX escaping helpers
// ======================

/**
 * Escape LaTeX special chars in visible text.
 */
function escapeLatexText(s: string): string {
  return s
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}");
}

/**
 * Escape minimally for \href{...}{...} URL argument.
 * In practice, most URLs are safe, but '%' and '#' commonly break TeX.
 */
function escapeLatexUrl(url: string): string {
  return url
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/%/g, "\\%")
    .replace(/#/g, "\\#")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}");
}

// ======================
// Target directory
// ======================

const targetDir = "/var/www/CV-Yicheng-Xu";

if (!fs.existsSync(targetDir)) {
  throw new Error(`Target directory does not exist: ${targetDir}`);
}

// ======================
// Build sorted cv_plain.json
// ======================

const cvData = {
  experiences: sortByTimeDescending(experiences),
  education: sortByTimeDescending(education),
  presentations: sortByTimeDescending(presentations),
  skills,
  selfDescription, // keep raw selfDescription in JSON (text + links), LaTeX will handle linking
  links,
};

const jsonPath = path.join(targetDir, "cv_plain.json");
fs.writeFileSync(jsonPath, JSON.stringify(cvData, null, 2), "utf-8");
console.log(`Wrote cv_plain.json to: ${jsonPath}`);

// ======================
// Write links.tex
// ======================

const linksTexPath = path.join(targetDir, "links.tex");

// one \href per line
const linksTex = (links ?? [])
  .map((l) => {
    const url = escapeLatexUrl(String(l.url ?? "").trim());
    const text = escapeLatexText(String(l.text ?? "").trim());
    if (!url || !text) return "";
    return `\\LinkAdd{${url}}{${text}}`;
  })
  .filter(Boolean)
  .join("\n")
  .concat("\n");

fs.writeFileSync(linksTexPath, linksTex, "utf-8");
console.log(`Wrote links.tex to: ${linksTexPath}`);

// ======================
// Copy Mypaper.bib
// ======================

const projectRoot = process.cwd();
const bibSource = path.join(projectRoot, "src", "data", "Mypaper.bib");
const bibTarget = path.join(targetDir, "Mypaper.bib");

if (!fs.existsSync(bibSource)) {
  throw new Error(`Mypaper.bib not found at: ${bibSource}`);
}

fs.copyFileSync(bibSource, bibTarget);
console.log(`Copied Mypaper.bib → ${bibTarget}`);

console.log("Export complete: sorted cv_plain.json + links.tex + Mypaper.bib");

