"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Save } from "lucide-react";
import { api, type Product, type ProductInput } from "@/lib/api";
import { getToken } from "@/lib/auth";

type ProductFormProps = {
  product?: Product;
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductInput>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 1,
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: keyof ProductInput, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: key === "price" || key === "stock" ? Number(value) : value
    }));
  };

  const canPreviewImage = /^https:\/\/images\.unsplash\.com\//.test(form.imageUrl || "");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    try {
      const payload = { ...form, imageUrl: form.imageUrl?.trim() || undefined };
      if (product) {
        await api.updateProduct(product.id, payload, token);
        setSuccess("Producto actualizado.");
      } else {
        await api.createProduct(payload, token);
        setSuccess("Producto creado.");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid gap-5" onSubmit={submit}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.16em] text-terracotta">Catálogo</span>
          <h1 className="font-serif text-4xl font-bold leading-none tracking-[-0.05em]">{product ? "Editar producto" : "Nuevo producto"}</h1>
          <p className="mt-2 text-sm text-muted">Completa la información que verá el cliente en la tienda.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-black text-muted transition hover:text-ink" href="/admin/products">
            Cancelar
          </Link>
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-charcoal px-4 py-2.5 text-sm font-black text-cream transition hover:bg-terracotta disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
            <Save className="size-4" strokeWidth={2.3} />
            {loading ? "Guardando..." : product ? "Actualizar producto" : "Crear producto"}
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-100 p-3 text-sm font-black text-red-800">{error}</div>}
      {success && <div className="rounded-lg bg-sage/15 p-3 text-sm font-black text-sage">{success}</div>}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 rounded-xl bg-white/80 p-4 md:grid-cols-2">
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-black">Nombre</span>
            <input className="h-11 rounded-lg border border-ink/15 bg-white px-3 text-sm font-bold outline-none transition focus:border-charcoal focus:ring-4 focus:ring-ink/10" value={form.name} onChange={(event) => update("name", event.target.value)} required />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-black">Descripción</span>
            <textarea className="min-h-36 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm font-bold leading-6 outline-none transition focus:border-charcoal focus:ring-4 focus:ring-ink/10" value={form.description} onChange={(event) => update("description", event.target.value)} required />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-black">Precio</span>
            <input className="h-11 rounded-lg border border-ink/15 bg-white px-3 text-sm font-bold outline-none transition focus:border-charcoal focus:ring-4 focus:ring-ink/10" type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => update("price", event.target.value)} required />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-black">Stock</span>
            <input className="h-11 rounded-lg border border-ink/15 bg-white px-3 text-sm font-bold outline-none transition focus:border-charcoal focus:ring-4 focus:ring-ink/10" type="number" min="0" step="1" value={form.stock} onChange={(event) => update("stock", event.target.value)} required />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-black">URL de imagen</span>
            <input className="h-11 rounded-lg border border-ink/15 bg-white px-3 text-sm font-bold outline-none transition focus:border-charcoal focus:ring-4 focus:ring-ink/10" type="url" value={form.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} placeholder="Déjalo vacío para usar el proveedor de imágenes" />
          </label>
        </div>

        <aside className="rounded-xl bg-white/80 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Vista previa</p>
          <div className="mt-3 overflow-hidden rounded-xl bg-paper">
            {canPreviewImage ? (
              <div className="relative h-64">
                <Image className="object-contain p-3" src={form.imageUrl || ""} alt={form.name || "Vista previa del producto"} fill sizes="320px" />
              </div>
            ) : (
              <div className="grid h-64 place-items-center text-muted">
                <ImageIcon className="size-8" strokeWidth={1.8} />
              </div>
            )}
          </div>
          <h2 className="mt-4 font-serif text-2xl font-bold leading-none tracking-[-0.04em]">{form.name || "Nombre del producto"}</h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{form.description || "La descripción aparecerá aquí mientras completas el formulario."}</p>
          <div className="mt-4 flex items-center justify-between gap-3 text-sm font-black">
            <span>S/ {Number(form.price || 0).toFixed(2)}</span>
            <span className={form.stock <= 5 ? "text-red-800" : "text-sage"}>{form.stock} en stock</span>
          </div>
        </aside>
      </div>
    </form>
  );
}
