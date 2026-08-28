import { useEffect, useState } from "react";
import { Link } from "react-router";
import Sidebar from "../components/Sidebar.jsx";
import MockModeBanner from "../components/MockModeBanner.jsx";
import StockBadge from "../components/StockBadge.jsx";
import { getProducts, deleteProduct } from "../services/productService";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Could not load products",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Delete failed");
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 px-4 py-4 md:px-8 md:py-8">
        <MockModeBanner />

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              Products
            </h1>
            <p className="text-sm text-ink/50 mt-0.5">
              {products.length} total
            </p>
          </div>
          <Link
            to="/products/new"
            className="bg-stock-navy text-white text-sm font-medium px-4 py-2.5 rounded-sm hover:bg-stock-navyLight transition-colors text-center"
          >
            + Add product
          </Link>
        </div>

        {error && (
          <p className="text-sm text-out bg-out/10 border border-out/30 rounded-sm px-4 py-2 mb-4">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-ink/50">Loading products…</p>
        ) : products.length === 0 ? (
          <div className="bg-panel rounded-sm p-6 text-center border border-black/5 md:p-10">
            <p className="text-ink/60 text-sm">No products yet.</p>
            <Link
              to="/products/new"
              className="text-amber-dark text-sm font-medium mt-2 inline-block"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="bg-panel rounded-sm border border-black/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-left text-ink/50 text-xs uppercase tracking-wide">
                    <th className="px-3 py-3 font-medium md:px-5">Name</th>
                    <th className="px-3 py-3 font-medium md:px-5">Category</th>
                    <th className="px-3 py-3 font-medium md:px-5">Price</th>
                    <th className="px-3 py-3 font-medium md:px-5">Stock</th>
                    <th className="px-3 py-3 font-medium text-right md:px-5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-black/5 last:border-0"
                    >
                      <td className="px-3 py-3.5 md:px-5">
                        <div className="flex items-center gap-3 min-w-0">
                          {product.imageUrl || product.image ? (
                            <img
                              src={product.imageUrl || product.image}
                              alt={product.name}
                              className="h-12 w-12 object-cover rounded-sm border border-black/5 bg-black/5 shrink-0"
                            />
                          ) : null}

                          <div className="min-w-0">
                            <p className="font-medium text-ink truncate max-w-[180px] md:max-w-xs">
                              {product.name}
                            </p>
                            <p className="text-ink/40 text-xs truncate max-w-[180px] md:max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-ink/60 md:px-5">
                        {product.category || "—"}
                      </td>
                      <td className="px-3 py-3.5 text-ink/80 md:px-5">
                        {currency.format(product.price)}
                      </td>
                      <td className="px-3 py-3.5 md:px-5">
                        <StockBadge quantity={product.stockQuantity} />
                      </td>
                      <td className="px-3 py-3.5 text-right space-x-3 md:px-5">
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="text-stock-navy font-medium hover:underline"
                        >
                          Edit
                        </Link>
                        {pendingDeleteId === product.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-out font-medium hover:underline"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setPendingDeleteId(null)}
                              className="text-ink/40 font-medium hover:underline"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setPendingDeleteId(product.id)}
                            className="text-out/80 font-medium hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
