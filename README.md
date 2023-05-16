# NextJS API Wrapper

NextJS API Wrapper is a powerful NPM package that enables developers to create wrappers around their NextJS API routes. It provides request parsing with Zod, middleware, and error handlers, simplifying the process of setting up and managing your API routes. It is also compatible with decorators, allowing you to create API routes with classes, and supports NodeJs and Edge runtimes.

---

## Installation

To install the NextJS API Wrapper, use the following command:

```bash
pnpm install @oriun/next-api
```

---

## Usage

NextJS API Wrapper makes it easy to create and manage your API routes. Here's how to use it:

### Wrappers

First, import the `api` wrapper and create a `Zod` schema to parse and validate your requests. You can provide schemas for the `body`, `query`, `cookies` and `params` properties of the request:

```ts
import { api } from "@oriun/next-api";
import { z } from "zod";

const body = z.object({
  name: z.string().min(1).max(100),
});
```

Next, create a function that handles your API route and wrap it with the `api` wrapper:

```ts
export const GET = api((_ctx, _req) => {
    return "Hello world !";
}, { body })

export const POST = api((ctx) {
    return { message: 'Nice to meet you ' + ctx.body.name + '!' };
}, { body })
```

### Decorators

NextJS API Wrapper also supports decorators, allowing you to create API routes with classes. To create the same endpoints as above, first import the `API` decorator and create a `Zod` schema to parse and validate your requests:

```ts
import { API } from "@oriun/next-api";
import { z } from "zod";

const body = z.object({
  name: z.string().min(1).max(100),
});
```

Next, create a Route class with HTTP methods as method names:

```ts
class Route {
  @API()
  async GET() {
    return { message: "Hello world !" };
  }

  @API({ body })
  async POST(variables: any) {
    const { name } = variables.body as z.infer<typeof body>;
    return { message: "Nice to meet you " + name + "!" };
  }
}
```

Finally, export the methods:

```ts
export const { GET, POST } = new Route();
```

In this example, we've created a simple API route that responds to GET and POST requests. The GET request returns a simple greeting, while the POST request expects a body with a `name` property and returns a personalized greeting.

---

## Customization

NextJS API Wrapper provides a number of options to customize your API routes. Here's how to use them:

### Middleware

NextJS API Wrapper supports middleware, allowing you to run code before your API routes. To use middleware, simply pass an array of middleware functions to the `api` wrapper:

```ts
import { createAPI } from "@oriun/next-api";

function checkAuth(_ctx: unknown, req: Request) {
  const authorization = req.headers.get("Authorization");
  if (!authorization) {
    throw new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  return { authorization };
}

const authenticatedRoute = createAPI({
  middlewares: [checkAuth],
});

export const GET = authenticatedRoute((ctx, _req) => {
  return `Hello world user ${ctx.authorization}!`;
});

const body = z.object({
  name: z.string().min(1).max(100),
});
export const POST = authenticatedRoute(
  (ctx, _req) => {
    return `User ${ctx.authorization} created resource with name ${ctx.body.name}!`;
  },
  { body }
);
```

#### Parameters

As you can see, the middleware function receives the `ctx` and `req` objects as parameters. The `ctx` object contains the parsed request body, query, cookies and params, while the `req` object contains the original request.

#### Return value

The middleware function can return an object that will be merged with the `ctx` object, allowing you to pass data to your API route. If the middleware function throws an error, the error will be handled by the error handlers. If the middleware function returns a response, the response will be returned by the API route.

### Error Handling

NextJS API Wrapper supports error handling, allowing you to handle errors thrown by your API routes. To use error handling, simply pass an array of error handler functions to the `api` wrapper:

```ts
import { createAPI } from "@oriun/next-api";

function errorHandler(error: any) {
  if (error instanceof Error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
  return new Response(
    JSON.stringify({ message: "Unexpected", details: error }),
    {
      status: 500,
    }
  );
}

const errorHandledRoute = createAPI({
  errorHandlers: [errorHandler],
});

export const GET = errorHandledRoute((_ctx, _req) => {
  throw new Error("Something went wrong");
});
```

#### Parameters

As you can see, the error handler function receives the error as a parameter. The error can be an `Error` object or any other type of variable.

