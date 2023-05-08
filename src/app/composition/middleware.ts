export function firstMiddleware() {
    return {}
}
export function secondMiddleware() {
    throw new Response("This handler sould not be called")
    return {}
}

