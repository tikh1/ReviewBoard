"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type AuditRow = {
  id: string
  createdAt: string
  itemId: string
  itemTitle: string
  user: string
  action: string
  oldValue?: string | null
  newValue?: string | null
}

export default function AuditsPage() {
  const { isAdmin, roleLoaded } = useUser()
  const router = useRouter()
  const [audits, setAudits] = useState<AuditRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roleLoaded) return
    if (!isAdmin) {
      router.push("/")
    }
  }, [isAdmin, roleLoaded, router])
  
  // Load audits
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/audits", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load")
        const data: { audits?: AuditRow[] } = await res.json()
        if (!cancelled) setAudits(data.audits ?? [])
      } catch {
        if (!cancelled) setError("Failed to load audits")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (!roleLoaded) {
    return null
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-4 sm:mt-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Audits</h1>
          <p className="mt-2 text-sm text-muted-foreground">System activity visible to admins</p>
        </div>

        <Card className="p-0 border-border overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="p-10 text-center text-sm text-muted-foreground">{error}</div>
          ) : audits.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">No audits found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pl-6 pr-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">When</th>
                    <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Item</th>
                    <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Admin</th>
                    <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Action</th>
                    <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {audits.map((a) => (
                    <tr key={a.id} className="hover:bg-accent/50">
                      <td className="py-3 pl-6 pr-3 text-sm text-muted-foreground font-mono whitespace-nowrap">{a.createdAt}</td>
                      <td className="py-3 px-3 text-sm">
                        <Link href={`/ticket/${a.itemId}`} className="text-foreground hover:underline">
                          {a.itemTitle}
                        </Link>
                        <div className="text-xs text-muted-foreground font-mono">{a.itemId}</div>
                      </td>
                      <td className="py-3 px-3 text-sm text-muted-foreground">{a.user}</td>
                      <td className="py-3 px-3 text-sm">
                        <Badge variant="outline" className="px-2 py-0.5 text-xs">
                          {a.action}
                        </Badge>
                      </td>
                      <td className="py-3 px-6 text-sm">
                        {a.oldValue || a.newValue ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Old</div>
                              <div className="rounded border border-border bg-muted/30 p-2 text-xs text-foreground break-words min-h-[2rem]">
                                {a.oldValue ?? "-"}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">New</div>
                              <div className="rounded border border-border bg-muted/30 p-2 text-xs text-foreground break-words min-h-[2rem]">
                                {a.newValue ?? "-"}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}


