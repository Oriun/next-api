import { NextRequest } from 'next/server';
import { z } from 'zod';
type Any = z.ZodType<any, any>;
type Schemas<Q, P, B> = {
    query?: Q;
    params?: P;
    body?: B;
};
export declare function API<Q extends Any = Any, P extends Any = Any, B extends Any = Any>(schemas?: Schemas<Q, P, B>): (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => TypedPropertyDescriptor<any>;
export declare function parseQueryParams<T extends z.ZodType<any, any>>(request: NextRequest, schema: T): z.SafeParseReturnType<any, any>;
export {};
