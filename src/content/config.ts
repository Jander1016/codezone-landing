import { defineCollection, z } from "astro:content";

const processCollection = defineCollection({
  schema: z.object({
    image: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  process: processCollection,
};