import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {session.user?.name}!</h1>
            <p className="text-gray-600">{session.user?.email}</p>
          </div>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">
              Sign Out
            </button>
          </form>
        </div>
        
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-600">User ID: {session.user?.id}</p>
        </div>
      </div>
    </div>
  )
}