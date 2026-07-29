# 📦 api-response-utility

Production-ready, standardized API responses for Node.js/Express apps: success & error
formatters, HTTP status code constants, pagination, async error handling, custom
error classes, and full TypeScript support - with zero runtime dependencies.

- ✅ Works with plain CommonJS *and* ES Modules
- ✅ Fully typed (`.d.ts` included, no `@types/*` needed)
- ✅ 100% backward compatible with `1.0.x`
- ✅ Zero runtime dependencies

---

## Installation

```bash
npm install api-response-utility
```

---

## Quick start

```js
const apiResponse = require("api-response-utility");

app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  apiResponse.success(res, 200, "User fetched successfully", user);
});
```

```js
import apiResponse from "api-response-utility";

app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  apiResponse.success(res, 200, "User fetched successfully", user);
});
```

Both produce:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": { "id": 1, "name": "Ada" },
  "timestamp": "2026-07-28T10:15:00.000Z"
}
```

---

## Table of contents

- [Success responses](#success-responses)
- [Error responses](#error-responses)
- [HTTP status code constants](#http-status-code-constants)
- [Pagination](#pagination)
- [Async error handling](#async-error-handling)
- [Custom error classes](#custom-error-classes)
- [Express integration (all-in-one)](#express-integration-all-in-one)
- [TypeScript](#typescript)
- [Full API reference](#full-api-reference)
- [Migration guide (1.0.x → 1.1.0)](#migration-guide-10x--110)
- [Publishing](#publishing)

---

## Success responses

`success()` supports two calling styles:

**Send it directly on `res`** (new in 1.1.0 - recommended for Express):

```js
apiResponse.success(res, 200, "User fetched successfully", userData);
// -> sends res.status(200).json({...}) and returns res
```

**Build the payload yourself** (original 1.0.x style, still fully supported):

```js
const payload = apiResponse.success(userData, "User fetched successfully", 200);
res.status(200).json(payload);
```

Both produce the same shape:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": {},
  "timestamp": "ISO_DATE"
}
```

---

## Error responses

Same dual calling convention as `success()`:

```js
apiResponse.error(res, 400, "Invalid user input", validationErrors);
```

```js
const payload = apiResponse.error("Invalid user input", 400, validationErrors);
res.status(400).json(payload);
```

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid user input",
  "errors": [],
  "timestamp": "ISO_DATE"
}
```

### Stack traces (dev only)

Pass the original `Error` as an extra argument to attach its stack trace -
it's only ever included when `process.env.NODE_ENV === "development"`,
keeping production responses free of sensitive internals:

```js
try {
  await doSomething();
} catch (err) {
  apiResponse.error(res, 500, "Something went wrong", [], err);
}
```

### Shorthand helpers

Unchanged since 1.0.x - all return a plain payload object:

```js
apiResponse.validationError([{ field: "email", msg: "Invalid email address" }]);
apiResponse.notFound("User not found");
apiResponse.unauthorized("You must be logged in");
apiResponse.forbidden("Access denied to this resource");
apiResponse.conflict("Email already exists");
apiResponse.tooManyRequests();
apiResponse.internalServerError();
apiResponse.routeNotFound(req.originalUrl); // for a 404 fallback middleware
```

---

## HTTP status code constants

```js
const { StatusCodes } = require("api-response-utility");

res.status(StatusCodes.CREATED).json(/* ... */);

StatusCodes.OK;                    // 200
StatusCodes.CREATED;               // 201
StatusCodes.NO_CONTENT;            // 204
StatusCodes.BAD_REQUEST;           // 400
StatusCodes.UNAUTHORIZED;          // 401
StatusCodes.FORBIDDEN;             // 403
StatusCodes.NOT_FOUND;             // 404
StatusCodes.CONFLICT;              // 409
StatusCodes.UNPROCESSABLE_ENTITY;  // 422
StatusCodes.TOO_MANY_REQUESTS;     // 429
StatusCodes.INTERNAL_SERVER_ERROR; // 500
```

`StatusCodes` is frozen (`Object.freeze`), so it can't be mutated at runtime.

---

## Pagination

```js
const { buildPagination, paginated } = require("api-response-utility");

// Send directly on res:
app.get("/users", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const totalRecords = await User.countDocuments();
  const users = await User.find().skip((page - 1) * limit).limit(limit);

  apiResponse.paginated(res, users, { page, limit, totalRecords });
});

// Or just build the payload:
const payload = buildPagination(users, { page, limit, totalRecords });
```

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data fetched successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalRecords": 100,
    "totalPages": 10
  },
  "timestamp": "ISO_DATE"
}
```

`totalPages` is always computed for you, and missing/invalid `page`, `limit`
or `totalRecords` values safely fall back to sane defaults (`page: 1`,
`limit: 10`, `totalRecords: data.length`) instead of producing `NaN`.

---

## Async error handling

Wrap any async route/middleware so rejected promises are automatically
forwarded to Express's error-handling middleware - no more repetitive
`try/catch` in every controller.

```js
const asyncHandler = require("api-response-utility");
const { attachResponseMethods, errorHandler } = asyncHandler;

app.use(attachResponseMethods); // enables res.success()/res.error()/res.paginated()

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.find();
    res.success(users);
  })
);

app.use(errorHandler); // register last
```

