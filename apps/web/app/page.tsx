import Image from "next/image";
import Link from "next/link";
import { ProductSearch } from "@/components/ProductSearch";
import { api } from "@/lib/api";

export default async function HomePage() {
  const products = await api.listProducts();

  return (
    <>
      <section className="py-6 lg:py-8">
        <div className="relative min-h-[560px] overflow-hidden rounded-lg shadow-[0_18px_48px_rgba(28,28,24,0.12)]">
          <Image className="object-cover" src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1800&auto=format&fit=crop" alt="Interior cálido de Solenne" fill priority sizes="100vw" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/34 to-black/10" />

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
        {products.length === 0 ? <div className="py-8 text-center text-muted">La tienda está vacía. Añade productos desde administración.</div> : <ProductSearch products={products} />}
      </div>
    </>
  );
}
