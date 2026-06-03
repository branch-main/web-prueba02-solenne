import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Boxes, Edit3, Package, Plus, Search } from "lucide-react";
import { AdminDeleteProductButton } from "@/components/AdminProductActions";
import { AdminGuard } from "@/components/AdminGuard";
import { money } from "@/components/ProductCard";
import { api, type ProductCategory, type ProductListParams, type ProductSort } from "@/lib/api";

const categories: ProductCategory[] = ["Todos", "Hogar", "Cocina", "Tecnología", "Bolsos"];
const sorts: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Destacados" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "stock", label: "Más stock" }
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const firstParam = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

const productListParams = async (searchParams: SearchParams): Promise<Required<ProductListParams>> => {
  const params = await searchParams;
  const category = firstParam(params.category);
  const sort = firstParam(params.sort);

  return {
    search: firstParam(params.search)?.trim() || "",
    category: category && categories.includes(category as ProductCategory) ? category as ProductCategory : "Todos",
    sort: sort && sorts.some((option) => option.value === sort) ? sort as ProductSort : "featured"
  };
};

const productsPath = ({ search, category, sort }: ProductListParams) => {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category && category !== "Todos") params.set("category", category);
  if (sort && sort !== "featured") params.set("sort", sort);

  return params.size > 0 ? `/admin/products?${params.toString()}` : "/admin/products";
};

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await productListParams(searchParams);
  const [products, allProducts] = await Promise.all([api.listProducts(params), api.listProducts()]);
  const metrics = {
    total: allProducts.length,
    units: allProducts.reduce((sum, product) => sum + product.stock, 0),
    lowStock: allProducts.filter((product) => product.stock <= 5).length
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

        <div className="rounded-xl bg-white/80">
          <div className="grid gap-3 px-4 py-3 lg:grid-cols-[1fr_auto] lg:items-end lg:justify-between">
            <div>
              <h2 className="text-sm font-black">Listado de productos</h2>
              <p className="text-xs font-bold text-muted">{products.length} de {allProducts.length} productos</p>
            </div>
            <form className="grid gap-2 sm:grid-cols-[260px_155px_auto]" action="/admin/products">
              {params.category !== "Todos" && <input type="hidden" name="category" value={params.category} />}
              <label className="relative">
                <span className="sr-only">Buscar en productos</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={2.2} />
                <input name="search" className="h-9 w-full rounded-lg border border-ink/15 bg-white pl-9 pr-3 text-xs font-bold outline-none transition placeholder:text-muted/70 focus:border-charcoal focus:ring-4 focus:ring-ink/10" defaultValue={params.search} placeholder="Buscar producto" />
              </label>
              <select name="sort" className="h-9 rounded-lg border border-ink/15 bg-white px-3 text-xs font-black outline-none transition focus:border-charcoal focus:ring-4 focus:ring-ink/10" defaultValue={params.sort}>
                {sorts.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <button className="rounded-lg bg-charcoal px-3 py-2 text-xs font-black text-cream transition hover:bg-terracotta">Filtrar</button>
            </form>
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-ink/10 px-4 py-3">
            {categories.map((item) => (
              <Link key={item} className={params.category === item ? "rounded-md bg-charcoal px-2.5 py-1.5 text-xs font-black text-cream" : "rounded-md border border-ink/15 bg-white/50 px-2.5 py-1.5 text-xs font-black text-muted transition hover:border-ink/30 hover:bg-white hover:text-ink"} href={productsPath({ search: params.search, category: item, sort: params.sort })}>
                {item}
              </Link>
            ))}
          </div>

          <div className="overflow-x-auto">
          {allProducts.length === 0 ? <div className="p-12 text-center text-muted">Todavía no hay productos.</div> : products.length === 0 ? <div className="p-12 text-center text-muted">No hay productos para estos filtros.</div> : (
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
                {products.map((product) => (
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
                        <AdminDeleteProductButton product={product} />
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
