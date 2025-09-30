import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateRiskScore, mapRiskCategory } from "@/lib/utils"
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

    const riskCategoryOf = (score: number | null | undefined): "low" | "mid" | "high" => {
      const s = typeof score === "number" ? score : 0
      if (s < 25) return "low"
      if (s < 50) return "mid"
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
      risk: riskCategoryOf(i.riskScore ?? 0),
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

    // Ensure the user exists to satisfy the foreign key on Item.createdBy
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: (session as any)?.user?.name ?? null,
        email: (session as any)?.user?.email ?? null,
      },
    })

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

    const baseTags = tag ? [tag] : []
    const score = calculateRiskScore(typeof price === "number" ? price : null, baseTags)
    const category = mapRiskCategory(score)
    const hasHighRisk = baseTags.map((t) => t.toLowerCase()).includes("high risk")
    const finalTags = category === "high" ? (hasHighRisk ? baseTags : [...baseTags, "High Risk"]) : baseTags

    const created = await prisma.item.create({
      data: {
        title,
        description,
        amount: typeof price === "number" ? price : null,
        tags: finalTags,
        riskScore: score,
        createdBy: userId,
      },
    })

    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (error) {
    console.error("POST /api/tickets error", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}


