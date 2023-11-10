import { NextRequest } from "next/server";
import { Any, Handler, Middleware, Variables } from "./types";

export function compose<
  Q extends Any = Any,
  P extends Any = Any,
  B extends Any = Any,
  C extends Any = Any
>(mainHandler: Handler<Q, P, B, C>, ...handlers: Middleware[]) {
  return async (variables: Variables<Q, P, B, C>, request: NextRequest) => {
    let store = variables;
    for (const handler of handlers) {
      const result = await handler(variables, request);
      if (result) store = { ...store, ...result };
    }
    return mainHandler(store, request);
  };
}
