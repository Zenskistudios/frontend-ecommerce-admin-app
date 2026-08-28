import { MOCK_MODE } from '../services/api'

export default function MockModeBanner() {
  if (!MOCK_MODE) return null

  return (
    <div className="bg-amber/15 border border-amber/40 text-amber-dark text-sm px-4 py-2 rounded-sm mb-6">
      Running on mock data — set <code className="font-mono">VITE_API_BASE_URL</code> in
      <code className="font-mono">.env</code> to connect the real backend.
    </div>
  )
}
