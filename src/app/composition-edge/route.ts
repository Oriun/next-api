import { createAPI } from "@/lib";

const firstMiddleware = () => {
    return {}
}
const secondMiddleware = () => {
    throw new Response("This handler sould not be called")
}

const handlerA = createAPI(firstMiddleware)

const handlerB = createAPI(firstMiddleware, secondMiddleware)

export const GET = handlerA(() => "Hello World")
export const DELETE = handlerB(() => "Hello World")
