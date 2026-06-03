"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { api, type Product } from "@/lib/api";
import { getToken } from "@/lib/auth";

export function AdminDeleteProductButton({ product }: { product: Product }) {
  const router = useRouter();

  const remove = async () => {
    if (!confirm(`¿Eliminar ${product.name}?`)) return;
    const token = getToken();
    if (!token) return;

    try {
      await api.deleteProduct(product.id, token);
      router.refresh();
    } catch (requestError) {
      alert(requestError instanceof Error ? requestError.message : "No se pudo eliminar");
    }
  };

  return (
    <button className="grid size-9 place-items-center rounded-md bg-red-800 text-white transition hover:bg-red-900" onClick={remove} aria-label={`Eliminar ${product.name}`}>
      <Trash2 className="size-4" strokeWidth={2.2} />
    </button>
  );
}
