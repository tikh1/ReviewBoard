"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"
import type { Session } from "next-auth"

type UserRole = "user" | "admin"

interface UserContextType {
  user: Session["user"] | null
  role: UserRole
  setRole: (role: UserRole) => void
  isAdmin: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("user")
  const { data: session } = useSession()

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as UserRole
    if (savedRole === "admin" || savedRole === "user") {
      setRoleState(savedRole)
    }
  }, [])

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    localStorage.setItem("userRole", newRole)
  }

  return <UserContext.Provider value={{ user: session?.user ?? null, role, setRole, isAdmin: role === "admin" }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
