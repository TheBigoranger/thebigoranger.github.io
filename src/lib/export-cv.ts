import fs from "fs";
import path from "path";

import {
  links,
  experiences,
  education,
  presentations,
  skills,
  selfDescription,
  awards,
} from "../data/cv_plain";

// ======================
// Date parsing + sorting
// ======================

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

function parseStartMonthIndex(time: string): number {
  const re = /([A-Za-z]{3,9})\s+(\d{4})/;
  const m = time?.match(re);
  if (!m) return 0;

  const monthKey = m[1].slice(0, 3).toLowerCase();
  const month = MONTH_INDEX[monthKey] ?? 1;
  const year = parseInt(m[2], 10) || 0;

  return year * 12 + month;
}

const sortByTimeDescending = <T extends { time: string }>(arr: T[]): T[] =>
  arr
    .slice()
    .sort((a, b) => parseStartMonthIndex(b.time) - parseStartMonthIndex(a.time));

// ======================
// Dynamic experience grouping by tag
// ======================

type ExperienceLike = { time: string; tag?: string };

function slugifyTag(tag: unknown): string {
  const raw = String(tag ?? "").trim().toLowerCase();
  const slug = raw.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return slug || "untagged";
}

function groupExperiencesByTag<T extends ExperienceLike>(items: T[]) {
  const buckets: Record<string, T[]> = {};

  for (const e of items ?? []) {
    const key = `${slugifyTag((e as any).tag)}Experiences`;
    (buckets[key] ??= []).push(e);
  }

  for (const key of Object.keys(buckets)) {
    buckets[key] = sortByTimeDescending(buckets[key]);
  }

  return buckets;
}

// ======================
// LaTeX escaping for links.tex
// ======================

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

const experiencesSorted = sortByTimeDescending(experiences as any[]);
const experienceSections = groupExperiencesByTag(experiencesSorted as any[]);

const cvData = {
  // keep legacy field
  experiences: experiencesSorted,

  // dynamic sections like academicExperiences/workExperiences/...
  ...experienceSections,

  education: sortByTimeDescending(education),
  presentations: sortByTimeDescending(presentations),
  skills,
  selfDescription,
  links,
  awards,
};

const jsonPath = path.join(targetDir, "cv_plain.json");
fs.writeFileSync(jsonPath, JSON.stringify(cvData, null, 2), "utf-8");
console.log(`Wrote cv_plain.json to: ${jsonPath}`);

// ======================
// ✅ Restore links.tex output
// ======================

const linksTexPath = path.join(targetDir, "links.tex");

const linksTex = (links ?? [])
  .map((l: any) => {
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

console.log("Export complete: cv_plain.json + links.tex + Mypaper.bib");

