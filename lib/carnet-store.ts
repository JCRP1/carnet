export type CarnetEstado = "Pendiente" | "Entregado" | "Perdido"

export interface Carnet {
  id: number
  codigo: string
  imagen: string // base64 data URL
  estado: CarnetEstado
  fechaRegistro: string
}

let carnets: Carnet[] = []
let nextId = 1
let listeners: Array<() => void> = []

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function getSnapshot(): Carnet[] {
  return carnets
}

export function registrarCarnet(codigo: string, imagen: string): { success: boolean; error?: string } {
  const codigoTrimmed = codigo.trim()
  if (!codigoTrimmed) {
    return { success: false, error: "El codigo es obligatorio." }
  }
  if (!imagen) {
    return { success: false, error: "La imagen es obligatoria." }
  }
  const exists = carnets.find((c) => c.codigo.toLowerCase() === codigoTrimmed.toLowerCase())
  if (exists) {
    return { success: false, error: "Ya existe un carnet con este codigo." }
  }
  const newCarnet: Carnet = {
    id: nextId++,
    codigo: codigoTrimmed,
    imagen,
    estado: "Pendiente",
    fechaRegistro: new Date().toISOString(),
  }
  carnets = [...carnets, newCarnet]
  emitChange()
  return { success: true }
}

export function entregarCarnet(codigo: string): { success: boolean; error?: string } {
  const index = carnets.findIndex(
    (c) => c.codigo.toLowerCase() === codigo.trim().toLowerCase() && c.estado === "Pendiente"
  )
  if (index === -1) {
    return { success: false, error: "No se encontro un carnet pendiente con ese codigo." }
  }
  carnets = carnets.map((c, i) => (i === index ? { ...c, estado: "Entregado" as CarnetEstado } : c))
  emitChange()
  return { success: true }
}

export function marcarPerdido(codigo: string): { success: boolean; error?: string } {
  const index = carnets.findIndex(
    (c) => c.codigo.toLowerCase() === codigo.trim().toLowerCase() && c.estado !== "Perdido"
  )
  if (index === -1) {
    return { success: false, error: "No se encontro un carnet valido con ese codigo." }
  }
  carnets = carnets.map((c, i) => (i === index ? { ...c, estado: "Perdido" as CarnetEstado } : c))
  emitChange()
  return { success: true }
}

export function buscarPorCodigo(codigo: string): Carnet | undefined {
  return carnets.find((c) => c.codigo.toLowerCase() === codigo.trim().toLowerCase())
}
