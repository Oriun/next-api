export function firstMiddleware() {
    console.log("firstMiddleware")
    return {}
}
export function secondMiddleware() {
    console.log("secondMiddleware")
    throw new Response("This handler sould not be called")
    return {}
}

