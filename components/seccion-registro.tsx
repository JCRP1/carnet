"use client"

import { useState, useRef } from "react"
import { registrarCarnet } from "@/lib/carnet-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon, X } from "lucide-react"

export function SeccionRegistro() {
  const [codigo, setCodigo] = useState("")
  const [imagen, setImagen] = useState<string>("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImagen(reader.result as string)
      setError("")
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    const result = registrarCarnet(codigo, imagen)
    if (result.success) {
      setSuccess(`Carnet "${codigo.trim()}" registrado exitosamente.`)
      setCodigo("")
      setImagen("")
      if (fileInputRef.current) fileInputRef.current.value = ""
    } else {
      setError(result.error || "Error al registrar.")
    }
  }

  function clearImage() {
    setImagen("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Registrar Carnet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre un nuevo carnet ingresando el codigo y subiendo una imagen.
        </p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Nuevo Carnet</CardTitle>
          <CardDescription>
            Complete los campos para registrar un carnet pendiente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="codigo">Codigo del Carnet</Label>
              <Input
                id="codigo"
                placeholder="Ej: CARN-001"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value)
                  setError("")
                  setSuccess("")
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Imagen del Carnet</Label>
              {imagen ? (
                <div className="relative overflow-hidden rounded-lg border border-border">
                  <img
                    src={imagen}
                    alt="Vista previa del carnet"
                    className="h-48 w-full object-contain bg-muted"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 rounded-full bg-foreground/80 p-1 text-background transition-colors hover:bg-foreground"
                  >
                    <X className="size-4" />
                    <span className="sr-only">Remover imagen</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-48 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:bg-muted/60"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <ImageIcon className="size-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      Haga clic para subir imagen
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG o JPEG
                    </p>
                  </div>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                <p className="text-sm text-foreground">{success}</p>
              </div>
            )}

            <Button type="submit" className="w-full">
              <Upload className="size-4" />
              Registrar Carnet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
