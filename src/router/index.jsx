import Login from '../pages/Login.jsx'
import ProductList from '../pages/ProductList.jsx'
import ProductForm from '../pages/ProductForm.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import { createBrowserRouter, Navigate } from 'react-router'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/products',
    element: (
      <ProtectedRoute>
        <ProductList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/products/new',
    element: (
      <ProtectedRoute>
        <ProductForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/products/:id/edit',
    element: (
      <ProtectedRoute>
        <ProductForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/products" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/products" replace />,
  },
])

export default router
