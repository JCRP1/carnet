"use client"

import { useState } from "react"
import { buscarPorCodigo, marcarPerdido } from "@/lib/carnet-store"
import { useCarnets } from "@/hooks/use-carnet-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchInput } from "@/components/search-input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export function SeccionPerdidos() {
  const carnets = useCarnets()
  const [codigoBusqueda, setCodigoBusqueda] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [searchList, setSearchList] = useState("")

  const perdidos = carnets.filter((c) => c.estado === "Perdido")
  const filteredPerdidos = searchList.trim()
    ? perdidos.filter((c) =>
        c.codigo.toLowerCase().includes(searchList.trim().toLowerCase())
      )
    : perdidos

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
    } else if (found.estado === "Perdido") {
      setError("Este carnet ya esta marcado como perdido.")
    } else {
      setShowConfirm(true)
    }
  }

  function handleMarcarPerdido() {
    const result = marcarPerdido(codigoBusqueda)
    if (result.success) {
      setSuccess(`Carnet "${codigoBusqueda.trim()}" marcado como perdido.`)
      setCodigoBusqueda("")
    } else {
      setError(result.error || "Error al marcar como perdido.")
    }
    setShowConfirm(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Carnets Perdidos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reporte carnets como perdidos y vea el listado de carnets perdidos.
        </p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Reportar Carnet Perdido</CardTitle>
          <CardDescription>
            Busque un carnet por codigo para marcarlo como perdido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBuscar} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="codigo-perdido">Codigo del Carnet</Label>
              <div className="flex gap-2">
                <Input
                  id="codigo-perdido"
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

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-foreground">Listado de Carnets Perdidos</h3>
        <SearchInput
          value={searchList}
          onChange={setSearchList}
          placeholder="Filtrar perdidos por codigo..."
        />

        {filteredPerdidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <AlertTriangle className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchList.trim()
                ? "No se encontraron carnets perdidos con ese codigo."
                : "No hay carnets perdidos."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredPerdidos.map((carnet) => (
              <div
                key={carnet.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-4 text-destructive" />
                  <span className="text-sm font-medium text-foreground">
                    {carnet.codigo}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(carnet.fechaRegistro), "dd/MM/yyyy")}
                  </span>
                  <Badge variant="destructive">Perdido</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Reporte de Perdida</DialogTitle>
            <DialogDescription>
              {"Esta seguro de que desea marcar el carnet "}
              <strong>{codigoBusqueda.trim()}</strong>
              {" como perdido? Esta accion no se puede deshacer."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleMarcarPerdido}>
              Marcar como Perdido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
