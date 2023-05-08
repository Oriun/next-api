import { api } from "@/lib";
import { z } from "zod";

/* Decorator doesn't work in edge so we use wrapper instead */
const schemas = {
    query: z.object({
        name: z.string().optional()
    })
}
export const GET = api((_ctx, _req) => {
    return `Hello world from ${process.env.NEXT_RUNTIME} runtime!`;
}, schemas)

export const runtime = "edge"