import { DataTable } from "@/components/data-table"
import { Header } from "@/components/header"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-4 sm:mt-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Tickets</h1>
          <p className="mt-2 text-sm text-muted-foreground">View and manage support tickets</p>
        </div>

        <DataTable />
      </div>
    </div>
  )
}


