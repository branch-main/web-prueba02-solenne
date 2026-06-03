"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

const categories = ["Todos", "Hogar", "Cocina", "Tecnología", "Bolsos"];

const matchesCategory = (product: Product, category: string) => {
  const text = `${product.name} ${product.description}`.toLowerCase();

  if (category === "Todos") return true;
  if (category === "Hogar") return /lámpara|cerámica|manta|hogar|mesa/.test(text);
  if (category === "Cocina") return /café|tetera|cocina|jarra|servicio/.test(text);
  if (category === "Tecnología") return /altavoz|audio|inalámbrico|cargador/.test(text);
  if (category === "Bolsos") return /bolso|tote|viaje|lona/.test(text);

  return true;
};

export function ProductSearch({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) && matchesCategory(product, category));

    if (sort === "price-asc") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...result].sort((a, b) => b.price - a.price);
    if (sort === "stock") return [...result].sort((a, b) => b.stock - a.stock);

    return result;
  }, [category, products, search, sort]);

  return (
    <section className="py-8">
      <div className="mb-6 flex flex-col gap-5 pb-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-terracotta">Catálogo</span>
            <h2 className="font-serif text-3xl font-bold leading-none tracking-[-0.045em] md:text-5xl">Compra por colección</h2>
            <p className="mt-2 text-muted">{filteredProducts.length} productos disponibles</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-[320px_155px]">
            <label className="relative">
              <span className="sr-only">Buscar producto</span>
              <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input className="h-9 w-full rounded-md border border-ink/15 bg-white/70 pl-8 pr-2.5 text-xs font-bold outline-none transition placeholder:text-muted/70 focus:border-charcoal focus:bg-white focus:ring-4 focus:ring-ink/10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto" />
            </label>
            <select className="h-9 rounded-md border border-ink/15 bg-white/70 px-2.5 text-xs font-black outline-none transition focus:border-charcoal focus:bg-white" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="stock">Más stock</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((item) => (
            <button key={item} className={category === item ? "rounded-md bg-charcoal px-2.5 py-1.5 text-xs font-black text-cream" : "rounded-md border border-ink/15 bg-white/50 px-2.5 py-1.5 text-xs font-black text-muted transition hover:border-ink/30 hover:bg-white hover:text-ink"} type="button" onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="grid place-items-center rounded-xl bg-white/55 px-6 py-14 text-center">
          <div className="grid size-12 place-items-center rounded-full bg-sand text-muted">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="mt-4 font-serif text-2xl font-bold tracking-[-0.04em]">No encontramos productos</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">Prueba con otra búsqueda, cambia la categoría o vuelve a ver todo el catálogo disponible.</p>
          <button className="mt-5 rounded-md bg-charcoal px-4 py-2 text-sm font-black text-cream transition hover:bg-terracotta" type="button" onClick={() => { setSearch(""); setCategory("Todos"); setSort("featured"); }}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </section>
  );
}
