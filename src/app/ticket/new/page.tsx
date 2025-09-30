"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus } from "lucide-react"
import { Header } from "@/components/header"
import { useUser } from "@/lib/user-context"

export default function NewTicketPage() {
  const router = useRouter()
  const { user } = useUser()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tag, setTag] = useState<string>("technical")
  const [price, setPrice] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          tag,
          price: price ? Number(price) : undefined,
        }),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}))
        throw new Error(msg?.error || "Failed to create ticket")
      }
      const data = await res.json()
      // toast on success
      if (typeof window !== "undefined") {
        try {
          // dynamic hook usage is not allowed outside components, so fallback to event
          const event = new CustomEvent("app:toast", { detail: { message: "Ticket created successfully!", kind: "success" } })
          window.dispatchEvent(event)
        } catch {}
      }
      router.push(`/ticket/${data.id}`)
    } catch (err: unknown) {
      if (typeof window !== "undefined") {
        try {
          const message = err instanceof Error ? err.message : "Something went wrong"
          const event = new CustomEvent("app:toast", { detail: { message, kind: "error" } })
          window.dispatchEvent(event)
        } catch {}
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-3xl p-6 lg:p-8">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create New Ticket</h1>
          <p className="mt-2 text-sm text-muted-foreground">Fill in the details to create a new support ticket</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 border-border">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-foreground">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter ticket title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[150px] w-full"
                  required
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tag" className="text-sm font-medium text-foreground">
                    Tag
                  </Label>
                  <Select value={tag} onValueChange={(value: string) => setTag(value)}>
                    <SelectTrigger id="tag" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-foreground">
                    Fee (₺)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6 flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/")} className="px-6">
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6">
              <Plus className="mr-2 h-5 w-5" />
              Create Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
