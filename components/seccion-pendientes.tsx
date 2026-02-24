"use client"

import { useState } from "react"
import { useCarnets } from "@/hooks/use-carnet-store"
import { entregarCarnet } from "@/lib/carnet-store"
import { CarnetCard } from "@/components/carnet-card"
import { SearchInput } from "@/components/search-input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock, Truck, CheckCircle2 } from "lucide-react"

export function SeccionPendientes() {
  const carnets = useCarnets()
  const [search, setSearch] = useState("")
  const [confirmCodigo, setConfirmCodigo] = useState<string | null>(null)
  const [success, setSuccess] = useState("")

  const pendientes = carnets.filter((c) => c.estado === "Pendiente")
  const filtered = search.trim()
    ? pendientes.filter((c) =>
        c.codigo.toLowerCase().includes(search.trim().toLowerCase())
      )
    : pendientes

  function handleEntregar() {
    if (!confirmCodigo) return
    const result = entregarCarnet(confirmCodigo)
    if (result.success) {
      setSuccess(`Carnet "${confirmCodigo}" entregado exitosamente.`)
      setTimeout(() => setSuccess(""), 3000)
    }
    setConfirmCodigo(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Carnets Pendientes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Visualice los carnets que estan pendientes de entrega.
        </p>
      </div>

      <SearchInput value={search} onChange={setSearch} />

      {success && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <p className="flex items-center gap-2 text-sm text-foreground">
            <CheckCircle2 className="size-4 text-primary" />
            {success}
          </p>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Clock className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {search.trim()
              ? "No se encontraron carnets con ese codigo."
              : "No hay carnets pendientes."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((carnet) => (
            <CarnetCard key={carnet.id} carnet={carnet}>
              <Button
                size="sm"
                className="w-full"
                onClick={() => setConfirmCodigo(carnet.codigo)}
              >
                <Truck className="size-4" />
                Entregar
              </Button>
            </CarnetCard>
          ))}
        </div>
      )}

      <Dialog
        open={confirmCodigo !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmCodigo(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Entrega</DialogTitle>
            <DialogDescription>
              {"Esta seguro de que desea marcar el carnet "}
              <strong>{confirmCodigo}</strong>
              {" como entregado? Esta accion no se puede deshacer."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCodigo(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEntregar}>
              Confirmar Entrega
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
