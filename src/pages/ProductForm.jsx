import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Sidebar from "../components/Sidebar.jsx";
import {
  getProduct,
  createProduct,
  updateProduct,
} from "../services/productService";

const emptyForm = {
  name: "",
  price: "",
  description: "",
  stockQuantity: "",
  category: "",
  imageUrl: "",
};

// Mirrors the validation rules in the Task 1 spec, so bad input never
// reaches the API in the first place.
function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Product name is required.";
  if (form.price === "" || Number(form.price) <= 0)
    errors.price = "Price must be greater than zero.";
  if (form.stockQuantity === "" || Number(form.stockQuantity) < 0)
    errors.stockQuantity = "Stock quantity cannot be negative.";
  if (!form.description.trim()) errors.description = "Description is required.";
  return errors;
}

export default function ProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    getProduct(id)
      .then((product) =>
        setForm({
          name: product.name ?? "",
          price: product.price ?? "",
          description: product.description ?? "",
          stockQuantity: product.stockQuantity ?? "",
          category: product.category ?? "",
          imageUrl: product.imageUrl ?? "",
        }),
      )
      .catch((err) =>
        setSubmitError(err.response?.data?.message || err.message),
      )
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    setSubmitError("");
    const payload = {
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
    };

    try {
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/products");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Save failed",
      );
    } finally {
      setSaving(false);
    }
  }

  const fieldClass = (field) =>
    `w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber ${
      errors[field] ? "border-out" : "border-black/10"
    }`;

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 px-4 py-4 md:px-8 md:py-8">
        <div className="w-full max-w-2xl">
          <h1 className="font-display text-2xl font-semibold text-ink mb-6">
            {isEditing ? "Edit product" : "Add product"}
          </h1>

          {loading ? (
            <p className="text-sm text-ink/50">Loading product…</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-panel rounded-sm border border-black/5 p-4 space-y-5 md:p-6"
            >
              {submitError && (
                <p className="text-sm text-out bg-out/10 border border-out/30 rounded-sm px-4 py-2">
                  {submitError}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Product name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={fieldClass("name")}
                  placeholder="Wireless Mechanical Keyboard"
                />
                {errors.name && (
                  <p className="text-xs text-out mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className={fieldClass("price")}
                    placeholder="45000"
                  />
                  {errors.price && (
                    <p className="text-xs text-out mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1">
                    Stock quantity
                  </label>
                  <input
                    type="number"
                    value={form.stockQuantity}
                    onChange={(e) =>
                      handleChange("stockQuantity", e.target.value)
                    }
                    className={fieldClass("stockQuantity")}
                    placeholder="12"
                  />
                  {errors.stockQuantity && (
                    <p className="text-xs text-out mt-1">
                      {errors.stockQuantity}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={fieldClass("description")}
                  rows={3}
                  placeholder="Hot-swappable switches, USB-C, RGB backlight."
                />
                {errors.description && (
                  <p className="text-xs text-out mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Category (optional)
                </label>
                <input
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={fieldClass("category")}
                  placeholder="Electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Image URL (optional)
                </label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  className={fieldClass("imageUrl")}
                  placeholder="https://…"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-stock-navy text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-stock-navyLight transition-colors disabled:opacity-50"
                >
                  {saving
                    ? "Saving…"
                    : isEditing
                      ? "Save changes"
                      : "Add product"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="text-sm font-medium px-5 py-2.5 rounded-sm text-ink/60 hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
