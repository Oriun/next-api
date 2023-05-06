import { api } from "@/lib";
import { z } from "zod";

/* Decorator doesn't work in edge so we use wrapper instead */
const schemas = { query: z.object({}) }
export const GET = api(schemas, (_req, _ctx) => {
    return { message: `Hello world from ${process.env.NEXT_RUNTIME} runtime!` };
})
export const runtime = "edge"