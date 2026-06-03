import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ProductSearch } from "@/components/ProductSearch";
import { api, type ProductCategory, type ProductListParams, type ProductSort } from "@/lib/api";

const categories: ProductCategory[] = ["Todos", "Hogar", "Cocina", "Tecnología", "Bolsos"];
const sorts: ProductSort[] = ["featured", "price-asc", "price-desc", "stock"];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const firstParam = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

const productListParams = async (searchParams: SearchParams): Promise<Required<ProductListParams>> => {
  const params = await searchParams;
  const category = firstParam(params.category);
  const sort = firstParam(params.sort);

  return {
    search: firstParam(params.search)?.trim() || "",
    category: category && categories.includes(category as ProductCategory) ? category as ProductCategory : "Todos",
    sort: sort && sorts.includes(sort as ProductSort) ? sort as ProductSort : "featured"
  };
};

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white">
      <div className="h-48 animate-pulse bg-sand xl:h-44" />
      <div className="grid gap-3 p-3">
        <div className="flex items-start justify-between gap-4">
          <div className="h-5 w-3/5 animate-pulse rounded bg-sand" />
          <div className="h-5 w-16 animate-pulse rounded bg-sand" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-sand" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-sand" />
        </div>
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="h-4 w-20 animate-pulse rounded bg-sand" />
          <div className="h-4 w-24 animate-pulse rounded bg-sand" />
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <section className="py-8">
      <div className="mb-6 flex flex-col gap-5 pb-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="h-3 w-20 animate-pulse rounded bg-sand" />
            <div className="mt-3 h-12 w-72 animate-pulse rounded bg-sand" />
            <div className="mt-3 h-4 w-40 animate-pulse rounded bg-sand" />
          </div>
          <div className="grid gap-2 sm:grid-cols-[320px_155px]">
            <div className="h-9 animate-pulse rounded-md bg-sand" />
            <div className="h-9 animate-pulse rounded-md bg-sand" />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[0, 1, 2, 3, 4].map((item) => <div key={item} className="h-8 w-20 animate-pulse rounded-md bg-sand" />)}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => <ProductCardSkeleton key={item} />)}
      </div>
    </section>
  );
}

async function Catalog({ params }: { params: Required<ProductListParams> }) {
  const products = await api.listProducts(params);

  return products.length === 0 && !params.search && params.category === "Todos" ? <div className="py-8 text-center text-muted">La tienda está vacía. Añade productos desde administración.</div> : <ProductSearch products={products} params={params} />;
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await productListParams(searchParams);

  return (
    <>
      <section className="py-6 lg:py-8">
        <div className="relative min-h-[560px] overflow-hidden rounded-lg shadow-[0_18px_48px_rgba(28,28,24,0.12)]">
          <Image className="object-cover saturate-[0.88]" src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1800&auto=format&fit=crop" alt="Interior sereno de Solenne" fill priority sizes="100vw" />
          <div className="absolute inset-0 bg-charcoal/52" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/78 via-terracotta/28 to-charcoal/10" />

          <div className="relative flex min-h-[560px] flex-col justify-between p-6 text-white md:p-10 lg:p-12">
            <div className="max-w-2xl">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/78">Despacho nacional</span>
              <h1 className="mt-5 font-serif text-5xl font-bold leading-[0.92] tracking-[-0.055em] md:text-7xl">Objetos útiles para una casa más serena.</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/78 md:text-lg">Solenne reúne piezas de hogar, cocina y tecnología ligera con compra simple, stock claro y entregas coordinadas desde Trujillo, Perú.</p>
              <Link className="mt-8 inline-flex rounded-md bg-white px-4 py-2.5 text-sm font-black text-ink transition hover:bg-cream" href="#catalogo">Comprar colección</Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-extrabold text-white/82">
              <span><strong className="text-white">24/48 h</strong> preparación</span>
              <span><strong className="text-white">30 días</strong> cambios</span>
              <span><strong className="text-white">Stock real</strong> disponible</span>
            </div>
          </div>
        </div>
      </section>

      <div id="catalogo">
        <Suspense key={`${params.search}:${params.category}:${params.sort}`} fallback={<ProductGridSkeleton />}>
          <Catalog params={params} />
        </Suspense>
      </div>
    </>
  );
}
