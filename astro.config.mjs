// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import sitemap from "@astrojs/sitemap";
import rehypeEquationReferences from "./src/lib/rehype-equation-references.mjs";

// https://astro.build/config
export default defineConfig({
    integrations: [react(), sitemap()],
    markdown: {
        processor: unified({
            remarkPlugins: [remarkMath],
            rehypePlugins: [
                rehypeEquationReferences,
                [
                    rehypeKatex,
                    {
                        strict: "warn",
                        trust: (/** @type {{ command: string, protocol: string, url?: string }} */ context) =>
                            typeof context.url === "string" &&
                            context.command === "\\href" &&
                            context.protocol === "_relative" &&
                            context.url.startsWith("#eq-"),
                    },
                ],
            ],
        }),
    },
    vite: {
        plugins: [tailwindcss()],
    },
    site: "https://www.ethanyxu.com",
});
