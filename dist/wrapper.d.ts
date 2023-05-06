import { Schemas, Any, Handler } from "./types";
import type { NextRequest } from "next/server";
import z from "zod";
export declare function api<Q extends Any = Any, P extends Any = Any, B extends Any = Any>(schemas: Schemas<Q, P, B>, handler: Handler<Q, P, B>): (request: NextRequest, variables: any) => Promise<Response>;
export declare function parseQueryParams<T extends z.ZodType<any, any>>(request: NextRequest, schema: T): z.SafeParseReturnType<any, any>;