#### Return value

The error handler function can return a response, allowing you to return a custom error response. If the error handler function returns a response, the response will be returned by the API route. If the error handler function returns nothing, the error will be rethrown and handled by the next error handler.

### Decorators

You can also use middleware and error handlers with decorators. To do so, simply pass an array of middleware functions and error handler functions to the `createAPIDecorator` decorator:

```ts
import { createAPIDecorator } from "@oriun/next-api";

function checkAuth(_ctx: unknown, req: Request) {
  const authorization = req.headers.get("Authorization");
  if (!authorization) {
    throw new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  return { authorization };
}

function errorHandler(error: any) {
  if (error instanceof Error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
  return new Response(
    JSON.stringify({ message: "Unexpected", details: error }),
    {
      status: 500,
    }
  );
}

const api = createAPIDecorator({
  middlewares: [checkAuth],
  errorHandlers: [errorHandler],
});

const body = z.object({
  name: z.string().min(1).max(100),
});

class Route {
  @api()
  async GET() {
    return `Hello world user ${this.authorization}!`;
  }

  @api({ body })
  async POST(variables: any) {
    return `User ${this.authorization} created resource with name ${this.body.name}!`;
  }
}

export const { GET, POST } = new Route();
```

---

## API Reference

#### `api(handler, schemas?, errorHandlers?)`

The api function is used to create an API route. Here's an example of how to use it:

```ts
import { api } from "@oriun/next-api";
import { z } from "zod";

const body = z.object({
  name: z.string().min(1).max(100),
});

async function handler(variables: any) {
  const { name } = variables.body as z.infer<typeof body>;
  return { message: "Nice to meet you " + name + "!" };
}

export const POST = api(handler, { body });
```

#### `createAPI({ middlewares, errorHandlers })`

The createAPI function is used to create an API with pre-configured middleware. Here's an example of how to use it:

```ts
import { createAPI } from "@oriun/next-api";
import { z } from "zod";

export function firstMiddleware() {
  console.log("firstMiddleware");
  return {};
}

const body = z.object({
  name: z.string().min(1).max(100),
});

async function handler(variables: any) {
  const { name } = variables.body as z.infer<typeof body>;
  return { message: "Nice to meet you " + name + "!" };
}

export const POST = createAPI({ middlewares: [firstMiddleware] })(handler, {
  body,
});
```

#### `API(schemas?, errorHandlers?)`

The API decorator is used to create an API route. Here's an example of how to use it:

```ts
import { API } from "@/lib";
import { z } from "zod";

const body = z.object({
  name: z.string().min(1).max(100),
});

class Route {
  @API({ body })
  async POST(variables: any) {
    const { name } = variables.body as z.infer<typeof body>;
    return { message: "Nice to meet you " + name + "!" };
  }
}

export const { POST } = new Route();
```

#### `createAPIDecorator({ middlewares, errorHandlers })`

The createAPIDecorator function is used to create a custom API decorator with pre-configured middleware. Here's an example of how to use it:

```ts
import { createAPIDecorator } from "@oriun/next-api";

export function firstMiddleware() {
  console.log("firstMiddleware");
  return {};
}

const customApi = createAPIDecorator({ middlewares: [firstMiddleware] });

class Route {
  @customApi()
  async GET() {
    return { message: "Hello world!" };
  }
}

export const { GET } = new Route();
```

---

## Contributing

Contributions are always welcome! Here's how you can help:

- **Reporting Bugs**: If you find a bug, please search the issue tracker to see if it has already been reported. If it hasn't, feel free to open a new issue with a descriptive title and clear steps to reproduce the bug, as well as the expected and actual results.
- **Suggesting Enhancements**: If you have an idea for a new feature or an improvement to an existing feature, please open a new issue for discussion.
- **Pull Requests**: If you've fixed a bug or developed a new feature, you can submit a pull request. Please make sure to follow the existing code style, include tests, and update the documentation if necessary.

Before contributing, please read our Code of Conduct.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

The MIT License is a permissive open source license that is well-suited to many types of projects. If you choose to use it, you'll need to include a copy of the MIT License in your project. If you prefer a different license, you'll need to include that instead.
