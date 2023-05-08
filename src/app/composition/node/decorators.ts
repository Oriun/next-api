
import { createAPIDecorator } from "@/lib";
import { firstMiddleware, secondMiddleware } from "../middleware";

/**
 * This could be in a service file, with the
 * middleware functions, to create a decorator
 * for i.e. authenticated routes
 */

export const handlerA = createAPIDecorator(firstMiddleware)

export const handlerB = createAPIDecorator(firstMiddleware, secondMiddleware)