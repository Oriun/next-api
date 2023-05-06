var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { z } from 'zod';
var plainResponse = z.strictObject({
    status: z.number().default(200),
    headers: z.record(z.string()).default({}),
    body: z.any().default(null),
});
export function API(schemas) {
    if (schemas === void 0) { schemas = {}; }
    return function (_target, _propertyKey, descriptor) {
        return {
            get: function () {
                var _this = this;
                return function (request, variables) { return __awaiter(_this, void 0, void 0, function () {
                    var contentType, bodyFormat, body, query, params, response, parsedResponse, data, e_1;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                contentType = request.headers.get("content-type");
                                bodyFormat = (contentType === null || contentType === void 0 ? void 0 : contentType.startsWith("application/json")) ? "json" : "text";
                                return [4 /*yield*/, request[bodyFormat]()];
                            case 1:
                                body = _d.sent();
                                query = {};
                                params = (_a = variables.params) !== null && _a !== void 0 ? _a : {};
                                if (schemas.body) {
                                    body = schemas.body.safeParse(body);
                                    if (!body.success)
                                        return [2 /*return*/, new Response(JSON.stringify(body.error), {
                                                status: 400,
                                            })];
                                    body = body.data;
                                }
                                if (schemas.query) {
                                    query = parseQueryParams(request, (_b = schemas.query) !== null && _b !== void 0 ? _b : z.any());
                                    if (!query.success)
                                        return [2 /*return*/, new Response(JSON.stringify(query.error), {
                                                status: 400,
                                            })];
                                    query = query.data;
                                }
                                if (schemas.params) {
                                    params = schemas.params.safeParse((_c = variables.params) !== null && _c !== void 0 ? _c : {});
                                    if (!params.success)
                                        return [2 /*return*/, new Response(JSON.stringify(params.error), {
                                                status: 400,
                                            })];
                                    params = params.data;
                                }
                                _d.label = 2;
                            case 2:
                                _d.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, descriptor.value.call(this, request, {
                                        body: body,
                                        query: query,
                                        params: params,
                                    })];
                            case 3:
                                response = _d.sent();
                                if (response instanceof Response) {
                                    return [2 /*return*/, response];
                                }
                                if (typeof response !== "object") {
                                    return [2 /*return*/, new Response(JSON.stringify(response), {
                                            headers: {
                                                "content-type": "application/json",
                                            }
                                        })];
                                }
                                parsedResponse = plainResponse.safeParse(response);
                                if (!parsedResponse.success) {
                                    return [2 /*return*/, new Response(JSON.stringify(response), {
                                            headers: {
                                                "content-type": "application/json",
                                            }
                                        })];
                                }
                                data = parsedResponse.data;
                                return [2 /*return*/, new Response(JSON.stringify(data.body), {
                                        status: data.status,
                                        headers: data.headers,
                                    })];
                            case 4:
                                e_1 = _d.sent();
                                console.error(e_1);
                                return [2 /*return*/, new Response(e_1.message, {
                                        status: 400,
                                    })];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); };
            },
        };
    };
}
export function parseQueryParams(request, schema) {
    return schema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
}
