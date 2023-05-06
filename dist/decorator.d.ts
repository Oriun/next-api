import { Any, Schemas } from './types';
export declare function API<Q extends Any = Any, P extends Any = Any, B extends Any = Any>(schemas?: Schemas<Q, P, B>): (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => TypedPropertyDescriptor<any>;
