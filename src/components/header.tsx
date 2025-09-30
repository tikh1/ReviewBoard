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
import { LogOut, Shield, Menu, X } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const { setRole, isAdmin } = useUser()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // test user
  // const user = {
  //   name: "Ahmet Yılmaz",
  //   email: "ahmetyilmaz@example.com",
  //   avatar: "/placeholder-user.png",
  // }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/signin" })
  }

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true)
    requestAnimationFrame(() => {
      setIsAnimating(true)
    })
  }

  const closeMobileMenu = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsMobileMenuOpen(false)
    }, 300)
  }

  if (!session?.user) {
    return null
  }

const user = session.user

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
            <div className="hidden md:flex items-center gap-3">
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
          </div>

          <div className="hidden md:flex items-center gap-4">
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
                  <div className="text-left">
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

          <div className="md:hidden">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9"
              onClick={openMobileMenu}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile right-side menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeMobileMenu}
          />
          <div className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background border-l border-border shadow-lg transform transition-transform duration-300 ease-in-out ${
            isAnimating ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Menu</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeMobileMenu}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Navigation</h3>
                <Link 
                  href="/dashboard" 
                  className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/rules" 
                  className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                  onClick={closeMobileMenu}
                >
                  Rules
                </Link>
                {isAdmin && (
                  <Link 
                    href="/audits" 
                    className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Audits
                  </Link>
                )}
                <Link 
                  href="/about" 
                  className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Account</h3>
                
                <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="mobile-role-switch" className="text-sm font-medium cursor-pointer">
                      Admin Mode
                    </Label>
                  </div>
                  <Switch
                    id="mobile-role-switch"
                    checked={isAdmin}
                    onCheckedChange={(checked) => setRole(checked ? "admin" : "user")}
                  />
                </div>
                <p className="text-xs text-muted-foreground px-3">
                  {isAdmin ? "You are signed in as admin" : "You are signed in as user"}
                </p>

                <div className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>

                <Button
                  variant="destructive"
                  className="w-full mt-4"
                  onClick={() => {
                    closeMobileMenu()
                    handleLogout()
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
