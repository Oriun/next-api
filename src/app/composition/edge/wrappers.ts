import { createAPI } from "@/lib"
import { firstMiddleware, secondMiddleware } from "../middleware"

export const handlerA = createAPI(firstMiddleware)
export const handlerB = createAPI(firstMiddleware, secondMiddleware)