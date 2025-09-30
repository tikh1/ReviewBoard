"use client"

import { useState } from "react"
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
  status: "open" | "closed" | "pending"
  priority: "low" | "medium" | "high"
  assignedTo: string
  createdAt: string
  price: number
  createdBy: string
}

export const mockTickets: TicketType[] = [
  {
    id: "TKT-001",
    title: "Login page not loading",
    description: "Users cannot access the login page",
    status: "open",
    priority: "high",
    assignedTo: "Ahmet Yılmaz",
    createdAt: "2024-03-15",
    price: 1500,
    createdBy: "Ahmet Yılmaz",
  },
  {
    id: "TKT-002",
    title: "Profile picture not updating",
    description: "Profile picture upload feature not working",
    status: "pending",
    priority: "medium",
    assignedTo: "Ayşe Demir",
    createdAt: "2024-03-14",
    price: 800,
    createdBy: "Ayşe Demir",
  },
  {
    id: "TKT-003",
    title: "Email notifications not received",
    description: "System not sending email notifications",
    status: "open",
    priority: "high",
    assignedTo: "Mehmet Kaya",
    createdAt: "2024-03-13",
    price: 2000,
    createdBy: "Mehmet Kaya",
  },
  {
    id: "TKT-004",
    title: "Search feature slow",
    description: "Search results loading too slowly",
    status: "closed",
    priority: "low",
    assignedTo: "Fatma Şahin",
    createdAt: "2024-03-12",
    price: 500,
    createdBy: "Fatma Şahin",
  },
  {
    id: "TKT-005",
    title: "Mobile view broken",
    description: "Page not displaying properly on mobile devices",
    status: "open",
    priority: "medium",
    assignedTo: "Ali Çelik",
    createdAt: "2024-03-11",
    price: 1200,
    createdBy: "Ali Çelik",
  },
  {
    id: "TKT-006",
    title: "Payment processing failed",
    description: "Credit card payments cannot be completed",
    status: "open",
    priority: "high",
    assignedTo: "Zeynep Arslan",
    createdAt: "2024-03-10",
    price: 3000,
    createdBy: "Zeynep Arslan",
  },
  {
    id: "TKT-007",
    title: "Report download error",
    description: "PDF report download feature not working",
    status: "pending",
    priority: "medium",
    assignedTo: "Can Öztürk",
    createdAt: "2024-03-09",
    price: 900,
    createdBy: "Can Öztürk",
  },
  {
    id: "TKT-008",
    title: "Password reset link not working",
    description: "Link in password reset email is invalid",
    status: "closed",
    priority: "high",
    assignedTo: "Elif Yıldız",
    createdAt: "2024-03-08",
    price: 1800,
    createdBy: "Elif Yıldız",
  },
  {
    id: "TKT-009",
    title: "Dashboard loading slowly",
    description: "Homepage taking more than 10 seconds to load",
    status: "open",
    priority: "medium",
    assignedTo: "Ahmet Yılmaz",
    createdAt: "2024-03-07",
    price: 1100,
    createdBy: "Ahmet Yılmaz",
  },
  {
    id: "TKT-010",
    title: "Notification sound too loud",
    description: "Notification sound cannot be adjusted",
    status: "pending",
    priority: "low",
    assignedTo: "Ayşe Demir",
    createdAt: "2024-03-06",
    price: 400,
    createdBy: "Ahmet Yılmaz",
  },
]

export function DataTable() {
  const router = useRouter()
  const { user, role } = useUser()
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const itemsPerPage = 10

  const filteredData = mockTickets.filter((ticket) => {
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesUser = role === "admin" || ticket.createdBy === user?.name
    return matchesPriority && matchesStatus && matchesUser
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const getStatusColor = (status: TicketType["status"]) => {
    switch (status) {
      case "open":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "closed":
        return "bg-muted text-muted-foreground border-border"
      case "pending":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusText = (status: TicketType["status"]) => {
    switch (status) {
      case "open":
        return "Open"
      case "closed":
        return "Closed"
      case "pending":
        return "Pending"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: TicketType["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "medium":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
      case "low":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getPriorityText = (priority: TicketType["priority"]) => {
    switch (priority) {
      case "high":
        return "High"
      case "medium":
        return "Medium"
      case "low":
        return "Low"
      default:
        return priority
    }
  }

  const handleRowClick = (ticket: TicketType) => {
    setSelectedRow(ticket.id)
    router.push(`/ticket/${ticket.id}`)
  }

  return (
    <Card className="border-border bg-card">
      <div className="pt-2 pb-6 px-6">
        {role === "admin" && (
          <div className="mb-8 flex items-center justify-end">
            <div className="flex items-center gap-6">
              <span className="text-sm font-semibold text-foreground">Filter by:</span>

              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Priority</label>
                <Select
                  value={priorityFilter}
                  onValueChange={(value) => {
                    setPriorityFilter(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[130px] bg-background border-border">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
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
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {filteredData.length === 0 ? (
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
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Ticket ID
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Title
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      User
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Fee
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Risk Score
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
                      <td className="py-4 text-sm font-medium text-foreground font-mono">{ticket.id}</td>
                      <td className="py-4 text-sm font-medium text-foreground max-w-xs truncate">{ticket.title}</td>
                      <td className="py-4 text-sm text-muted-foreground">{ticket.assignedTo}</td>
                      <td className="py-4 text-sm font-medium text-foreground">₺{ticket.price.toLocaleString()}</td>
                      <td className="py-4 text-sm text-muted-foreground font-mono">{ticket.createdAt}</td>
                      <td className="py-4">
                        <Badge variant="outline" className={`${getPriorityColor(ticket.priority)}`}>
                          {getPriorityText(ticket.priority)}
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
