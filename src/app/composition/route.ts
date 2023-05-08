import { createAPIDecorator } from "@/lib";

const firstMiddleware = () => {
    return {}
}
const secondMiddleware = () => {
    throw new Response("This handler sould not be called")
}

const handlerA = createAPIDecorator(firstMiddleware)

const handlerB = createAPIDecorator(firstMiddleware, secondMiddleware)

class Route {
    @handlerA()
    GET() {
        return "Hello World"
    }

    @handlerB()
    DELETE() {
        return "Hello World"
    }
}

export const { GET, DELETE } = new Route()