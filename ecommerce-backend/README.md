# Stockroom — Product Management API (Task 1)

RESTful backend for the [Frontend-ecommerce-admin-app](https://github.com/Josseun/Frontend-ecommerce-admin-app).  
Implements **Task 1 – Product Management API** from the internship brief.

## Features

- JWT-based authentication (`POST /api/auth/login`)
- Full Product CRUD with validation matching the frontend:
  - name required
  - price > 0
  - stockQuantity ≥ 0
  - description required
- Meaningful HTTP status codes and error messages
- CORS enabled for local frontend development
- Clean layered structure (routes → controllers → repository)

## Tech Stack

| Layer        | Choice                          |
|--------------|---------------------------------|
| Runtime      | Node.js                         |
| Framework    | Express                         |
| Auth         | JWT + bcryptjs                  |
| Validation   | express-validator               |
| Data store   | In-memory (easy to swap for MongoDB / PostgreSQL / MySQL) |

> **Note on database:** For simplicity and zero external services this starter uses an in-memory store that is seeded on every server start.  
> The repository pattern (`src/config/db.js`) makes it trivial to replace with Mongoose, Prisma, or TypeORM later.

## Project Structure

```
src/
├── config/
│   └── db.js              # In-memory product & user repositories
├── controllers/
│   ├── authController.js
│   └── productController.js
├── middleware/
│   ├── auth.js            # JWT authenticate + requireAdmin
│   └── validate.js        # express-validator rules
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
├── utils/
│   └── id.js
└── server.js              # Entry point
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env
# (optional) edit JWT_SECRET

# 3. Start the server
npm start
# or with auto-reload (Node 18+)
npm run dev
```

Server starts at **http://localhost:8000**

### Default admin credentials

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@stockroom.com`  |
| Password | `admin123`             |

## Connecting the Frontend

In the frontend project:

```bash
cp .env.example .env
```

Set:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Restart the Vite dev server. Mock mode turns off automatically and every request will hit this API.

## API Endpoints

Base URL: `http://localhost:8000/api`

### Auth

| Method | Path            | Auth | Description                  |
|--------|-----------------|------|------------------------------|
| POST   | `/auth/login`   | No   | Login → `{ token, user }`    |

**Request body**
```json
{
  "email": "admin@stockroom.com",
  "password": "admin123"
}
```

**Success (200)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Admin",
    "email": "admin@stockroom.com",
    "role": "admin"
  }
}
```

### Products (all require `Authorization: Bearer <token>`)

| Method | Path              | Description            |
|--------|-------------------|------------------------|
| GET    | `/products`       | List all products      |
| GET    | `/products/:id`   | Get single product     |
| POST   | `/products`       | Create product         |
| PUT    | `/products/:id`   | Update product         |
| DELETE | `/products/:id`   | Delete product         |

**Product shape**
```json
{
  "id": "1",
  "name": "Wireless Mechanical Keyboard",
  "price": 45000,
  "description": "Hot-swappable switches, USB-C, RGB backlight.",
  "stockQuantity": 12,
  "category": "Electronics",
  "image": "",
  "createdAt": "2026-08-28T...",
  "updatedAt": "2026-08-28T..."
}
```

**Create / Update body**
```json
{
  "name": "New Product",
  "price": 19999,
  "description": "A great product.",
  "stockQuantity": 50,
  "category": "Electronics",   // optional
  "image": "https://..."       // optional
}
```

### Validation errors (400)

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "price", "message": "Price must be greater than zero." }
  ]
}
```

### Auth errors

- `401` – Missing / invalid / expired token, or wrong credentials
- `403` – Authenticated but not admin (if `requireAdmin` is enabled)
- `404` – Product not found

## Environment Variables

| Variable       | Default                          | Description                |
|----------------|----------------------------------|----------------------------|
| `PORT`         | `8000`                           | Server port                |
| `JWT_SECRET`   | (required)                       | Secret for signing tokens  |
| `JWT_EXPIRES_IN` | `7d`                           | Token lifetime             |
| `NODE_ENV`     | `development`                    | Affects logging            |

## Database Schema (conceptual)

Even though the current store is in-memory, the intended schema is:

**products**
| Field          | Type     | Constraints              |
|----------------|----------|--------------------------|
| id             | string   | PK                       |
| name           | string   | required, max 200        |
| price          | number   | required, > 0            |
| description    | string   | required                 |
| stockQuantity  | integer  | required, ≥ 0            |
| category       | string   | optional                 |
| image          | string   | optional (URL)           |
| createdAt      | datetime |                          |
| updatedAt      | datetime |                          |

**users**
| Field    | Type   | Constraints          |
|----------|--------|----------------------|
| id       | string | PK                   |
| name     | string |                      |
| email    | string | unique               |
| password | string | hashed               |
| role     | string | e.g. `admin`         |

## Postman / Testing

1. Import the collection below or create requests manually.
2. Login first → copy the `token`.
3. Set a collection variable `token` and use `Authorization: Bearer {{token}}` on product requests.

Example curl:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stockroom.com","password":"admin123"}'

# List products
curl http://localhost:8000/api/products \
  -H "Authorization: Bearer <token>"

# Create
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":1000,"description":"Desc","stockQuantity":5}'
```

## Reflection (Task 1)

**Development approach**  
I matched the exact contract expected by the provided React admin frontend (routes, response shapes, validation rules). A thin repository layer keeps the controllers free of storage details so the same code can later sit on MongoDB, PostgreSQL or MySQL.

**Challenges**  
- Keeping the response shape identical to the frontend mock so zero frontend changes are needed.  
- Providing a secure-enough auth story for Task 1 without over-engineering future role/permission features.

**How they were addressed**  
- Used the frontend service files as the source of truth for paths and payloads.  
- Seeded a well-known admin account and documented it clearly.

**Future improvements**  
- Swap the in-memory store for MongoDB (Mongoose) or PostgreSQL (Prisma).  
- Add pagination, filtering and search on `GET /products`.  
- Add user registration and role-based route guards for later tasks (orders, payments).  
- Add rate-limiting and Helmet for production hardening.  
- Generate OpenAPI/Swagger docs automatically.

## License

MIT
