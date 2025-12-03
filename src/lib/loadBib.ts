// src/lib/loadBib.ts
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { parse } from "@retorquere/bibtex-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 递归收集 BibTeX 值里的所有字符串叶节点
 * 用于 title / journal / year 等普通字段
 */
function collectTextParts(v: any): string[] {
  if (!v) return [];

  if (typeof v === "string") return [v];

  if (Array.isArray(v)) return v.flatMap(collectTextParts);

  if (typeof v === "object") {
    if ("literal" in v && typeof v.literal === "string") {
      return [v.literal];
    }
    if ("name" in v && typeof v.name === "string") {
      return [v.name];
    }
    if ("value" in v) {
      return collectTextParts(v.value);
    }
    return Object.values(v).flatMap(collectTextParts);
  }

  return [];
}

/** 普通字段 -> 一行干净字符串 */
function cleanText(v: any): string {
  return collectTextParts(v)
    .join(" ")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 从整个 .bib 文本里按 entry key 抓出该条的 author = { ... } 原文
 * 保留 "Last, First and Last, First ..." 的结构
 */
function extractAuthorRaw(bibContent: string, key: string): string {
  if (!key) return "";

  // 找到这个条目的开头 "@...{key,"
  const entryStart = bibContent.search(
    new RegExp(`@[^\\{]+\\{\\s*${key}\\s*,`, "i")
  );
  if (entryStart === -1) return "";

  // 从 key 之后开始找 "author"
  const afterKey = bibContent.slice(entryStart);
  const authorMatch = afterKey.match(/author\s*=\s*\{/i);
  if (!authorMatch) return "";

  const authorStartIndexInAfterKey = authorMatch.index ?? -1;
  if (authorStartIndexInAfterKey === -1) return "";

  const braceStart = authorStartIndexInAfterKey + authorMatch[0].length - 1; // 指向第一个 '{'
  let i = braceStart;
  let depth = 0;
  let inAuthor = false;

  for (; i < afterKey.length; i++) {
    const ch = afterKey[i];
    if (ch === "{") {
      depth++;
      inAuthor = true;
    } else if (ch === "}") {
      depth--;
      if (inAuthor && depth === 0) {
        // 包含内容的区间: (braceStart+1 .. i-1)
        const inside = afterKey.slice(braceStart + 1, i);
        return inside.trim();
      }
    }
  }

  return "";
}

export function loadBib(filename: string) {
  const bibPath = resolve(__dirname, "../data", filename);
  const content = fs.readFileSync(bibPath, "utf8");

  const lib = parse(content);

  return lib.entries.map((entry: any) => {
    const f = entry.fields ?? {};

    const title = cleanText(f.title);

    // ★★ 关键：作者不要 cleanText，直接从 .bib 原文中提取 ★★
    const authors = extractAuthorRaw(content, entry.key);

    const year = cleanText(f.year);
    const venue =
      cleanText(f.journal) ||
      cleanText(f.booktitle) ||
      cleanText(f.publisher);
    const link = cleanText(f.url);
    const doi = cleanText(f.doi);
    const arxiv = cleanText(f.eprint); // arXiv ID，如果有的话

    return {
      title,
      authors, // e.g. "Ong, Pio and Xu, Yicheng and Bena, Ryan M. and ..."
      year,
      venue,
      link,
      doi,
      arxiv,
      key: entry.key,
      type: entry.type,
    };
  });
}
