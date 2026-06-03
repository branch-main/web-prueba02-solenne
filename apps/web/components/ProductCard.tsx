import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/api";

export const money = (value: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);

const stockLabel = (stock: number) => {
  if (stock === 0) return "Agotado";
  if (stock <= 5) return `Últimas ${stock} uds.`;
  return "En stock";
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="group overflow-hidden rounded-lg bg-white transition hover:-translate-y-0.5" href={`/products/${product.id}`}>
      <div className="relative h-48 bg-sand xl:h-44">
        <Image className="object-cover" src={product.imageUrl} alt={product.name} fill sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" />
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-xs font-black">Nuevo</span>
      </div>
      <div className="grid gap-3 p-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-lg font-bold tracking-[-0.035em]">{product.name}</h3>
          <span className="text-sm font-black">{money(product.price)}</span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-muted">{product.description}</p>
        <div className="flex items-center justify-between gap-4 pt-1">
          <span className={product.stock <= 5 ? "text-xs font-black text-red-800" : "text-xs font-black text-sage"}>{stockLabel(product.stock)}</span>
          <span className="text-right text-xs font-extrabold text-muted">Entrega en 24/48 h</span>
        </div>
      </div>
    </Link>
  );
}
