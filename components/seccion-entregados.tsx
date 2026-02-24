"use client"

import { useState } from "react"
import { useCarnets } from "@/hooks/use-carnet-store"
import { CarnetCard } from "@/components/carnet-card"
import { SearchInput } from "@/components/search-input"
import { CheckCircle2 } from "lucide-react"

export function SeccionEntregados() {
  const carnets = useCarnets()
  const [search, setSearch] = useState("")

  const entregados = carnets.filter((c) => c.estado === "Entregado")
  const filtered = search.trim()
    ? entregados.filter((c) =>
        c.codigo.toLowerCase().includes(search.trim().toLowerCase())
      )
    : entregados

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Carnets Entregados</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Historial de carnets que han sido entregados.
        </p>
      </div>

      <SearchInput value={search} onChange={setSearch} />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <CheckCircle2 className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {search.trim()
              ? "No se encontraron carnets entregados con ese codigo."
              : "No hay carnets entregados."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((carnet) => (
            <CarnetCard key={carnet.id} carnet={carnet} />
          ))}
        </div>
      )}
    </div>
  )
}
