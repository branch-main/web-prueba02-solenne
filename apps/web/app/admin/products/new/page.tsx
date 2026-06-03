import { AdminGuard } from "@/components/AdminGuard";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <AdminGuard>
      <ProductForm />
    </AdminGuard>
  );
}
