import { create } from 'zustand'

interface GraphStore {
  // Zoom & pan state
  zoom: number
  panX: number
  panY: number

  // Actions
  setZoom: (zoom: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
  setPan: (x: number, y: number) => void
}

export const useGraphStore = create<GraphStore>((set) => ({
  zoom: 1,
  panX: 0,
  panY: 0,

  setZoom: (zoom) => set({ zoom: Math.max(0.2, Math.min(3, zoom)) }),

  zoomIn: () =>
    set((state) => ({ zoom: Math.min(3, state.zoom * 1.25) })),

  zoomOut: () =>
    set((state) => ({ zoom: Math.max(0.2, state.zoom / 1.25) })),

  resetView: () => set({ zoom: 1, panX: 0, panY: 0 }),

  setPan: (x, y) => set({ panX: x, panY: y }),
}))
