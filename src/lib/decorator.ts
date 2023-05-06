import { Any, Schemas } from './types'
import { api } from './wrapper'


export function API<
    Q extends Any = Any,
    P extends Any = Any,
    B extends Any = Any
>(
    schemas: Schemas<Q, P, B> = {}
) {
    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ): TypedPropertyDescriptor<any> {
        return {
            get() {
                return api(schemas, descriptor.value)
            },
        }
    }
}
