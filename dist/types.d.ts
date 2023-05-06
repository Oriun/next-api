import { NextRequest } from "next/server";
import type { z } from "zod";
export type Any = z.ZodType<any, any>;
export type Schemas<Q extends Any = Any, P extends Any = Any, B extends Any = Any> = {
    query?: Q;
    params?: P;
    body?: B;
};
export type Variables<Q extends Any = Any, P extends Any = Any, B extends Any = Any> = {
    query: z.infer<Q>;
    params: z.infer<P>;
    body: z.infer<B>;
};
export type Handler<Q extends Any = Any, P extends Any = Any, B extends Any = Any> = (request: NextRequest, variables: Variables<Q, P, B>) => any;
