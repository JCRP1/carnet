import { useSyncExternalStore } from "react"
import { subscribe, getSnapshot, type Carnet } from "@/lib/carnet-store"

export function useCarnets(): Carnet[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
