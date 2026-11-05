import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { site } from '@config/site';

// cover is a local image next to index.md. image() makes Astro optimise it and check the file exists at build.
const blog = defineCollection({
  loader: glob({ pattern: '{es,en}/**/*.md', base: './src/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default(site.author),
    tags: z.array(z.string()).default([]),
    cover: image().optional(),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: '{es,en}.md', base: './src/about' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, about };
