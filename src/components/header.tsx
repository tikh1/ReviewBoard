"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LogOut, Shield } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import Link from "next/link"

export function Header() {
  const { role, setRole, isAdmin } = useUser()
  const { data: session } = useSession()
  const router = useRouter()

  // test user
  // const user = {
  //   name: "Ahmet Yılmaz",
  //   email: "ahmetyilmaz@example.com",
  //   avatar: "/placeholder-user.png",
  // }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/signin" })
  }

  if (!session?.user) {
    return null
  }

const user = session.user

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary-foreground"
            >
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
          </div>
          <Link href="/dashboard" className="text-lg font-semibold text-foreground transition-colors duration-300 hover:opacity-80">
            Dashboard
          </Link>
          <div className="h-5 w-px bg-border ml-1 mr-1" />
          <Link href="/rules">
            <Button variant="ghost" className="h-8 px-3">Rules</Button>
          </Link>
          {isAdmin && (
            <Link href="/audits">
              <Button variant="ghost" className="h-8 px-3">Audits</Button>
            </Link>
          )}
          <Link href="/about">
            <Button variant="ghost" className="h-8 px-3">About</Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 transition-all duration-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg p-1">
                <Avatar className="h-9 w-9 transition-all duration-300">
                  <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium transition-colors duration-300">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground transition-colors duration-300">{user.name}</p>
                  <p className="text-xs text-muted-foreground transition-colors duration-300">{user.email}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="role-switch" className="text-sm font-medium cursor-pointer">
                      Admin Mode
                    </Label>
                  </div>
                  <Switch
                    id="role-switch"
                    checked={isAdmin}
                    onCheckedChange={(checked) => setRole(checked ? "admin" : "user")}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 ml-6">
                  {isAdmin ? "You are signed in as admin" : "You are signed in as user"}
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-8 w-px bg-border transition-colors duration-300" />

          <ThemeToggle />

          <div className="h-8 w-px bg-border transition-colors duration-300" />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
