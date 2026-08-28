import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

const linkClasses = ({ isActive }) =>
  `block px-4 py-2.5 rounded-sm text-sm font-medium transition-colors ${
    isActive
      ? "bg-amber text-stock-navy"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-full bg-stock-navy flex flex-col lg:w-60 lg:min-h-screen lg:shrink-0">
      <div className="px-5 py-6 border-b border-white/10">
        <span className="font-display text-xl font-semibold text-white tracking-tight">
          Stockroom
        </span>
        <p className="text-xs text-white/40 mt-0.5">Product admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavLink to="/products" className={linkClasses}>
          Products
        </NavLink>
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <p className="px-4 text-xs text-white/40 truncate">{user?.email}</p>
        <button
          onClick={logout}
          className="mt-2 w-full text-left px-4 py-2 rounded-sm text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
