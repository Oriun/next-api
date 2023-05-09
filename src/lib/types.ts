import { NextRequest } from "next/server"
import type { z } from "zod"


export type Any = z.ZodType<any, any>

export type Schemas<Q extends Any = Any,
    P extends Any = Any,
    B extends Any = Any,
    C extends Any = Any> = {
        query?: Q
        params?: P
        body?: B
        cookies?: C
    }

export type Variables<Q extends Any = Any,
    P extends Any = Any,
    B extends Any = Any,
    C extends Any = Any> = {
        query: z.infer<Q>
        params: z.infer<P>
        body: z.infer<B>
        cookies: z.infer<C>
    }

export type Handler<Q extends Any = Any,
    P extends Any = Any,
    B extends Any = Any,
    C extends Any = Any> = (
        variables: Variables<Q, P, B, C>,
        request: NextRequest,
    ) => any | Promise<any>

export type MiddlewareReturn = Record<string, any> | void
export type Middleware<Q extends Any = Any,
    P extends Any = Any,
    B extends Any = Any,
    C extends Any = Any> = (
        variables: Variables<Q, P, B, C>,
        request: NextRequest,
    ) => MiddlewareReturn | Promise<MiddlewareReturn>
