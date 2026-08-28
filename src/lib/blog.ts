import type { CollectionEntry } from "astro:content";

export type BlogEntry = CollectionEntry<"blog">;

export function compareBlogPosts(a: BlogEntry, b: BlogEntry): number {
  const byDate = b.data.date.getTime() - a.data.date.getTime();
  return byDate || a.id.localeCompare(b.id, "en");
}

export function blogDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatBlogDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
