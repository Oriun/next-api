import { handlerA, handlerB } from "./wrappers"

export const GET = handlerA(() => `Hello World from ${process.env.NEXT_RUNTIME} runtime`)

export const DELETE = handlerB(() => "This will never be called")

export const runtime = "edge"