"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut, Package, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    api.me(token)
      .then(() => setReady(true))
      .catch(() => {
        clearToken();
        router.replace("/admin/login");
      });
  }, [router]);

  if (!ready) {
    return <div className="my-10 rounded-md border border-ink/10 bg-white p-3 text-center text-muted">Comprobando sesión de administración...</div>;
  }

  const signOut = () => {
    clearToken();
    router.replace("/admin/login");
  };

  return (
    <section className="min-h-screen bg-paper lg:pl-64">
      <aside className="bg-cream/95 px-2 py-5 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col">
        <div className="px-3">
          <Link href="/" className="font-serif text-2xl font-bold leading-none tracking-[-0.045em]">Solenne</Link>
          <p className="mt-1 text-xs font-bold text-muted">Administración</p>
        </div>

        <nav className="mt-8 grid gap-2 text-sm font-black">
          <Link className="flex items-center gap-2 rounded-lg bg-charcoal px-3 py-2.5 text-cream" href="/admin/products">
            <Package className="size-4" strokeWidth={2.2} />
            <span>Productos</span>
          </Link>
          <Link className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-muted transition hover:bg-white hover:text-ink" href="/admin/products/new">
            <Plus className="size-4" strokeWidth={2.2} />
            <span>Nuevo producto</span>
          </Link>
        </nav>

        <div className="mt-8 grid gap-2 lg:mt-auto">
          <Link className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-black text-muted transition hover:bg-white hover:text-ink" href="/">
            <span>Ver tienda</span>
            <ExternalLink className="size-4" strokeWidth={2.2} />
          </Link>
          <button className="flex w-full appearance-none items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-black text-muted transition hover:bg-red-100 hover:text-red-800" type="button" onClick={signOut}>
            <span>Cerrar sesión</span>
            <LogOut className="size-4" strokeWidth={2.2} />
          </button>
        </div>
      </aside>
      <div className="min-w-0 p-4 lg:p-6">{children}</div>
    </section>
  );
}
