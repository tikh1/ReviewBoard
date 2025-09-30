"use client"

import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, AlertCircle, FileText, Clock, DollarSign, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { useUser } from "@/lib/user-context"


export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  const { isAdmin } = useUser()

  const [ticketData, setTicketData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/tickets/${ticketId}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed")
        const data = await res.json()
        if (!cancelled) setTicketData(data.ticket)
      } catch (e) {
        if (!cancelled) setError("Failed to load ticket")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (ticketId) load()
    return () => {
      cancelled = true
    }
  }, [ticketId])

  const [editedRiskScore, setEditedRiskScore] = useState<number>(ticketData?.riskScore ?? 0)
  const [editedStatus, setEditedStatus] = useState(ticketData?.status || "open")
  

  // Sync editable fields with backend when ticket loads/changes
  useEffect(() => {
    if (ticketData) {
      setEditedRiskScore(ticketData.riskScore ?? 0)
      setEditedStatus(ticketData.status || "New")
    }
  }, [ticketData])

  // Track original values to detect changes
  const originalRiskScore = ticketData?.riskScore ?? 0
  const originalStatus = ticketData?.status || "New"

  // Check if there are any changes
  const hasChanges = editedStatus !== originalStatus

  

  const handleSaveChanges = async () => {
    const payload: any = {}
    // risk is derived; do not send riskScore updates
    if (editedStatus !== originalStatus) payload.status = editedStatus
    

    if (Object.keys(payload).length === 0) {
      alert("No changes to save")
      return
    }

    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}))
        throw new Error(msg?.error || "Failed to update ticket")
      }
      if (typeof window !== "undefined") {
        try {
          const event = new CustomEvent("app:toast", { detail: { message: "Changes saved!", kind: "success" } })
          window.dispatchEvent(event)
        } catch {}
      }
      
    } catch (err: any) {
      if (typeof window !== "undefined") {
        try {
          const event = new CustomEvent("app:toast", { detail: { message: err.message || "Something went wrong", kind: "error" } })
          window.dispatchEvent(event)
        } catch {}
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl p-6 lg:p-8">
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !ticketData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl p-6 lg:p-8">
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Ticket not found</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const ticket = ticketData

  const getStatusColor = (status: typeof ticket.status) => {
    switch (status) {
      case "New":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "Approved":
        return "bg-muted text-muted-foreground border-border"
      case "In-Review":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
      case "Rejected":
        return "bg-destructive/20 text-destructive border-destructive/30"
    }
  }

  const getStatusText = (status: typeof ticket.status) => status

  const getRiskColor = (risk: "low" | "mid" | "high") => {
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

  const getTagStyle = (tag: string) => {
    const t = tag.toLowerCase()
    if (t === "technical") return "bg-blue-500 text-white border-blue-600"
    if (t === "billing") return "bg-amber-500 text-white border-amber-600"
    if (t === "account") return "bg-purple-500 text-white border-purple-600"
    if (t === "support") return "bg-emerald-500 text-white border-emerald-600"
    if (t === "bug report") return "bg-red-500 text-white border-red-600"
    if (t === "feature request") return "bg-indigo-500 text-white border-indigo-600"
    return "bg-foreground text-background border-foreground/80"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="space-y-6">
          <Card className="p-6 border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold text-foreground">{ticket.title}</h1>
                </div>
                <p className="text-sm text-muted-foreground font-mono mb-1">Ticket ID: {ticket.id}</p>
                <p className="text-sm text-muted-foreground">Owner: {ticket.assignedTo}</p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Badge variant="outline" className={`${getRiskColor(ticket.risk)} text-sm px-3 py-1`}>
                    {ticket.risk === "mid" ? "Mid" : ticket.risk.charAt(0).toUpperCase() + ticket.risk.slice(1)}
                  </Badge>
                )}
                <Badge variant="outline" className={`${getStatusColor(ticket.status)} text-base px-4 py-1`}>
                  {getStatusText(ticket.status)}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Description</h2>
            </div>
            <p className="text-foreground leading-relaxed">{ticket.description}</p>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 border-border">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Created At</p>
                  <p className="text-base font-semibold text-foreground font-mono">{ticket.createdAt}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Fee</p>
                  <p className="text-xl font-bold text-foreground">₺{ticket.price.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Tags</p>
                  {ticket.tags && ticket.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {ticket.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className={`px-2 py-0.5 text-xs ${getTagStyle(tag)}`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags</p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  {isAdmin ? (
                    <Select value={editedStatus} onValueChange={(value: any) => setEditedStatus(value)}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In-Review">In-Review</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline" className={`${getStatusColor(ticket.status)} text-sm px-3 py-1`}>
                      {getStatusText(ticket.status)}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </div>

          

          

          {isAdmin && (
            <div className="flex items-center justify-center gap-8 pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/")}
                className="px-7 py-3.5 min-w-[190px]"
              >
                Cancel
              </Button>
              <Button
                size="lg"
                onClick={handleSaveChanges}
                disabled={!hasChanges}
                className="px-7 py-3.5 min-w-[190px]"
              >
                <Save className="mr-2 h-5 w-5" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
