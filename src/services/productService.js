import api, { MOCK_MODE } from "./api";

// --- Placeholder REST contract (matches Task 1's spec) ---
// GET    /products        -> list all products
// GET    /products/:id    -> retrieve one product
// POST   /products        -> create a product
// PUT    /products/:id    -> update a product
// DELETE /products/:id    -> delete a product
//
// Swap these paths for whatever your Express/Django/Flask routes end up
// being — this file is the only place that needs to change.

let mockProducts = [
  {
    id: "1",
    name: "Wireless Mechanical Keyboard",
    price: 45000,
    description: "Hot-swappable switches, USB-C, RGB backlight.",
    stockQuantity: 12,
    category: "Electronics",
    image: "",
  },
  {
    id: "2",
    name: "Ceramic Pour-Over Set",
    price: 18500,
    description: "Hand-glazed dripper and matching mug.",
    stockQuantity: 0,
    category: "Home",
    image: "",
  },
  {
    id: "3",
    name: "Canvas Weekender Bag",
    price: 32000,
    description: "Water-resistant canvas, leather straps.",
    stockQuantity: 4,
    category: "Bags",
    image: "",
  },
];

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const uid = () => Math.random().toString(36).slice(2, 10);

export async function getProducts() {
  if (MOCK_MODE) {
    await delay();
    return [...mockProducts];
  }
  const { data } = await api.get("/products");
  return data;
}

export async function getProduct(id) {
  if (MOCK_MODE) {
    await delay();
    const found = mockProducts.find((p) => p.id === id);
    if (!found) throw new Error("Product not found");
    return found;
  }
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function createProduct(payload) {
  if (MOCK_MODE) {
    await delay();
    const newProduct = { id: uid(), ...payload };
    mockProducts = [newProduct, ...mockProducts];
    return newProduct;
  }
  const { data } = await api.post("/products", payload);
  return data;
}

export async function updateProduct(id, payload) {
  if (MOCK_MODE) {
    await delay();
    mockProducts = mockProducts.map((p) =>
      p.id === id ? { ...p, ...payload } : p,
    );
    return mockProducts.find((p) => p.id === id);
  }
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id) {
  if (MOCK_MODE) {
    await delay();
    mockProducts = mockProducts.filter((p) => p.id !== id);
    return { success: true };
  }
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
