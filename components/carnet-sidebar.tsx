"use client"

import { cn } from "@/lib/utils"
import { useCarnets } from "@/hooks/use-carnet-store"
import {
  CreditCard,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

export type SectionKey =
  | "registro"
  | "pendientes"
  | "entrega"
  | "entregados"
  | "perdidos"

interface CarnetSidebarProps {
  active: SectionKey
  onNavigate: (key: SectionKey) => void
}

const navItems: { key: SectionKey; label: string; icon: React.ElementType }[] = [
  { key: "registro", label: "Registrar Carnet", icon: CreditCard },
  { key: "pendientes", label: "Pendientes", icon: Clock },
  { key: "entrega", label: "Entregar Carnet", icon: Truck },
  { key: "entregados", label: "Entregados", icon: CheckCircle2 },
  { key: "perdidos", label: "Carnets Perdidos", icon: AlertTriangle },
]

export function CarnetSidebar({ active, onNavigate }: CarnetSidebarProps) {
  const carnets = useCarnets()

  const counts = {
    registro: null,
    pendientes: carnets.filter((c) => c.estado === "Pendiente").length,
    entrega: null,
    entregados: carnets.filter((c) => c.estado === "Entregado").length,
    perdidos: carnets.filter((c) => c.estado === "Perdido").length,
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <CreditCard className="size-6 text-primary" />
        <h1 className="text-lg font-semibold text-card-foreground">
          Carnets
        </h1>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.key
          const count = counts[item.key]
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {count !== null && count > 0 && (
                <span
                  className={cn(
                    "min-w-5 rounded-full px-1.5 py-0.5 text-center text-xs font-semibold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">
          Total: {carnets.length} carnets registrados
        </p>
      </div>
    </aside>
  )
}
