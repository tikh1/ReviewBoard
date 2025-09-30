"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Plus, Ticket } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/lib/user-context"

type TicketType = {
  id: string
  title: string
  description: string
  status: "New" | "In-Review" | "Rejected" | "Approved"
  risk: "low" | "mid" | "high"
  assignedTo: string
  createdAt: string
  price: number
  createdBy: string
}


export function DataTable() {
  const router = useRouter()
  const { user, role } = useUser()
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    let cancelled = false
    async function fetchTickets() {
      try {
        setLoading(true)
        const scope = role === "admin" ? "all" : "mine"
        const query = new URLSearchParams()
        query.set("scope", scope)
        if (statusFilter !== "all") query.set("status", statusFilter)
        if (riskFilter !== "all") query.set("risk", riskFilter)
        const res = await fetch(`/api/tickets?${query.toString()}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        if (!cancelled) setTickets(data.tickets ?? [])
      } catch (e) {
        if (!cancelled) setError("Failed to load tickets")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchTickets()
    return () => {
      cancelled = true
    }
  }, [role, statusFilter, riskFilter])

  const filteredData = tickets

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const getStatusColor = (status: TicketType["status"]) => {
    switch (status) {
      case "New":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "Approved":
        return "bg-muted text-muted-foreground border-border"
      case "In-Review":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
      case "Rejected":
        return "bg-destructive/20 text-destructive border-destructive/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }
  const getStatusText = (status: TicketType["status"]) => status

  const getRiskColor = (risk: TicketType["risk"]) => {
    switch (risk) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "mid":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
      case "low":
      default:
        return "bg-chart-2/20 text-chart-2 border-chart-2/30"
    }
  }

  const handleRowClick = (ticket: TicketType) => {
    setSelectedRow(ticket.id)
    router.push(`/ticket/${ticket.id}`)
  }

  return (
    <Card className="border-border bg-card">
      <div className="pt-2 pb-6 px-6">
        {role === "admin" ? (
          <div className="mb-8 flex items-center justify-end">
            <div className="flex items-center gap-6">
              <span className="text-sm font-semibold text-foreground">Filter by:</span>

              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Risk</label>
                <Select
                  value={riskFilter}
                  onValueChange={(value) => {
                    setRiskFilter(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[130px] bg-background border-border">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Status</label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[130px] bg-background border-border">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In-Review">In-Review</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 flex items-center justify-end">
            <Link href="/ticket/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-5 w-5 mr-1" />
                Create Ticket
              </Button>
            </Link>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <h3 className="text-xl font-semibold text-foreground mb-2">Loading...</h3>
            <p className="text-sm text-muted-foreground">Fetching tickets</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <h3 className="text-xl font-semibold text-destructive mb-2">Error</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-muted p-6 mb-6">
              <Ticket className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Tickets Yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
              You haven't created any support tickets yet. Create your first ticket to get started with our support
              system.
            </p>
            <Link href="/ticket/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Ticket
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-48">
                      Ticket ID
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Title
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-40">
                      User
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Fee
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Risk
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedData.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => handleRowClick(ticket)}
                      className={`group cursor-pointer transition-colors hover:bg-accent/50 ${
                        selectedRow === ticket.id ? "bg-accent" : ""
                      }`}
                    >
                      <td className="py-4 pr-24 text-sm font-medium text-foreground font-mono w-48 whitespace-nowrap">{ticket.id}</td>
                      <td className="py-4 text-sm font-medium text-foreground max-w-xs truncate">{ticket.title}</td>
                      <td className="py-4 pr-8 text-sm text-muted-foreground w-40 whitespace-nowrap">{ticket.assignedTo}</td>
                      <td className="py-4 text-sm font-medium text-foreground">₺{ticket.price.toLocaleString()}</td>
                      <td className="py-4 text-sm text-muted-foreground font-mono">{ticket.createdAt}</td>
                      <td className="py-4">
                        <Badge variant="outline" className={`${getRiskColor(ticket.risk)}`}>
                          {ticket.risk === "mid" ? "Mid" : ticket.risk.charAt(0).toUpperCase() + ticket.risk.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Badge variant="outline" className={`${getStatusColor(ticket.status)}`}>
                          {getStatusText(ticket.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <div className="text-sm font-medium text-foreground">Total {filteredData.length} tickets</div>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="min-w-[2.5rem] transition-colors"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
