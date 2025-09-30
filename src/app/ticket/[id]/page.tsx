"use client"

import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, AlertCircle, FileText, Clock, DollarSign, Plus, Save } from "lucide-react"
import { mockTickets } from "@/components/data-table"
import { Header } from "@/components/header"
import { useUser } from "@/lib/user-context"
import { useState } from "react"

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  const { isAdmin } = useUser()

  const ticketData = mockTickets.find((t) => t.id === ticketId)

  const [editedPriority, setEditedPriority] = useState(ticketData?.priority || "low")
  const [editedStatus, setEditedStatus] = useState(ticketData?.status || "open")
  const [notes, setNotes] = useState<Array<{ id: string; text: string; date: string }>>([])
  const [newNote, setNewNote] = useState("")
  const [showNoteInput, setShowNoteInput] = useState(false)

  // Track original values to detect changes
  const originalPriority = ticketData?.priority || "low"
  const originalStatus = ticketData?.status || "open"

  // Check if there are any changes
  const hasChanges = editedPriority !== originalPriority || editedStatus !== originalStatus || newNote.trim() !== ""

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now().toString(),
        text: newNote,
        date: new Date().toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setNotes([...notes, note])
      setNewNote("")
      setShowNoteInput(false)
    }
  }

  const handleSaveChanges = () => {
    console.log("[v0] Saving changes:", { priority: editedPriority, status: editedStatus, notes })
    alert("Değişiklikler kaydedildi!")
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl p-6 lg:p-8">
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Ticket bulunamadı</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const ticket = ticketData

  const getStatusColor = (status: typeof ticket.status) => {
    switch (status) {
      case "open":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "closed":
        return "bg-muted text-muted-foreground border-border"
      case "pending":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
    }
  }

  const getStatusText = (status: typeof ticket.status) => {
    switch (status) {
      case "open":
        return "Açık"
      case "closed":
        return "Kapalı"
      case "pending":
        return "Beklemede"
    }
  }

  const getPriorityColor = (priority: typeof ticket.priority) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "medium":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
      case "low":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30"
    }
  }

  const getPriorityText = (priority: typeof ticket.priority) => {
    switch (priority) {
      case "high":
        return "Yüksek"
      case "medium":
        return "Orta"
      case "low":
        return "Düşük"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>

        <div className="space-y-6">
          <Card className="p-6 border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold text-foreground">{ticket.title}</h1>
                  <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                    {getPriorityText(ticket.priority)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-mono mb-1">{ticket.id}</p>
                <p className="text-sm text-muted-foreground">Atanan: {ticket.assignedTo}</p>
              </div>
              <Badge variant="outline" className={`${getStatusColor(ticket.status)} text-base px-4 py-1`}>
                {getStatusText(ticket.status)}
              </Badge>
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Açıklama</h2>
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
                  <p className="text-sm text-muted-foreground mb-1">Oluşturulma Tarihi</p>
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
                  <p className="text-sm text-muted-foreground mb-1">Ücret Bilgisi</p>
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
                  <p className="text-sm text-muted-foreground mb-1">Öncelik Seviyesi</p>
                  {isAdmin ? (
                    <Select value={editedPriority} onValueChange={(value: any) => setEditedPriority(value)}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Düşük</SelectItem>
                        <SelectItem value="medium">Orta</SelectItem>
                        <SelectItem value="high">Yüksek</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline" className={`${getPriorityColor(ticket.priority)} text-sm px-3 py-1`}>
                      {getPriorityText(ticket.priority)}
                    </Badge>
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
                  <p className="text-sm text-muted-foreground mb-1">Ticket Durumu</p>
                  {isAdmin ? (
                    <Select value={editedStatus} onValueChange={(value: any) => setEditedStatus(value)}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Açık</SelectItem>
                        <SelectItem value="pending">Beklemede</SelectItem>
                        <SelectItem value="closed">Kapalı</SelectItem>
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

          {notes.length > 0 && (
            <Card className="p-6 border-border">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Notlar</h2>
              </div>
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="border-l-2 border-primary pl-4 py-2">
                    <p className="text-foreground leading-relaxed">{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{note.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {showNoteInput && isAdmin && (
            <Card className="p-6 border-border">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Yeni Not</h2>
              </div>
              <Textarea
                placeholder="Notunuzu buraya yazın..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddNote} size="sm">
                  Notu Ekle
                </Button>
                <Button
                  onClick={() => {
                    setShowNoteInput(false)
                    setNewNote("")
                  }}
                  variant="outline"
                  size="sm"
                >
                  İptal
                </Button>
              </div>
            </Card>
          )}

          {isAdmin && (
            <div className="flex items-center justify-center gap-8 pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowNoteInput(!showNoteInput)}
                disabled={showNoteInput}
                className="px-7 py-3.5 min-w-[190px]"
              >
                <Plus className="mr-2 h-5 w-5" />
                Not Ekle
              </Button>
              <Button
                size="lg"
                onClick={handleSaveChanges}
                disabled={!hasChanges}
                className="px-7 py-3.5 min-w-[190px]"
              >
                <Save className="mr-2 h-5 w-5" />
                Değişiklikleri Kaydet
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
