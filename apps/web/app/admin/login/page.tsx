"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@solenne.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await api.login(email, password);
      setToken(result.token);
      router.push("/admin/products");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center bg-paper px-4 py-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white md:grid-cols-[0.9fr_1fr]">
        <div className="hidden bg-charcoal p-8 text-cream md:flex md:flex-col md:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-cream/45">Acceso interno</span>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-[0.92] tracking-[-0.055em]">Panel Solenne</h1>
            <p className="mt-4 max-w-xs text-sm leading-6 text-cream/65">Gestiona productos, precios y disponibilidad desde un entorno privado.</p>
          </div>
          <div className="rounded-xl bg-cream/10 p-4 text-sm font-bold text-cream/70">
            Catálogo, stock e inventario en un solo lugar.
          </div>
        </div>

        <form className="grid gap-5 p-6 md:p-8" onSubmit={submit}>
          <div className="md:hidden">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-terracotta">Acceso interno</span>
            <h1 className="mt-2 font-serif text-3xl font-bold leading-none tracking-[-0.045em]">Panel Solenne</h1>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold leading-none tracking-[-0.045em]">Iniciar sesión</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Ingresa tus credenciales de administrador.</p>
          </div>
          {error && <div className="rounded-lg bg-red-100 p-3 text-sm font-black text-red-800">{error}</div>}
          <label className="grid gap-2">
            <span className="text-sm font-black">Email</span>
            <span className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={2.2} />
              <input className="h-11 w-full rounded-lg border border-ink/15 bg-white pl-10 pr-3 text-sm font-bold outline-none transition focus:border-charcoal focus:ring-4 focus:ring-ink/10" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </span>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-black">Contraseña</span>
            <span className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={2.2} />
              <input className="h-11 w-full rounded-lg border border-ink/15 bg-white pl-10 pr-3 text-sm font-bold outline-none transition focus:border-charcoal focus:ring-4 focus:ring-ink/10" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </span>
          </label>
          <button className="mt-1 rounded-lg bg-charcoal px-4 py-3 text-sm font-black text-cream transition hover:bg-terracotta disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
        </form>
      </div>
    </section>
  );
}
