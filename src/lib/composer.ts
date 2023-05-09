import { NextRequest } from "next/server"
import { Handler, Middleware } from "./types"

export function compose(mainHandler: Handler, ...handlers: Middleware[]) {
    return async (variables: any, request: NextRequest) => {
        let store = variables
        for (const handler of handlers) {
            const result = await handler(variables, request)
            if (result) store = { ...store, ...result }
        }
        return mainHandler(store, request)
    }
}