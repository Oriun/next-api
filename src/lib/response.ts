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


export function withCookies(response: Response, cookies: Record<string, string>) {

    for (const [name, value] of Object.entries(cookies)) {
        response.headers.append("set-cookie", `${name}=${value}`)
    }

    return response
}

export function responseParser(response: any) {

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

    const parsedRedirect = redirectResponse.safeParse(response)
    if (parsedRedirect.success) {
        const { status, redirect, cookies } = parsedRedirect.data
        return withCookies(new Response(null, {
            status,
            headers: {
                location: redirect,
            },
        }), cookies)
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

    const shouldHaveNullBody = nullBodyStatuses.includes(data.status);
    const body = data.body !== null ? shouldHaveNullBody ? null : JSON.stringify(data.body) : null;

    return withCookies(new Response(body, {
        status: data.status,
        headers: data.headers,
    }), data.cookies);

}
