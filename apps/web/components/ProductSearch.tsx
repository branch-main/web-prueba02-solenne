"use client";

import Link from "next/link";
import { FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductCategory, ProductListParams, ProductSort } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export const categories: ProductCategory[] = ["Todos", "Hogar", "Cocina", "Tecnología", "Bolsos"];
export const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Destacados" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "stock", label: "Más stock" }
];

const catalogPath = ({ search, category, sort }: ProductListParams) => {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category && category !== "Todos") params.set("category", category);
  if (sort && sort !== "featured") params.set("sort", sort);

  return params.size > 0 ? `/?${params.toString()}#catalogo` : "/#catalogo";
};

export function ProductSearch({ products, params }: { products: Product[]; params: Required<ProductListParams> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const search = String(form.get("search") || "").trim();
    const sort = String(form.get("sort") || "featured") as ProductSort;

    startTransition(() => router.push(catalogPath({ search, category: params.category, sort })));
  };

  return (
    <section className="py-8" aria-busy={isPending}>
      <div className="mb-6 flex flex-col gap-5 pb-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-terracotta">Catálogo</span>
            <h2 className="font-serif text-3xl font-bold leading-none tracking-[-0.045em] md:text-5xl">Compra por colección</h2>
            <p className="mt-2 text-muted">{products.length} productos disponibles</p>
          </div>

          <form className="grid gap-2 sm:grid-cols-[320px_155px]" onSubmit={submit}>
            <label className="relative">
              <span className="sr-only">Buscar producto</span>
              <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input name="search" className="h-9 w-full rounded-md border border-ink/15 bg-white/70 pl-8 pr-2.5 text-xs font-bold outline-none transition placeholder:text-muted/70 focus:border-charcoal focus:bg-white focus:ring-4 focus:ring-ink/10" defaultValue={params.search} placeholder="Buscar producto" />
            </label>
            <select name="sort" className="h-9 rounded-md border border-ink/15 bg-white/70 px-2.5 text-xs font-black outline-none transition focus:border-charcoal focus:bg-white" defaultValue={params.sort} onChange={(event) => event.currentTarget.form?.requestSubmit()}>
              {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </form>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((item) => (
            <Link key={item} className={params.category === item ? "rounded-md bg-charcoal px-2.5 py-1.5 text-xs font-black text-cream" : "rounded-md border border-ink/15 bg-white/50 px-2.5 py-1.5 text-xs font-black text-muted transition hover:border-ink/30 hover:bg-white hover:text-ink"} href={catalogPath({ search: params.search, category: item, sort: params.sort })}>
              {item}
            </Link>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="grid place-items-center rounded-xl bg-white/55 px-6 py-14 text-center">
          <div className="grid size-12 place-items-center rounded-full bg-sand text-muted">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="mt-4 font-serif text-2xl font-bold tracking-[-0.04em]">No encontramos productos</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">Prueba con otra búsqueda, cambia la categoría o vuelve a ver todo el catálogo disponible.</p>
          <Link className="mt-5 rounded-md bg-charcoal px-4 py-2 text-sm font-black text-cream transition hover:bg-terracotta" href="/#catalogo">
            Limpiar filtros
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </section>
  );
}
