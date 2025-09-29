import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">ReviewBoard</h1>
          <p className="mt-2 text-gray-600">Sign in to continue</p>
        </div>
        
        <form
          action={async () => {
            "use server"
            await signIn("github", { redirectTo: "/" })
          }}
        >
          <button
            type="submit"
            className="w-full rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
          >
            Sign in with GitHub
          </button>
        </form>
      </div>
    </div>
  )
}