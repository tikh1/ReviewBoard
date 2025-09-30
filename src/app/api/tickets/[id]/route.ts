import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params
    const item = await prisma.item.findUnique({
      where: { id },
      include: { user: true },
    })
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const mapStatus = (s: string) => {
      switch (s) {
        case "NEW":
          return "New"
        case "IN_REVIEW":
          return "In-Review"
        case "REJECTED":
          return "Rejected"
        case "APPROVED":
          return "Approved"
        default:
          return "New"
      }
    }

    const riskOf = (amount: number | null | undefined, tags: string[] | null | undefined): "low" | "mid" | "high" => {
      let score = 0
      const fee = typeof amount === "number" ? amount : 0
      if (fee >= 1000 && fee < 3000) score += 10
      else if (fee >= 3000 && fee < 5000) score += 25
      else if (fee >= 5000) score += 50
      const tagList = Array.isArray(tags) ? tags.map((t) => t.toLowerCase()) : []
      if (tagList.includes("bug report") || tagList.includes("billing")) score += 20
      if (score < 25) return "low"
      if (score < 50) return "mid"
      return "high"
    }

    const ticket = {
      id: item.id,
      title: item.title,
      description: item.description,
      status: mapStatus(String(item.status)),
      risk: riskOf(item.amount ?? null, item.tags ?? []),
      tags: item.tags ?? [],
      assignedTo: item.user?.name ?? "-",
      createdAt: item.createdAt.toISOString().slice(0, 10),
      price: item.amount ?? 0,
      createdBy: item.user?.name ?? "-",
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error("GET /api/tickets/[id] error", error)
    return NextResponse.json({ error: "Failed to load" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await ctx.params
    const body = await req.json().catch(() => ({})) as {
      status?: "New" | "In-Review" | "Rejected" | "Approved" | "open" | "pending" | "closed"
      note?: string
    }

    const item = await prisma.item.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const toDbStatus = (s: string | undefined) => {
      switch (s) {
        // New labels
        case "New":
          return "NEW"
        case "In-Review":
          return "IN_REVIEW"
        case "Rejected":
          return "REJECTED"
        case "Approved":
          return "APPROVED"
        // Backward compatible legacy values
        case "open":
          return "NEW"
        case "pending":
          return "IN_REVIEW"
        case "closed":
          return "APPROVED"
        default:
          return undefined
      }
    }

    const updateData: any = {}
    if (body.status) {
      const dbStatus = toDbStatus(body.status)
      if (dbStatus) updateData.status = dbStatus as any
    }

    const updates: Array<Promise<any>> = []
    let updatedItem = item
    if (Object.keys(updateData).length > 0) {
      updates.push(
        prisma.item.update({ where: { id }, data: updateData }).then((res) => (updatedItem = res))
      )
    }

    const audits: Array<Promise<any>> = []
    if (body.status) {
      audits.push(
        prisma.audit.create({
          data: {
            itemId: id,
            userId,
            action: "STATUS_CHANGED",
            oldValue: String(item.status),
            newValue: (toDbStatus(body.status) as string) ?? String(item.status),
          },
        })
      )
    }
    if (body.note && body.note.trim().length > 0) {
      audits.push(
        prisma.audit.create({
          data: {
            itemId: id,
            userId,
            action: "NOTE_ADDED",
            newValue: body.note.trim(),
          },
        })
      )
    }

    await Promise.all([...updates, ...audits])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("PATCH /api/tickets/[id] error", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}


