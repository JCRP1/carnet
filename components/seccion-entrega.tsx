"use client"

import { useState } from "react"
import { buscarPorCodigo, entregarCarnet } from "@/lib/carnet-store"
import { useCarnets } from "@/hooks/use-carnet-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CarnetCard } from "@/components/carnet-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Truck, CheckCircle2 } from "lucide-react"

export function SeccionEntrega() {
  useCarnets() // subscribe to updates
  const [codigoBusqueda, setCodigoBusqueda] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)

  const carnetEncontrado = codigoBusqueda.trim()
    ? buscarPorCodigo(codigoBusqueda)
    : undefined

  const esPendiente = carnetEncontrado?.estado === "Pendiente"

  function handleBuscar(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!codigoBusqueda.trim()) {
      setError("Ingrese un codigo para buscar.")
      return
    }
    const found = buscarPorCodigo(codigoBusqueda)
    if (!found) {
      setError("No se encontro ningun carnet con ese codigo.")
    } else if (found.estado !== "Pendiente") {
      setError(`El carnet ya tiene estado: ${found.estado}.`)
    }
  }

  function handleEntregar() {
    const result = entregarCarnet(codigoBusqueda)
    if (result.success) {
      setSuccess(`Carnet "${codigoBusqueda.trim()}" entregado exitosamente.`)
      setCodigoBusqueda("")
    } else {
      setError(result.error || "Error al entregar.")
    }
    setShowConfirm(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Entregar Carnet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Busque un carnet pendiente por codigo y marque su entrega.
        </p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Buscar Carnet</CardTitle>
          <CardDescription>
            Ingrese el codigo del carnet a entregar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBuscar} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="codigo-entrega">Codigo del Carnet</Label>
              <div className="flex gap-2">
                <Input
                  id="codigo-entrega"
                  placeholder="Ej: CARN-001"
                  value={codigoBusqueda}
                  onChange={(e) => {
                    setCodigoBusqueda(e.target.value)
                    setError("")
                    setSuccess("")
                  }}
                />
                <Button type="submit" variant="outline" size="icon">
                  <Search className="size-4" />
                  <span className="sr-only">Buscar</span>
                </Button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                <p className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="size-4" />
                  {success}
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {carnetEncontrado && esPendiente && (
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Carnet Encontrado</CardTitle>
            <CardDescription>
              Verifique los datos antes de entregar.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <CarnetCard carnet={carnetEncontrado} />
            <Button onClick={() => setShowConfirm(true)} className="w-full">
              <Truck className="size-4" />
              Entregar Carnet
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Entrega</DialogTitle>
            <DialogDescription>
              {"Esta seguro de que desea marcar el carnet "}
              <strong>{codigoBusqueda.trim()}</strong>
              {" como entregado? Esta accion no se puede deshacer."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
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
