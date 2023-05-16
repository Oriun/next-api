
import { createAPIDecorator } from "@/lib";
import { firstMiddleware, secondMiddleware } from "../middleware";

/**
 * This could be in a service file, with the
 * middleware functions, to create a decorator
 * for i.e. authenticated routes
 */

export const handlerA = createAPIDecorator({ middlewares: [firstMiddleware] })

export const handlerB = createAPIDecorator({ middlewares: [firstMiddleware, secondMiddleware] })

function wrapError(error: any) {
    return new Response(JSON.stringify(`caught error : ${error.message}`), {
        status: 400,
    })
}
export const handlerC = createAPIDecorator({ errorHandlers: [wrapError] })
