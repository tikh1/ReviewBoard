import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Risk utilities
export type RiskCategory = "low" | "mid" | "high"

export function calculateRiskScore(amount: number | null | undefined, tags: string[] | null | undefined): number {
  let score = 0
  const fee = typeof amount === "number" ? amount : 0
  if (fee >= 1000 && fee < 3000) score += 10
  else if (fee >= 3000 && fee < 5000) score += 25
  else if (fee >= 5000) score += 50
  const tagList = Array.isArray(tags) ? tags.map((t) => t.toLowerCase()) : []
  if (tagList.includes("bug report") || tagList.includes("billing")) score += 20
  return score
}

export function mapRiskCategory(score: number): RiskCategory {
  if (score < 25) return "low"
  if (score < 50) return "mid"
  return "high"
}
