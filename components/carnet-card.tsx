"use client"

import { type Carnet } from "@/lib/carnet-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const estadoVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Pendiente: "outline",
  Entregado: "default",
  Perdido: "destructive",
}

interface CarnetCardProps {
  carnet: Carnet
  showImage?: boolean
  children?: React.ReactNode
}

export function CarnetCard({ carnet, showImage = true, children }: CarnetCardProps) {
  return (
    <Card className="overflow-hidden">
      {showImage && carnet.imagen && (
        <div className="border-b border-border bg-muted">
          <img
            src={carnet.imagen}
            alt={`Carnet ${carnet.codigo}`}
            className="h-40 w-full object-contain"
          />
        </div>
      )}
      <CardContent className="flex flex-col gap-3 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">{carnet.codigo}</p>
          <Badge variant={estadoVariant[carnet.estado]}>{carnet.estado}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Registrado: {format(new Date(carnet.fechaRegistro), "dd/MM/yyyy HH:mm")}
        </p>
        {children}
      </CardContent>
    </Card>
  )
}
