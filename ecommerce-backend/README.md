# Stockroom — Product Management API

RESTful backend for the frontend admin dashboard. It provides JWT authentication,
product CRUD, request validation, and a seeded admin account for local testing
and deployment demos.

## Features

- JWT authentication via `POST /api/auth/login`
- Product CRUD endpoints
- Validation matching the frontend app rules:
  - name required
  - price > 0
  - stockQuantity >= 0
  - description required
- CORS support for local frontend development
- In-memory repository with a clean service layer
- Production-ready environment configuration pattern

## Tech stack

- Node.js
- Express
- JWT + bcryptjs
- express-validator
- In-memory data store

## Project structure

```text
src/
  config/
    db.js
  controllers/
    authController.js
    productController.js
  middleware/
    auth.js
    validate.js
  routes/
    authRoutes.js
    productRoutes.js
  server.js
```

## Local setup

Install dependencies:

```bash
npm install
```

Create environment variables:

```bash
cp .env.example .env
```

Example:

```env
PORT=8000
JWT_SECRET=your-local-secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Start the API:

```bash
npm start
```

Or with auto-reload:

```bash
npm run dev
```

The server runs at:

```text
http://localhost:8000
```

## Default admin login

```text
Email: admin@stockroom.com
Password: admin123
```

## API endpoints

Base URL:

```text
http://localhost:8000/api
```

### Auth

#### POST /api/auth/login

Request:

```json
{
  "email": "admin@stockroom.com",
  "password": "admin123"
}
```

Response:

```json
{
  "token": "<jwt>",
  "user": {
    "name": "Admin",
    "email": "admin@stockroom.com",
    "role": "admin"
  }
}
```

### Products

All product routes require a Bearer token:

```http
Authorization: Bearer <token>
```

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/products | List products |
| GET | /api/products/:id | Get a single product |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

### Product payload

```json
{
  "name": "Wireless Mechanical Keyboard",
  "price": 45000,
  "description": "Hot-swappable switches, USB-C, RGB backlight.",
  "stockQuantity": 12,
  "category": "Electronics",
  "image": ""
}
```

## Validation rules

The backend validates product input with express-validator:

- name is required
- price must be greater than 0
- stockQuantity must be >= 0
- description is required
- category and image are optional

Validation error example:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "price",
      "message": "Price must be greater than zero."
    }
  ]
}
```

## Frontend integration

The frontend expects the backend to be available at:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

If the frontend is deployed separately, it should point to the deployed backend URL instead.

## Production deployment

Use environment variables such as:

```env
PORT=10000
NODE_ENV=production
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

A production Render config is included at [render.yaml](render.yaml).

## Deployment notes

This backend was verified to run correctly locally. The main deployment issue found during validation was a port conflict on `8000`, which is why the example production config uses port `10000`.

## Security note

- Use a strong production `JWT_SECRET`
- Replace the default seeded admin credentials before exposing the app publicly
- Restrict CORS to your actual frontend domain in production

## License

MIT
