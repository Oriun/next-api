import { handlerA, handlerB, handlerC } from "./decorators"

class Route {
    @handlerA()
    GET() {
        return "Hello World"
    }
    @handlerB()
    DELETE() {
        return "This will never be called"
    }

    @handlerC()
    POST() {
        throw new Error("This error will be caught by the error handler")
    }
}

export const { GET, DELETE, POST } = new Route()