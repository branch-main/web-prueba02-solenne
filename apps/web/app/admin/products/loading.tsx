import { AdminGuard } from "@/components/AdminGuard";

function AdminTableRowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 animate-pulse rounded-lg bg-sand" />
          <div className="space-y-1.5">
            <div className="h-4 w-36 animate-pulse rounded bg-sand" />
            <div className="h-3.5 w-52 animate-pulse rounded bg-sand" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><div className="h-4 w-14 animate-pulse rounded bg-sand" /></td>
      <td className="px-4 py-3"><div className="h-4 w-8 animate-pulse rounded bg-sand" /></td>
      <td className="px-4 py-3"><div className="h-6 w-20 animate-pulse rounded-md bg-sand" /></td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <div className="size-9 animate-pulse rounded-md bg-sand" />
          <div className="size-9 animate-pulse rounded-md bg-sand" />
        </div>
      </td>
    </tr>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="rounded-xl bg-white/75 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="h-3.5 w-28 animate-pulse rounded bg-sand" />
        <div className="size-5 animate-pulse rounded bg-sand" />
      </div>
      <div className="mt-3 h-8 w-16 animate-pulse rounded bg-sand" />
    </div>
  );
}

export default function AdminProductsLoading() {
  return (
    <AdminGuard>
      <div className="grid gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="h-3 w-24 animate-pulse rounded bg-sand" />
            <div className="mt-3 h-10 w-40 animate-pulse rounded bg-sand" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-sand" />
          </div>
          <div className="h-10 w-36 animate-pulse rounded-md bg-sand" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[0, 1, 2].map((item) => <MetricCardSkeleton key={item} />)}
        </div>

        <div className="rounded-xl bg-white/80">
          <div className="grid gap-3 px-4 py-3 lg:grid-cols-[1fr_auto] lg:items-end lg:justify-between">
            <div>
              <div className="h-4 w-36 animate-pulse rounded bg-sand" />
              <div className="mt-2 h-3 w-28 animate-pulse rounded bg-sand" />
            </div>
            <div className="grid gap-2 sm:grid-cols-[260px_155px_auto]">
              <div className="h-9 animate-pulse rounded-lg bg-sand" />
              <div className="h-9 animate-pulse rounded-lg bg-sand" />
              <div className="h-9 w-20 animate-pulse rounded-lg bg-sand" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 border-t border-ink/10 px-4 py-3">
            {[0, 1, 2, 3, 4].map((item) => <div key={item} className="h-8 w-20 animate-pulse rounded-md bg-sand" />)}
          </div>
          <div className="overflow-x-auto">
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
                {[0, 1, 2, 3, 4].map((item) => <AdminTableRowSkeleton key={item} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
