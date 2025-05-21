# 📦 API Response Utility – Usage Guide

A lightweight utility to standardize API responses for Node.js/Express applications. This helps maintain consistent response formats for success and error handling across your backend services.

---

## 🚀 Installation

```bash
npm install api-response-utility
```

### `Importing`

```bash
const {
  success,
  error,
  validationError,
  routeNotFound,
  notFound,
  unauthorized,
  forbidden,
  conflict,
  tooManyRequests,
  internalServerError
} = require('api-response-utility');
```

### `Success Response`

```bash
res.status(200).json(success({ userId: 123 }, "User retrieved successfully"));
```

`Output`

```bash
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "userId": 123
  },
  "statusCode": 200
}
```

### `Error Responses`

```bash
res.status(500).json(error("Something went wrong", 500));
```

`Output`

```bash
{
  "success": false,
  "message": "Something went wrong",
  "errors": [],
  "statusCode": 500
}

```

### `Validation Error`

```bash
res.status(422).json(validationError([
  { field: "email", msg: "Invalid email address" }
]));
```

`Output`

```bash
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "msg": "Invalid email address" }
  ],
  "statusCode": 422
}
```

### `Unauthorized`

```bash
res.status(401).json(unauthorized("You must be logged in"));
```

`Output`

```bash
{
  "success": false,
  "message": "You must be logged in",
  "errors": [],
  "statusCode": 401
}
```

### `Forbidden`

```bash
res.status(403).json(forbidden("Access denied to this resource"));
```

`Output`

```bash
{
  "success": false,
  "message": "Access denied to this resource",
  "errors": [],
  "statusCode": 403
}
```

### `Not Found`

```bash
app.use((req, res) => {
  res.status(404).json(routeNotFound(req.originalUrl));
});
```

`Output`

```bash
{
  "success": false,
  "message": "User not found",
  "errors": [],
  "statusCode": 404
}


```

### `Route Not Found (Fallback Middleware)`

```bash
app.use((req, res) => {
  res.status(404).json(routeNotFound(req.originalUrl));
});
```

`Output`

```bash
{
  "success": false,
  "message": "Route \"/unknown\" not found",
  "statusCode": 404
}


```

### `Conflict`

```bash
res.status(409).json(conflict("Email already exists"));
```

`Output`

```bash
{
  "success": false,
  "message": "Email already exists",
  "errors": [],
  "statusCode": 409
}

```

### `Too Many Requests`

```bash
res.status(429).json(tooManyRequests());
```

`Output`

```bash
{
  "success": false,
  "message": "Too many requests",
  "errors": [],
  "statusCode": 429
}
```

### `Internal Server Error`

```bash
res.status(500).json(internalServerError());
```

`Output`

```bash
{
  "success": false,
  "message": "Internal server error",
  "errors": [],
  "statusCode": 500
}
```

## Credits

Implementation (c) 2025 Gulam Ashraf. [MIT LICENSE](./LICENSE)
