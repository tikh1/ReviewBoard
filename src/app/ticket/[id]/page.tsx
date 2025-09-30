"use client"

import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Tag, FileText, Clock, DollarSign, Save, Link as LinkIcon, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { useUser } from "@/lib/user-context"


export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  const { isAdmin } = useUser()

  type TicketData = {
    id: string
    title: string
    description: string
    status: "New" | "In-Review" | "Rejected" | "Approved"
    risk: "low" | "mid" | "high"
    tags: string[]
    assignedTo: string
    createdAt: string
    price: number
    rejectionWebhookUrl: string | null
  } | null

  const [ticketData, setTicketData] = useState<TicketData>(null)
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

  const [editedStatus, setEditedStatus] = useState(ticketData?.status || "open")
  const [rejectionWebhookUrl, setRejectionWebhookUrl] = useState<string | null>(ticketData?.rejectionWebhookUrl ?? null)
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false)
  const [webhookInput, setWebhookInput] = useState<string>(ticketData?.rejectionWebhookUrl ?? "")
  const [savingWebhook, setSavingWebhook] = useState(false)
  

  useEffect(() => {
    if (ticketData) {
      setEditedStatus(ticketData.status || "New")
      setRejectionWebhookUrl(ticketData.rejectionWebhookUrl ?? null)
      setWebhookInput(ticketData.rejectionWebhookUrl ?? "")
    }
  }, [ticketData])

  const originalStatus = ticketData?.status || "New"

  const originalWebhook = ticketData?.rejectionWebhookUrl ?? null
  const hasChanges = editedStatus !== originalStatus || (rejectionWebhookUrl ?? null) !== originalWebhook

  

  const handleSaveChanges = async (overrideWebhook?: string | null) => {
    const payload: { status?: string; rejectionWebhookUrl?: string | null } = {}
    if (editedStatus !== originalStatus) payload.status = editedStatus
    const nextWebhook = (typeof overrideWebhook !== "undefined") ? overrideWebhook : (rejectionWebhookUrl ?? null)
    if ((nextWebhook ?? null) !== originalWebhook) payload.rejectionWebhookUrl = nextWebhook ?? null
    

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
      
    } catch {
      if (typeof window !== "undefined") {
        try {
          const event = new CustomEvent("app:toast", { detail: { message: "Something went wrong", kind: "error" } })
          window.dispatchEvent(event)
        } catch {}
      }
    }
  }

  const openWebhookDialog = () => {
    setWebhookInput(rejectionWebhookUrl ?? "")
    setIsWebhookDialogOpen(true)
  }

  const closeWebhookDialog = () => {
    if (savingWebhook) return
    setIsWebhookDialogOpen(false)
  }

  const handleConfirmWebhook = async () => {
    if (savingWebhook) return
    setSavingWebhook(true)
    try {
      const trimmed = webhookInput.trim()
      if (trimmed.length === 0) {
        setRejectionWebhookUrl(null)
      } else {
        try {
          new URL(trimmed)
        } catch {
          if (typeof window !== "undefined") {
            try {
              const event = new CustomEvent("app:toast", { detail: { message: "Invalid URL", kind: "error" } })
              window.dispatchEvent(event)
            } catch {}
          }
          return
        }
        setRejectionWebhookUrl(trimmed)
      }
      if (typeof window !== "undefined") {
        try {
          const event = new CustomEvent("app:toast", { detail: { message: "Webhook URL set (not saved yet)", kind: "info" } })
          window.dispatchEvent(event)
        } catch {}
      }
      setIsWebhookDialogOpen(false)
    } finally {
      setSavingWebhook(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl p-6 mt-4 sm:mt-6 lg:p-8">
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
        <div className="mx-auto max-w-4xl p-6 mt-4 sm:mt-6 lg:p-8">
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

  const isRiskTag = (tag: string) => {
    const t = tag.trim().toLowerCase()
    if (t === "risk" || t === "high" || t === "mid" || t === "low") return true
    if (t === "high risk" || t === "mid risk" || t === "low risk") return true
    if (t === "risk high" || t === "risk mid" || t === "risk low") return true
    return /\brisk\b/.test(t)
  }

  const formatTag = (tag: string) => {
    const t = String(tag || "")
    if (t.length === 0) return t
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl p-6 mt-4 sm:mt-6 lg:p-8">
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
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={openWebhookDialog} className="ml-2">
                    <LinkIcon className="mr-2 h-4 w-4" /> Set Webhook
                  </Button>
                )}
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
                  <Tag className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Tags</p>
                  {ticket.tags && ticket.tags.filter((t: string) => !isRiskTag(t)).length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {ticket.tags
                        .filter((tag: string) => !isRiskTag(tag))
                        .map((tag: string) => (
                          <Badge key={tag} variant="outline" className={`px-2 py-0.5 text-xs ${getTagStyle(tag)}`}>
                            {formatTag(tag)}
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
                    <Select value={editedStatus} onValueChange={(value: string) => setEditedStatus(value)}>
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
                onClick={() => handleSaveChanges()}
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

      {isWebhookDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeWebhookDialog} />
          <Card className="relative z-10 w-full max-w-lg p-6 border-border bg-background">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Set rejection webhook URL</h3>
              <Button variant="ghost" size="icon" onClick={closeWebhookDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="webhook-url">Webhook URL</label>
              <Input
                id="webhook-url"
                placeholder="https://example.com/webhooks/rejections"
                value={webhookInput}
                onChange={(e) => setWebhookInput((e.target as HTMLInputElement).value)}
              />
              <p className="text-xs text-muted-foreground">Leave empty to disable the webhook.</p>
              <p className="text-xs text-muted-foreground">A JSON POST will only be sent if the ticket is rejected.</p>
              <p className="text-xs text-muted-foreground">
                For testing, you can use an example service like
                {' '}<a href="https://webhook.site/" target="_blank" rel="noreferrer" className="underline">Webhook.site</a>.
                Open the site and copy your generated URL here.
              </p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={closeWebhookDialog} disabled={savingWebhook}>Cancel</Button>
              <Button onClick={handleConfirmWebhook} disabled={savingWebhook}>
                {savingWebhook ? "Saving..." : "Save"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
