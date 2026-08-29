# Stockroom — Product Admin Frontend

React + Tailwind admin dashboard for managing products, including login,
listing, creation, editing, and deletion. The app matches the backend's
validation rules and includes a mock mode for local UI development.

## Features

- Login screen with token-based authentication
- Protected product routes
- Product list with stock badges
- Create/edit product form
- Validation for:
  - product name required
  - price greater than zero
  - stock quantity not negative
  - description required
- Mock mode fallback when no backend URL is configured

## Project structure

```text
src/
  App.jsx
  main.jsx
  index.css
  components/
  context/
  pages/
  router/
  services/
```

## Local development

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_MOCK_MODE=false
```

Run the app:

```bash
npm run dev
```

## Mock mode

When `VITE_API_BASE_URL` is not set, the app automatically switches to mock
mode. In that mode, the services return in-memory data so the UI stays usable
without the real backend.

This is controlled in:

- [src/services/api.js](src/services/api.js)
- [src/services/authService.js](src/services/authService.js)
- [src/services/productService.js](src/services/productService.js)

## Backend contract

Expected API endpoints:

```text
POST /api/auth/login
GET  /api/products
GET  /api/products/:id
POST /api/products
PUT  /api/products/:id
DELETE /api/products/:id
```

Authentication uses a Bearer token stored in localStorage. The Axios client in
[src/services/api.js](src/services/api.js) automatically attaches the token and
redirects to the login route on 401 responses.

## Production deployment

This project is deployment-ready with a frontend + backend split.

### Frontend config

Use a production `.env` file:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_MOCK_MODE=false
```

A production SPA rewrite file is included at [vercel.json](vercel.json):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend config

The backend is in the [ecommerce-backend](ecommerce-backend) folder. Production env
values should include:

```env
PORT=10000
NODE_ENV=production
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

Render deployment config is included at [ecommerce-backend/render.yaml](ecommerce-backend/render.yaml).

## Deployment notes

The project was verified to build successfully after installing dependencies:

```bash
npm install
npm run build
```

The backend was also validated and confirmed to fail on port conflicts when
`8000` is already occupied, which is why production config uses a different port
in the deployment example.

## Default admin login

For the local/dev backend:

- Email: `admin@stockroom.com`
- Password: `admin123`

## Important production security note

Do not keep the default JWT secret or demo admin credentials in a live deploy.
Use a strong secret and ideally replace the seeded admin account in production.

## License

This project is intended for educational/demo use in the Stockroom admin app setup.
