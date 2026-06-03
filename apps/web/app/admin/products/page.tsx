"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Boxes, Edit3, Package, Plus, Search, Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/AdminGuard";
import { money } from "@/components/ProductCard";
import { api, type Product } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const metrics = useMemo(() => ({
    total: products.length,
    units: products.reduce((sum, product) => sum + product.stock, 0),
    lowStock: products.filter((product) => product.stock <= 5).length
  }), [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return products;

    return products.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(term));
  }, [products, search]);

  const loadProducts = async () => {
    const nextProducts = await api.listProducts();
    setProducts(nextProducts);
  };

  useEffect(() => {
    let active = true;

    api.listProducts()
      .then((nextProducts) => {
        if (active) setProducts(nextProducts);
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar los productos");
      });

    return () => {
      active = false;
    };
  }, []);

  const remove = async (product: Product) => {
    if (!confirm(`¿Eliminar ${product.name}?`)) return;
    const token = getToken();
    if (!token) return;

    try {
      await api.deleteProduct(product.id, token);
      await loadProducts();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo eliminar");
    }
  };

  return (
    <AdminGuard>
      <div className="grid gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-terracotta">Inventario</span>
            <h1 className="font-serif text-4xl font-bold leading-none tracking-[-0.05em]">Productos</h1>
            <p className="mt-2 text-sm text-muted">Administra precios, stock y publicación del catálogo.</p>
          </div>
          <Link className="inline-flex items-center justify-center gap-2 rounded-md bg-charcoal px-4 py-2.5 text-center text-sm font-black text-cream transition hover:bg-terracotta" href="/admin/products/new">
            <Plus className="size-4" strokeWidth={2.4} />
            Crear producto
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-white/75 p-4">
            <div className="flex items-center justify-between gap-3"><span className="text-xs font-black uppercase tracking-[0.12em] text-muted">Productos activos</span><Package className="size-4 text-terracotta" strokeWidth={2.3} /></div>
            <strong className="mt-2 block text-3xl tracking-[-0.04em]">{metrics.total}</strong>
          </div>
          <div className="rounded-xl bg-white/75 p-4">
            <div className="flex items-center justify-between gap-3"><span className="text-xs font-black uppercase tracking-[0.12em] text-muted">Unidades en stock</span><Boxes className="size-4 text-terracotta" strokeWidth={2.3} /></div>
            <strong className="mt-2 block text-3xl tracking-[-0.04em]">{metrics.units}</strong>
          </div>
          <div className="rounded-xl bg-white/75 p-4">
            <div className="flex items-center justify-between gap-3"><span className="text-xs font-black uppercase tracking-[0.12em] text-muted">Stock bajo</span><AlertTriangle className="size-4 text-terracotta" strokeWidth={2.3} /></div>
            <strong className="mt-2 block text-3xl tracking-[-0.04em]">{metrics.lowStock}</strong>
          </div>
        </div>

        {error && <div className="rounded-lg bg-red-100 p-3 font-black text-red-800">{error}</div>}

        <div className="rounded-xl bg-white/80">
          <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-black">Listado de productos</h2>
              <p className="text-xs font-bold text-muted">{filteredProducts.length} de {products.length} productos</p>
            </div>
            <label className="relative sm:w-64">
              <span className="sr-only">Buscar en productos</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={2.2} />
              <input className="h-9 w-full rounded-lg border border-ink/15 bg-white pl-9 pr-3 text-xs font-bold outline-none transition placeholder:text-muted/70 focus:border-charcoal focus:ring-4 focus:ring-ink/10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto" />
            </label>
          </div>

          <div className="overflow-x-auto">
          {products.length === 0 ? <div className="p-12 text-center text-muted">Todavía no hay productos.</div> : filteredProducts.length === 0 ? <div className="p-12 text-center text-muted">No hay productos para esta búsqueda.</div> : (
            <table className="w-full min-w-[820px] border-collapse">
              <thead className="bg-paper/70">
                <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-muted">
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="transition hover:bg-paper/45">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-paper"><Image className="object-contain p-1" src={product.imageUrl} alt={product.name} fill sizes="56px" /></div>
                        <div><strong className="text-sm">{product.name}</strong><p className="line-clamp-1 text-sm text-muted">{product.description}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-black">{money(product.price)}</td>
                    <td className="px-4 py-3 text-sm font-bold">{product.stock}</td>
                    <td className="px-4 py-3"><span className={product.stock <= 5 ? "rounded-md bg-red-100 px-2.5 py-1 text-xs font-black text-red-800" : "rounded-md bg-sage/15 px-2.5 py-1 text-xs font-black text-sage"}>{product.stock <= 5 ? "Revisar" : "Publicado"}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link className="grid size-9 place-items-center rounded-md border border-ink/15 bg-white text-ink transition hover:border-ink/30 hover:bg-paper" href={`/admin/products/${product.id}/edit`} aria-label={`Editar ${product.name}`}>
                          <Edit3 className="size-4" strokeWidth={2.2} />
                        </Link>
                        <button className="grid size-9 place-items-center rounded-md bg-red-800 text-white transition hover:bg-red-900" onClick={() => remove(product)} aria-label={`Eliminar ${product.name}`}>
                          <Trash2 className="size-4" strokeWidth={2.2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
