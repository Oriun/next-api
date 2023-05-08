import { handlerA, handlerB } from "./decorators"

class Route {
    @handlerA()
    GET() {
        return "Hello World"
    }
    @handlerB()
    DELETE() {
        return "This will never be called"
    }
}

export const { GET, DELETE } = new Route()