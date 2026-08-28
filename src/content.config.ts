import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/BlogPosts",
    }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        excerpt: z.string(),
        tags: z.array(z.string()).default([]),
    }),
});
export const collections = { blog };
