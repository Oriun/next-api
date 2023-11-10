import { z } from "zod";
import { handlerA, handlerB } from "./wrappers";

export const GET = handlerA(
  () => `Hello World from ${process.env.NEXT_RUNTIME} runtime`
);

export const DELETE = handlerB(({ params }) => "This will never be called", {
  params: z.object({
    id: z.string(),
  })
});

export const runtime = "edge";
