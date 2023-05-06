import { NextRequest } from 'next/server'
import { z } from 'zod'

type Any = z.ZodType<any, any>

type Schemas<Q, P, B> = {
    query?: Q
    params?: P
    body?: B
}

const plainResponse = z.strictObject({
    status: z.number().default(200),
    headers: z.record(z.string()).default({}),
    body: z.any().default(null),
})

export function API<
    Q extends Any = Any,
    P extends Any = Any,
    B extends Any = Any
>(
    schemas: Schemas<Q, P, B> = {}
) {
    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ): TypedPropertyDescriptor<any> {
        return {
            get() {
                return async (request: NextRequest, variables: any) => {
                    const contentType = request.headers.get("content-type")
                    const bodyFormat = contentType?.startsWith("application/json") ? "json" : "text";

                    let body: z.infer<B> = await request[bodyFormat]()
                    let query: z.infer<Q> = {}
                    let params: z.infer<P> = variables.params ?? {}

                    if (schemas.body) {
                        body = schemas.body.safeParse(body)
                        if (!body.success)
                            return new Response(JSON.stringify(body.error), {
                                status: 400,
                            })
                        body = body.data
                    }
                    if (schemas.query) {
                        query = parseQueryParams(
                            request,
                            schemas.query ?? z.any()
                        )
                        if (!query.success)
                            return new Response(JSON.stringify(query.error), {
                                status: 400,
                            })
                        query = query.data
                    }
                    if (schemas.params) {
                        params = schemas.params.safeParse(
                            variables.params ?? {}
                        )
                        if (!params.success)
                            return new Response(JSON.stringify(params.error), {
                                status: 400,
                            })
                        params = params.data
                    }
                    try {
                        const response = await descriptor.value.call(this, request, {
                            body,
                            query,
                            params,
                        })
                        if (response instanceof Response) {
                            return response
                        }
                        if (typeof response !== "object") {
                            return new Response(JSON.stringify(response), {
                                headers: {
                                    "content-type": "application/json",
                                }
                            })
                        }
                        const parsedResponse = plainResponse.safeParse(response)
                        if (!parsedResponse.success) {
                            return new Response(JSON.stringify(response), {
                                headers: {
                                    "content-type": "application/json",
                                }
                            })
                        }
                        const { data } = parsedResponse
                        return new Response(JSON.stringify(data.body), {
                            status: data.status,
                            headers: data.headers,
                        })
                    } catch (e) {
                        console.error(e)
                        return new Response((e as Error).message, {
                            status: 400,
                        })
                    }
                }
            },
        }
    }
}

export function parseQueryParams<T extends z.ZodType<any, any>>(
    request: NextRequest,
    schema: T
) {
    return schema.safeParse(Object.fromEntries(request.nextUrl.searchParams))
}