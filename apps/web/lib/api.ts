export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(payload.message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const api = {
  async listProducts(search?: string) {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    const data = await parseResponse<{ products: Product[] }>(await fetch(`${apiUrl}/api/products${params}`, { cache: "no-store" }));
    return data.products;
  },

  async getProduct(id: string | number) {
    const data = await parseResponse<{ product: Product }>(await fetch(`${apiUrl}/api/products/${id}`, { cache: "no-store" }));
    return data.product;
  },

  async login(email: string, password: string) {
    return parseResponse<{ token: string; user: { id: number; name: string; email: string; role: string } }>(await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }));
  },

  async me(token: string) {
    return parseResponse<{ user: { id: number; name: string; email: string; role: string } }>(await fetch(`${apiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    }));
  },

  async createProduct(input: ProductInput, token: string) {
    const data = await parseResponse<{ product: Product }>(await fetch(`${apiUrl}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(input)
    }));
    return data.product;
  },

  async updateProduct(id: number, input: ProductInput, token: string) {
    const data = await parseResponse<{ product: Product }>(await fetch(`${apiUrl}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(input)
    }));
    return data.product;
  },

  async deleteProduct(id: number, token: string) {
    await parseResponse<void>(await fetch(`${apiUrl}/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }));
  }
};