---

## Custom error classes

Throw these from anywhere (services, controllers, validators) - `errorHandler`
converts them into a standardized response automatically.

```js
const { NotFoundError, ValidationError, UnauthorizedError, ApiError } = require("api-response-utility");

router.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError("User not found");
    res.success(user);
  })
);
```

`throw new NotFoundError("User not found")` becomes:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found",
  "errors": [],
  "timestamp": "ISO_DATE"
}
```

Available classes: `ApiError`, `ValidationError` (422), `NotFoundError` (404),
`UnauthorizedError` (401), `ForbiddenError` (403), `ConflictError` (409),
`TooManyRequestsError` (429), `InternalServerError` (500).

```js
throw new ValidationError([{ field: "email", msg: "Invalid email address" }]);
```

---

## Express integration (all-in-one)

```js
const express = require("express");
const apiResponse = require("api-response-utility");
const { attachResponseMethods, errorHandler, NotFoundError, routeNotFound } = apiResponse;

const app = express();
app.use(express.json());
app.use(attachResponseMethods);

app.get(
  "/users/:id",
  apiResponse(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError("User not found");
    res.success(user, "User fetched successfully");
  })
);

// 404 fallback
app.use((req, res) => {
  res.status(404).json(routeNotFound(req.originalUrl));
});

// centralized error handler - always last
app.use(errorHandler);
```

---

## TypeScript

Ships with a dependency-free `index.d.ts` (no `@types/express` required).
Because the module uses a single callable default export, the default
import doubles as a type namespace:

```ts
import apiResponse from "api-response-utility";

interface User {
  id: number;
  name: string;
}

const response: apiResponse.ApiResponse<User> = apiResponse.success(
  { id: 1, name: "Ada" },
  "User fetched successfully",
  200
);

router.get(
  "/users",
  apiResponse(async (req, res) => {
    const users = await User.find();
    apiResponse.success(res, 200, "Users fetched successfully", users);
  })
);

const page: apiResponse.PaginationResponse<User> = apiResponse.buildPagination(users, {
  page: 1,
  limit: 10,
  totalRecords: 100,
});
```

Available types: `ApiResponse<T>`, `ApiErrorResponse`, `PaginationResponse<T>`,
`PaginationMeta`, `PaginationOptions`, `StatusCodesMap`, `ResponseLike`,
`RequestLike`, `AsyncRequestHandler<Req, Res>`.

> Requires `esModuleInterop: true` in `tsconfig.json` (the default in modern
> setups) for the `import apiResponse from "..."` syntax.

---

## Full API reference

| Export | Description |
| --- | --- |
| `apiResponse(fn)` | Default export - wraps an async handler (`asyncHandler`) |
| `success(data, message?, statusCode?)` | Build a success payload |
| `success(res, statusCode?, message?, data?)` | Send a success response |
| `error(message?, statusCode?, errors?, err?)` | Build an error payload |
| `error(res, statusCode?, message?, errors?, err?)` | Send an error response |
| `validationError(errors?, message?)` | 422 payload |
| `routeNotFound(path?)` | 404 payload for unmatched routes |
| `notFound(message?)` | 404 payload |
| `unauthorized(message?)` | 401 payload |
| `forbidden(message?)` | 403 payload |
| `conflict(message?)` | 409 payload |
| `tooManyRequests(message?)` | 429 payload |
| `internalServerError(message?)` | 500 payload |
| `buildPagination(data, options?, message?)` | Build a paginated payload |
| `paginated(res, data, options?, message?)` | Send a paginated response |
| `StatusCodes` | Frozen map of common HTTP status codes |
| `attachResponseMethods` | Middleware adding `res.success`/`res.error`/`res.paginated` |
| `errorHandler` | Centralized Express error-handling middleware |
| `ApiError`, `ValidationError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, `TooManyRequestsError`, `InternalServerError` | Throwable error classes |

---

## Migration guide (1.0.x → 1.1.0)

**No breaking changes.** Every 1.0.x call still works exactly as before:

```js
// still works, unchanged:
res.status(200).json(success(userData, "User retrieved successfully"));
res.status(500).json(error("Something went wrong", 500));
```

The only visible difference is an added `timestamp` field on every response
object - additive, and safe unless your tests assert on an exact deep-equal
object shape (in which case, add `timestamp: expect.any(String)` or similar).

To adopt the new features, opt in incrementally:

1. Swap `res.status(code).json(success(...))` for `apiResponse.success(res, code, message, data)`.
2. Add `app.use(errorHandler)` as your last middleware and start throwing `ApiError` subclasses instead of manually building error payloads.
3. Wrap async routes in `asyncHandler` (the module's default export) to drop manual `try/catch`.
4. Use `buildPagination`/`paginated` for list endpoints.

---

## Testing

```bash
npm test            # jest + a TypeScript type-check pass
npm run test:watch
npm run test:coverage
npm run test:types  # tsc --noEmit against index.d.ts
```

---

## Publishing

```bash
npm version patch   # or minor / major
npm publish
```

`prepublishOnly` runs the full test suite (including the TypeScript
type-check) before every publish, so a broken build can never ship.

---

## Credits

Implementation (c) 2025 Gulam Ashraf. [MIT LICENSE](./LICENSE)
