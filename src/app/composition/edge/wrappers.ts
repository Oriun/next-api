import { createAPI } from "@/lib"
import { firstMiddleware, secondMiddleware } from "../middleware"

export const handlerA = createAPI({
    middlewares: [firstMiddleware]
})

export const handlerB = createAPI({
    middlewares: [firstMiddleware, secondMiddleware]
})