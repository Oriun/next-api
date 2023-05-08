import { compose } from './composer'
import { Any, Middleware, Schemas } from './types'
import { api, createAPI } from './wrapper'


export function API<
    Q extends Any = Any,
    P extends Any = Any,
    B extends Any = Any,
    C extends Any = Any
>(
    schemas: Schemas<Q, P, B, C> = {}
) {
    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ): TypedPropertyDescriptor<any> {
        return {
            get() {
                return api(descriptor.value, schemas)
            },
        }
    }
}

export function createAPIDecorator(...middlewares: Middleware[]) {
    const composition = createAPI(...middlewares)
    return function (schema: Schemas = {}) {
        return function (
            _target: any,
            _propertyKey: string,
            descriptor: PropertyDescriptor
        ): TypedPropertyDescriptor<any> {
            return {
                get() {
                    return composition(descriptor.value, schema)
                },
            }
        }
    }
}