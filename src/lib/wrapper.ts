import {
  Schemas,
  Any,
  Handler,
  ErrorHandler,
  CreateApiParams,
} from "./types";
import type { NextRequest } from "next/server";
import { bodyParser, cookiesParser, paramsParser, queryParser } from "./parser";
import { responseParser } from "./response";
import { compose } from "./composer";

export function api<
  Q extends Any = Any,
  P extends Any = Any,
  B extends Any = Any,
  C extends Any = Any
>(
  handler: Handler<Q, P, B, C>,
  schemas: Schemas<Q, P, B, C> = {},
  errorHandlers: ErrorHandler[] = []
) {
  return async (request: NextRequest, _variables: any) => {
    try {
      const body = await bodyParser(request, schemas.body);
      const query = queryParser(request, schemas.query);
      const params = paramsParser(_variables, schemas.params);
      const cookies = cookiesParser(request, schemas.cookies);

      const variables = {
        body,
        query,
        params,
        cookies,
      };

      const response = await handler.call(null, variables, request);

      return responseParser(response);
    } catch (e) {
      if (e instanceof Response) return e;
      for (const errorHandler of errorHandlers) {
        const response = await errorHandler(e, _variables, request);
        if (response) return response;
      }
      return new Response((e as Error).message, {
        status: 500,
      });
    }
  };
}

export function createAPI({
  middlewares = [],
  errorHandlers: globalErrorHandlers = [],
}: CreateApiParams = {}) {
  return function <
    Q extends Any = Any,
    P extends Any = Any,
    B extends Any = Any,
    C extends Any = Any
  >(
    handler: Handler<Q,P,B,C>,
    schemas: Schemas<Q,P,B,C> = {},
    routeErrorHandlers: ErrorHandler[] = []
  ) {
    return api(compose(handler, ...middlewares), schemas, [
      ...routeErrorHandlers,
      ...globalErrorHandlers,
    ]);
  };
}
