import { api } from './wrapper';
export function API(schemas = {}) {
    return function (_target, _propertyKey, descriptor) {
        return {
            get() {
                return api(schemas, descriptor.value);
            },
        };
    };
}
