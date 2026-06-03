"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main>{children}</main>;
  }

  return (
    <>
      <div className="border-b border-ink/10 bg-charcoal py-2 text-center text-xs font-extrabold tracking-wide text-cream">
        Envío gratis desde S/ 250 · Despachos desde Trujillo a todo el Perú
      </div>
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex w-[min(1220px,calc(100%_-_32px))] items-center justify-between gap-5 py-4">
          <div className="flex min-w-0 items-center gap-8">
            <Link className="shrink-0 font-serif text-3xl font-bold tracking-[-0.045em]" href="/">Solenne</Link>
            <nav className="hidden items-center gap-6 text-sm font-extrabold text-muted md:flex">
              <Link className="transition hover:text-ink" href="/#catalogo">Catálogo</Link>
              <Link className="transition hover:text-ink" href="/#catalogo">Hogar</Link>
              <Link className="transition hover:text-ink" href="/#catalogo">Cocina</Link>
              <Link className="transition hover:text-ink" href="/#catalogo">Tecnología</Link>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link className="hidden text-sm font-black text-muted transition hover:text-ink sm:inline-flex" href="/admin/products">Panel admin</Link>
            <span className="hidden h-5 w-px bg-ink/10 sm:block" />
            <button className="relative grid size-9 place-items-center text-ink transition hover:text-terracotta" type="button" aria-label="Carrito, 0 productos">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3.5 4.5h2l2.1 10.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 1.9-1.4l1.3-5.2H7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 20.2h.1M17 20.2h.1" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
              </svg>
              <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-terracotta text-[10px] font-black leading-none text-white ring-2 ring-cream">0</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-[min(1220px,calc(100%_-_32px))]">{children}</main>
    </>
  );
}
