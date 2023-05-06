import z from "zod";
const plainResponse = z.strictObject({
    status: z.number().default(200),
    headers: z.record(z.string()).default({}),
    body: z.any().default(null),
});
export function api(schemas, handler) {
    return async (request, variables) => {
        const contentType = request.headers.get("content-type");
        const bodyFormat = contentType?.startsWith("application/json") ? "json" : "text";
        let body = await request[bodyFormat]();
        let query = {};
        let params = variables.params ?? {};
        if (schemas.body) {
            body = schemas.body.safeParse(body);
            if (!body.success)
                return new Response(JSON.stringify(body.error), {
                    status: 400,
                });
            body = body.data;
        }
        if (schemas.query) {
            query = parseQueryParams(request, schemas.query ?? z.any());
            if (!query.success)
                return new Response(JSON.stringify(query.error), {
                    status: 400,
                });
            query = query.data;
        }
        if (schemas.params) {
            params = schemas.params.safeParse(variables.params ?? {});
            if (!params.success)
                return new Response(JSON.stringify(params.error), {
                    status: 400,
                });
            params = params.data;
        }
        try {
            const response = await handler.call(null, request, {
                body,
                query,
                params,
            });
            if (response instanceof Response) {
                return response;
            }
            if (typeof response !== "object") {
                return new Response(JSON.stringify(response), {
                    headers: {
                        "content-type": "application/json",
                    }
                });
            }
            const parsedResponse = plainResponse.safeParse(response);
            if (!parsedResponse.success) {
                return new Response(JSON.stringify(response), {
                    headers: {
                        "content-type": "application/json",
                    }
                });
            }
            const { data } = parsedResponse;
            return new Response(JSON.stringify(data.body), {
                status: data.status,
                headers: data.headers,
            });
        }
        catch (e) {
            console.error(e);
            return new Response(e.message, {
                status: 400,
            });
        }
    };
}
export function parseQueryParams(request, schema) {
    return schema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
}
