import { z } from "zod"

const redirectResponse = z.strictObject({
    status: z.number().default(302),
    redirect: z.string().url(),
    cookies: z.record(z.string()).default({}),
})

const plainResponse = z.strictObject({
    status: z.number().default(200),
    headers: z.record(z.string()).default({}),
    body: z.any().default(null),
    cookies: z.record(z.string()).default({}),
})

const nullBodyStatuses = [101, 204, 205, 304];

export function withCorsHeaders(origin: string, response: Response) {
    
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods":
        "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH",
      "Access-Control-Allow-Headers": "*",
    };

    for (const [name, value] of Object.entries(headers)) {
        if(response.headers.has(name)) continue
        response.headers.set(name, value)
    }
    return response;
  }

export function withCookies(response: Response, cookies: Record<string, string>) {

    for (const [name, value] of Object.entries(cookies)) {
        response.headers.append("set-cookie", `${name}=${value}`)
    }

    return response
}

export function responseParser(response: any, request: Request) {

    const cors = withCorsHeaders.bind(null, request.headers.get("origin") ?? "*")
    
    if (response instanceof Response) {
        return cors(response)
    }

    if (typeof response !== "object") {
        return cors(new Response(JSON.stringify(response)))
    }

    const parsedRedirect = redirectResponse.safeParse(response)
    if (parsedRedirect.success) {
        const { status, redirect, cookies } = parsedRedirect.data
        return withCookies(cors(new Response(null, {
            status,
            headers: {
                "content-type": "text/plain",
                location: redirect,
            },
        })), cookies)
    }

    const parsedResponse = plainResponse.safeParse(response)
    if (!parsedResponse.success) {
        return cors(new Response(JSON.stringify(response)))
    }

    const { data } = parsedResponse

    const shouldHaveNullBody = nullBodyStatuses.includes(data.status);
    const body = data.body !== null ? shouldHaveNullBody ? null : JSON.stringify(data.body) : null;

    return withCookies(cors(new Response(body, {
        status: data.status,
        headers: {
            "content-type": "application/json",
            ...data.headers
        },
    })), data.cookies);

}
