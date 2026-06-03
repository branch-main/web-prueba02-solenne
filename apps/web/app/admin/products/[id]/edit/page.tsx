import { notFound } from "next/navigation";
import { AdminGuard } from "@/components/AdminGuard";
import { ProductForm } from "@/components/ProductForm";
import { api } from "@/lib/api";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await api.getProduct(id).catch(() => undefined);

  if (!product) notFound();

  return (
    <AdminGuard>
      <ProductForm product={product} />
    </AdminGuard>
  );
}
