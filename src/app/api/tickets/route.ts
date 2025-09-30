import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { NextRequest } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const scope = searchParams.get("scope") || "mine"
    const statusParam = searchParams.get("status") || "all"
    const riskParam = searchParams.get("risk") || "all"

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // If scope=all, return all items; otherwise default to only the current user's items.
    const whereClause = scope === "all"
      ? {}
      : userId
        ? { createdBy: userId }
        : { id: "__deny__" }

    // Map status filter to DB enum(s)
    const statusWhere = (() => {
      switch (statusParam) {
        case "New":
          return { in: ["NEW"] as any }
        case "In-Review":
          return { in: ["IN_REVIEW"] as any }
        case "Rejected":
          return { in: ["REJECTED"] as any }
        case "Approved":
          return { in: ["APPROVED"] as any }
        default:
          return undefined
      }
    })()

    const items = await prisma.item.findMany({
      where: whereClause,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    })

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

    const ticketsAll = items
      .filter((i) => {
        if (!statusWhere) return true
        const s = String(i.status)
        return (statusWhere.in as string[]).includes(s)
      })
      .map((i) => ({
      id: i.id,
      title: i.title,
      description: i.description,
      status: mapStatus(String(i.status)),
      risk: riskOf(i.amount ?? null, i.tags ?? []),
      assignedTo: i.user?.name ?? "-",
      createdAt: i.createdAt.toISOString().slice(0, 10),
      price: i.amount ?? 0,
      createdBy: i.createdBy ?? "-",
      }))

    const tickets = riskParam === "all" ? ticketsAll : ticketsAll.filter((t) => t.risk === (riskParam as any))

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error("GET /api/tickets error", error)
    return NextResponse.json({ error: "Failed to load tickets" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, tag, price } = body as {
      title?: string
      description?: string
      tag?: string
      price?: number
    }

    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const created = await prisma.item.create({
      data: {
        title,
        description,
        amount: typeof price === "number" ? price : null,
        tags: tag ? [tag] : [],
        createdBy: userId,
        // status defaults to NEW; riskScore defaults to 0
      },
    })

    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (error) {
    console.error("POST /api/tickets error", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}


