import { Schemas, Any, Handler } from "./types";
import type { NextRequest } from "next/server";
import z from "zod";
import { bodyParser, cookiesParser, paramsParser, queryParser } from "./parser";
import { responseParser } from "./response";

export function api<Q extends Any = Any,
    P extends Any = Any,
    B extends Any = Any,
    C extends Any = Any,
>(schemas: Schemas<Q, P, B, C>, handler: Handler<Q, P, B, C>) {
    return async (request: NextRequest, _variables: any) => {
        try {
            const body = await bodyParser(request, schemas.body)
            const query = queryParser(request, schemas.query)
            const params = paramsParser(_variables, schemas.params)
            const cookies = cookiesParser(request, schemas.cookies)

            const variables = {
                body,
                query,
                params,
                cookies
            }

            const response = await handler.call(null, variables, request)


            return responseParser(response)

        } catch (e) {
            if (e instanceof Response) return e
            return new Response((e as Error).message, {
                status: 400,
            })
        }
    }
}
