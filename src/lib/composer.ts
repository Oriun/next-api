import { NextRequest } from "next/server"
import { Handler, Middleware } from "./types"

export function compose(mainHandler: Handler, ..._handlers: Middleware[]) {
    const handlers = _handlers.reverse()
    return async (variables: any, request: NextRequest) => {
        let store = variables
        for (const handler of handlers) {
            const result = await handler(variables, request)
            store = { ...store, ...result }
        }
        return mainHandler(store, request)
    }
}