import { compose } from './composer'
import { Any, CreateApiParams, ErrorHandler, Middleware, Schemas } from './types'
import { api, createAPI } from './wrapper'


export function API<
    Q extends Any = Any,
    P extends Any = Any,
    B extends Any = Any,
    C extends Any = Any
>(
    schemas: Schemas<Q, P, B, C> = {},
    errorHandlers: ErrorHandler[] = []
) {
    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ): TypedPropertyDescriptor<any> {
        return {
            get() {
                return api(descriptor.value, schemas, errorHandlers)
            },
        }
    }
}

export function createAPIDecorator({ middlewares = [], errorHandlers = [] }: CreateApiParams = {}) {
    const composition = createAPI({ middlewares, errorHandlers })
    return function (schema: Schemas = {}, localErrorHandlers: ErrorHandler[] = []) {
        return function (
            _target: any,
            _propertyKey: string,
            descriptor: PropertyDescriptor
        ): TypedPropertyDescriptor<any> {
            return {
                get() {
                    return composition(descriptor.value, schema, localErrorHandlers)
                },
            }
        }
    }
}