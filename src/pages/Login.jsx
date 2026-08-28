import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { MOCK_MODE } from '../services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/products'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stock-navy px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-semibold text-white tracking-tight">
            Stockroom
          </span>
          <p className="text-white/50 text-sm mt-1">Sign in to manage products</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-panel rounded-sm p-6 space-y-4 shadow-xl">
          {MOCK_MODE && (
            <p className="text-xs text-amber-dark bg-amber/15 border border-amber/40 rounded-sm px-3 py-2">
              Mock mode: any email and password will sign you in.
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-black/10 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber"
              placeholder="admin@stockroom.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-black/10 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-out">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stock-navy text-white text-sm font-medium py-2.5 rounded-sm hover:bg-stock-navyLight transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
