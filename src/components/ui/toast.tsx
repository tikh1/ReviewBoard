"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"

type ToastKind = "success" | "error" | "info"

interface ToastItem {
  id: string
  title?: string
  message: string
  kind: ToastKind
  durationMs: number
}

interface ToastContextValue {
  showToast: (opts: { message: string; kind?: ToastKind; title?: string; durationMs?: number }) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Record<string, { dismiss?: ReturnType<typeof setTimeout>; remove?: ReturnType<typeof setTimeout> }>>({})
  const [animState, setAnimState] = useState<Record<string, "enter" | "shown" | "leaving">>({})
  const [isClient, setIsClient] = useState(false)

  const removeImmediate = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    setAnimState((s) => {
      const { [id]: _, ...rest } = s
      return rest
    })
    if (timersRef.current[id]?.dismiss) clearTimeout(timersRef.current[id].dismiss)
    if (timersRef.current[id]?.remove) clearTimeout(timersRef.current[id].remove)
    delete timersRef.current[id]
  }, [])

  const startLeave = useCallback((id: string) => {
    setAnimState((s) => ({ ...s, [id]: "leaving" }))
    timersRef.current[id] = timersRef.current[id] || {}
    timersRef.current[id].remove = setTimeout(() => removeImmediate(id), 250)
  }, [removeImmediate])

  const showToast = useCallback((opts: { message: string; kind?: ToastKind; title?: string; durationMs?: number }) => {
    const id = Math.random().toString(36).slice(2)
    const toast: ToastItem = {
      id,
      title: opts.title,
      message: opts.message,
      kind: opts.kind ?? "info",
      durationMs: opts.durationMs ?? 3000,
    }
    setToasts((prev) => [...prev, toast])
    setAnimState((s) => ({ ...s, [id]: "enter" }))
    // kick to shown for enter animation
    setTimeout(() => setAnimState((s) => ({ ...s, [id]: "shown" })), 10)
    timersRef.current[id] = timersRef.current[id] || {}
    timersRef.current[id].dismiss = setTimeout(() => startLeave(id), toast.durationMs)
  }, [startLeave])

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((t) => {
        if (t.dismiss) clearTimeout(t.dismiss)
        if (t.remove) clearTimeout(t.remove)
      })
      timersRef.current = {}
    }
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  // Global event bridge so non-hook contexts can trigger toasts
  useEffect(() => {
    function onToast(e: Event) {
      const custom = e as CustomEvent
      const d = (custom?.detail as { message?: string; kind?: ToastKind; title?: string; durationMs?: number }) || {}
      showToast({ message: String(d.message || ""), kind: d.kind, title: d.title, durationMs: d.durationMs })
    }
    window.addEventListener("app:toast", onToast)
    return () => window.removeEventListener("app:toast", onToast)
  }, [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {isClient && (
        <div className="pointer-events-none fixed top-24 right-6 z-[60] flex w-full max-w-md flex-col gap-4">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={
                `pointer-events-auto rounded-md border p-5 shadow-2xl transition-all duration-300 ` +
                `bg-background/95 backdrop-blur-sm border-border text-foreground ` +
                (t.kind === "success"
                  ? "ring-2 ring-green-500/40 border-l-4 border-l-green-500/70"
                  : t.kind === "error"
                  ? "ring-2 ring-red-500/40 border-l-4 border-l-red-500/70"
                  : "ring-2 ring-blue-500/30 border-l-4 border-l-blue-500/60") +
                " " +
                (animState[t.id] === "shown"
                  ? "opacity-100 translate-x-0"
                  : animState[t.id] === "leaving"
                  ? "opacity-0 translate-x-4"
                  : "opacity-0 translate-x-4")
              }
            >
              {t.title && <div className="mb-1 text-base font-semibold">{t.title}</div>}
              <div className="text-[0.95rem] text-foreground leading-relaxed">{t.message}</div>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a ToastProvider")
  return ctx
}


