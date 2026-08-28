# Stockroom — Product Admin Frontend

React + Tailwind admin UI for Task 1's Product Management API: login, product
list, and a create/edit form with the same validation rules the backend
enforces (name required, price > 0, stock ≥ 0, description required).

## Why it works without the backend yet

`src/services/api.js` exports `MOCK_MODE`, which turns on automatically when
`VITE_API_BASE_URL` isn't set. While it's on, `productService.js` and
`authService.js` serve data from an in-memory array instead of calling the
network, so every screen is fully clickable. Once your backend has a route,
set `VITE_API_BASE_URL` in `.env` (see `.env.example`) and mock mode turns
itself off — no component code changes needed.

## Install & run

```bash
npm install
cp .env.example .env   # edit VITE_API_BASE_URL when the backend is live
npm run dev
```

## Connecting the real backend

Edit `src/services/productService.js` and `src/services/authService.js` if
your routes differ from the placeholder contract:

```
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id
POST   /auth/login   -> { token, user }
```

The axios instance in `src/services/api.js` already attaches
`Authorization: Bearer <token>` from `localStorage` to every request, and
redirects to `/login` on a 401.

## Structure

```
src/
  pages/         Login, ProductList, ProductForm
  components/    Sidebar, ProtectedRoute, StockBadge, MockModeBanner
  services/      api.js (axios), productService.js, authService.js
  context/       AuthContext.jsx
```
