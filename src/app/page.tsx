import { DataTable } from "@/components/data-table"
import { Header } from "@/components/header"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Ticketlar</h1>
          <p className="mt-2 text-sm text-muted-foreground">Destek ticketlarını görüntüleyin ve yönetin</p>
        </div>

        <DataTable />
      </div>
    </div>
  )
}
