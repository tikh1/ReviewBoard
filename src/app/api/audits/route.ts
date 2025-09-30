import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const audits = await prisma.audit.findMany({
      include: { user: true, item: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    })

    const data = audits.map((a) => ({
      id: a.id,
      itemId: a.itemId,
      itemTitle: a.item?.title ?? "-",
      user: a.user?.name ?? "-",
      action: a.action,
      oldValue: a.oldValue ?? null,
      newValue: a.newValue ?? null,
      createdAt: a.createdAt.toISOString().slice(0, 19).replace("T", " "),
    }))

    return NextResponse.json({ audits: data })
  } catch (error) {
    console.error("GET /api/audits error", error)
    return NextResponse.json({ error: "Failed to load audits" }, { status: 500 })
  }
}


