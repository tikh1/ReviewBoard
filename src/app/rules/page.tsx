import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Risk Rules</h1>
          <p className="mt-2 text-sm text-muted-foreground">How the ticket risk category is determined</p>
        </div>

        <Card className="p-6 border-border">
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-lg font-semibold mb-2">Base Scoring</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>If Fee is between 1,000 and 2,999 (inclusive of 1,000), add 10 points</li>
                <li>If Fee is between 3,000 and 4,999 (inclusive of 3,000), add 25 points</li>
                <li>If Fee is 5,000 or more, add 50 points</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">Tag Adjustments</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>If tags contain &quot;Bug Report&quot; or &quot;Billing&quot;, add 20 points</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">Risk Category Mapping</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Total score &lt; 25 → Risk: Low</li>
                <li>25 ≤ Total score &lt; 50 → Risk: Mid</li>
                <li>Total score ≥ 50 → Risk: High</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">Notes</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Risk is derived automatically on the server from the current Fee and Tags.</li>
                <li>Updating Fee or Tags may change the Risk category accordingly.</li>
              </ul>
            </section>
          </div>
        </Card>
      </div>
    </div>
  )
}


