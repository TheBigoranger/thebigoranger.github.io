import fs from "fs";
import path from "path";

import {
  experiences,
  education,
  presentations,
  skills,
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
 * Parse the *start* date from a "time" string into a sortable number.
 *
 * Supports things like:
 *  - "Sep 2021 - Now"
 *  - "Jan 2020 - Mar 2020"
 *  - "Sep 2016 - Jun 2020"
 *  - "April 2025"
 *  - "Dec 2022"
 *  - "Jul 2024"
 *  - "Oct 2019"
 */
function parseStartMonthIndex(time: string): number {
  // Grab the first "<Month> <Year>" pattern.
  // Accept 3–9 letters for the month name (so "Apr", "April", "September", etc.).
  const re = /([A-Za-z]{3,9})\s+(\d{4})/;
  const m = time.match(re);
  if (!m) return 0; // fallback for unexpected formats

  const monthKey = m[1].slice(0, 3).toLowerCase(); // use first 3 letters
  const month = MONTH_INDEX[monthKey] ?? 1;
  const year = parseInt(m[2], 10) || 0;

  // Encode as "year * 12 + month" → sortable chronologically
  return year * 12 + month;
}

/**
 * Generic sorter for arrays with a "time" field.
 * Sorts from newest → oldest (descending).
 */
const sortByTimeDescending = <T extends { time: string }>(arr: T[]): T[] =>
  arr
    .slice() // avoid mutating original array
    .sort(
      (a, b) => parseStartMonthIndex(b.time) - parseStartMonthIndex(a.time),
    );

// ======================
// Target directory
// ======================

// Absolute path on your server for the CV files
const targetDir = "/var/www/CV-Yicheng-Xu";

if (!fs.existsSync(targetDir)) {
  throw new Error(`Target directory does not exist: ${targetDir}`);
}

// ======================
// Build sorted cv_plain.json
// ======================

const cvData = {
  // Sort ALL time-based sections from new → old
  experiences: sortByTimeDescending(experiences),
  education: sortByTimeDescending(education),
  presentations: sortByTimeDescending(presentations),

  // Skills have no time field; keep defined order
  skills,
};

const jsonPath = path.join(targetDir, "cv_plain.json");

fs.writeFileSync(jsonPath, JSON.stringify(cvData, null, 2), "utf-8");
console.log(`Wrote cv_plain.json to: ${jsonPath}`);

// ======================
// Copy Mypaper.bib
// ======================

// Assumes you run this script from the project root, e.g. /var/www/Portfolio
const projectRoot = process.cwd();
const bibSource = path.join(projectRoot, "src", "data", "Mypaper.bib");
const bibTarget = path.join(targetDir, "Mypaper.bib");

if (!fs.existsSync(bibSource)) {
  throw new Error(`Mypaper.bib not found at: ${bibSource}`);
}

fs.copyFileSync(bibSource, bibTarget);
console.log(`Copied Mypaper.bib → ${bibTarget}`);

console.log("Export complete: sorted cv_plain.json + Mypaper.bib");

