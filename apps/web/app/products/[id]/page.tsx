import Link from "next/link";
import { notFound } from "next/navigation";
import { money } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { api } from "@/lib/api";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await api.getProduct(id).catch(() => undefined);

  if (!product) notFound();

  const inStock = product.stock > 0;

  return (
    <section className="py-8 lg:py-10">
      <Link className="mb-6 inline-flex text-sm font-black text-muted transition hover:text-ink" href="/">← Volver al catálogo</Link>

      <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_310px] xl:grid-cols-[minmax(0,1fr)_410px]">
        <ProductGallery imageUrl={product.imageUrl} productName={product.name} />

        <aside className="self-start">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-terracotta">Producto</span>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-[0.96] tracking-[-0.045em]">{product.name}</h1>
          <p className="mt-4 text-base leading-7 text-muted">{product.description}</p>

          <div className="mt-6" aria-label="Valoración 5 de 5 con 24 reseñas">
            <span className="flex items-center gap-1 text-sm text-terracotta" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((item) => <span key={item}>★</span>)}
            </span>
            <span className="mt-1 block text-sm font-bold text-muted">24 reseñas</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-black tracking-[-0.04em]">{money(product.price)}</span>
            <span className="text-sm font-bold text-muted line-through">{money(product.price * 1.15)}</span>
            <span className="rounded bg-terracotta/10 px-2 py-1 text-xs font-black text-terracotta">15%</span>
          </div>

          <div className="mt-6 space-y-3 text-sm font-bold text-muted">
            <div>{inStock ? `${product.stock} unidades disponibles` : "Agotado"}</div>
            <div>Despacho nacional desde Trujillo</div>
          </div>

          <div className="mt-7">
            <p className="mb-3 text-sm font-black">Cantidad</p>
            <div className="inline-grid grid-cols-3 border border-ink/15 bg-white">
              <button className="px-4 py-3 text-lg text-muted" type="button">−</button>
              <span className="grid min-w-12 place-items-center px-3 py-3 font-black">1</span>
              <button className="px-4 py-3 text-lg text-muted" type="button">+</button>
            </div>
          </div>

          <button className="mt-6 w-full rounded-md bg-terracotta px-4 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-charcoal">Añadir al carrito</button>

          <dl className="mt-8 grid gap-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="font-black text-ink">Material</dt><dd className="text-right text-muted">Selección premium</dd></div>
            <div className="flex justify-between gap-4"><dt className="font-black text-ink">Cambios</dt><dd className="text-right text-muted">30 días</dd></div>
            <div className="flex justify-between gap-4"><dt className="font-black text-ink">Garantía</dt><dd className="text-right text-muted">2 años</dd></div>
          </dl>
        </aside>
      </div>

      <div className="mt-16 grid gap-6 py-8 md:grid-cols-[1fr_0.8fr]">
        <h2 className="font-serif text-4xl font-bold leading-none tracking-[-0.045em]">Explora productos similares</h2>
        <div className="text-muted md:text-right">
          <p>Descubre alternativas con acabados, funciones y estilo similares.</p>
          <Link className="mt-4 inline-flex font-black text-ink underline underline-offset-4" href="/#catalogo">Ver más productos</Link>
        </div>
      </div>
    </section>
  );
}
