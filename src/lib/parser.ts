import { NextRequest } from "next/server";
import { Any } from "./types";
import { z } from "zod";

const CONTENT_TYPE = "content-type"
const JSON_MIME = "application/json"

export async function bodyParser<T extends Any>(request: NextRequest, schema?: T) {

    const contentType = request.headers.get(CONTENT_TYPE)
    const bodyFormat = contentType?.startsWith(JSON_MIME) ? "json" : "text";

    const body: z.infer<T> = await request[bodyFormat]()

    if (schema) {
        const parsedBody = schema.safeParse(body)
        if (!parsedBody.success)
            throw new Response(JSON.stringify(parsedBody.error), {
                status: 400,
            })
        return parsedBody.data as z.infer<T>
    }

    return body
}

export function queryParser<T extends Any>(request: NextRequest, schema?: T) {

    const searchParams = request.nextUrl.searchParams

    const query = Object.fromEntries(searchParams) as z.infer<T>

    if (schema) {
        const parsedQuery = schema.safeParse(query)
        if (!parsedQuery.success)
            throw new Response(JSON.stringify(parsedQuery.error), {
                status: 400,
            })
        return parsedQuery.data as z.infer<T>
    }

    return query
}

export function paramsParser<T extends Any>(variables: any | undefined, schema?: T) {

    let params = variables?.params ?? {} as z.infer<T>

    if (schema) {
        const parsedParams = schema.safeParse(params)
        if (!parsedParams.success)
            throw new Response(JSON.stringify(parsedParams.error), {
                status: 400,
            })
        return parsedParams.data as z.infer<T>
    }

    return params
}


export function cookiesParser<T extends Any>(request: NextRequest, schema?: T) {

    const cookies = {} as z.infer<T>
    // @ts-ignore
    for (const [, { name, value }] of request.cookies._parsed) {
        cookies[name] = value
    }

    if (schema) {
        const parsedCookies = schema.safeParse(cookies)
        if (!parsedCookies.success)
            throw new Response(JSON.stringify(parsedCookies.error), {
                status: 400,
            })
        return parsedCookies.data as z.infer<T>
    }

    return cookies
}