import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateRiskScore, mapRiskCategory } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const items = await prisma.item.findMany({
      select: { id: true, amount: true, tags: true },
    })

    let updatedCount = 0

    for (const item of items) {
      const score = calculateRiskScore(item.amount ?? null, item.tags ?? [])
      const category = mapRiskCategory(score)

      const tags = Array.isArray(item.tags) ? [...item.tags] : []
      const hasHighRisk = tags.map((t) => t.toLowerCase()).includes("high risk")
      const shouldHaveHighRisk = category === "high"

      let newTags = tags
      if (shouldHaveHighRisk && !hasHighRisk) {
        newTags = [...tags, "High Risk"]
      } else if (!shouldHaveHighRisk && hasHighRisk) {
        newTags = tags.filter((t) => t.toLowerCase() !== "high risk")
      }

      const updated = await prisma.item.update({
        where: { id: item.id },
        data: {
          riskScore: score,
          tags: newTags,
        },
      })

      if (updated) updatedCount += 1
    }

    return NextResponse.json({ ok: true, updated: updatedCount })
  } catch (error) {
    console.error("POST /api/cron/auto-tag-high-risk error", error)
    return NextResponse.json({ error: "Failed to update risk" }, { status: 500 })
  }
}

export async function GET() {
  // Allow manual triggering via GET for convenience/testing
  return POST()
}


