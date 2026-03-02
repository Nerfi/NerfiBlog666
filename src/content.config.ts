import {
    glob
} from "astro/loaders";

//importart utilidades de astro content
import {  defineCollection } from "astro:content"
import {z} from "astro/zod"

// definir un loader y esquema para cada coleccion 
const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/blog" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date(),
        description: z.string(),
        author: z.string(),
        tags: z.array(z.string())
    })

})


export const collections = { blog };