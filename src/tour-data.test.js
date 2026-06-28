import { describe, it, expect } from 'vitest'
import {
  scenes,
  property,
  getScene,
  getSceneIndex,
  nextScene,
  prevScene,
  FLOORPLAN,
} from './tour-data.js'

describe('grafo de escenas', () => {
  it('tiene al menos una escena con id único', () => {
    const ids = scenes.map((s) => s.id)
    expect(scenes.length).toBeGreaterThan(0)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('cada escena tiene al menos una imagen', () => {
    for (const s of scenes) {
      expect(Array.isArray(s.images)).toBe(true)
      expect(s.images.length).toBeGreaterThan(0)
    }
  })

  it('todos los hotspots apuntan a una escena existente', () => {
    const ids = new Set(scenes.map((s) => s.id))
    for (const s of scenes) {
      for (const h of s.hotspots) {
        expect(ids.has(h.to)).toBe(true)
      }
    }
  })

  it('los hotspots no enlazan a su propia escena', () => {
    for (const s of scenes) {
      for (const h of s.hotspots) {
        expect(h.to).not.toBe(s.id)
      }
    }
  })

  it('las coordenadas de los hotspots están dentro de la imagen (0-100%)', () => {
    for (const s of scenes) {
      for (const h of s.hotspots) {
        expect(h.x).toBeGreaterThanOrEqual(0)
        expect(h.x).toBeLessThanOrEqual(100)
        expect(h.y).toBeGreaterThanOrEqual(0)
        expect(h.y).toBeLessThanOrEqual(100)
      }
    }
  })
})

describe('helpers de navegación', () => {
  it('getScene devuelve la escena correcta o undefined', () => {
    expect(getScene(scenes[0].id)).toBe(scenes[0])
    expect(getScene('no-existe')).toBeUndefined()
  })

  it('getSceneIndex devuelve el índice o -1', () => {
    expect(getSceneIndex(scenes[1].id)).toBe(1)
    expect(getSceneIndex('no-existe')).toBe(-1)
  })

  it('nextScene avanza y es circular', () => {
    expect(nextScene(scenes[0].id).id).toBe(scenes[1].id)
    const last = scenes[scenes.length - 1].id
    expect(nextScene(last).id).toBe(scenes[0].id)
  })

  it('prevScene retrocede y es circular', () => {
    expect(prevScene(scenes[1].id).id).toBe(scenes[0].id)
    expect(prevScene(scenes[0].id).id).toBe(scenes[scenes.length - 1].id)
  })

  it('next/prev devuelven undefined para id inexistente', () => {
    expect(nextScene('no-existe')).toBeUndefined()
    expect(prevScene('no-existe')).toBeUndefined()
  })
})

describe('plano interactivo (floorplan)', () => {
  it('expone una grilla con dimensiones positivas', () => {
    expect(FLOORPLAN.width).toBeGreaterThan(0)
    expect(FLOORPLAN.height).toBeGreaterThan(0)
  })

  it('cada bloque del plano cabe dentro de la grilla', () => {
    for (const s of scenes) {
      if (!s.plan) continue
      const { x, y, w, h } = s.plan
      expect(w).toBeGreaterThan(0)
      expect(h).toBeGreaterThan(0)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(x + w).toBeLessThanOrEqual(FLOORPLAN.width)
      expect(y + h).toBeLessThanOrEqual(FLOORPLAN.height)
    }
  })

  it('los bloques del plano no se solapan entre sí', () => {
    const rooms = scenes.filter((s) => s.plan)
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const a = rooms[i].plan
        const b = rooms[j].plan
        const disjoint =
          a.x + a.w <= b.x ||
          b.x + b.w <= a.x ||
          a.y + a.h <= b.y ||
          b.y + b.h <= a.y
        expect(disjoint).toBe(true)
      }
    }
  })
})

describe('ficha del inmueble', () => {
  it('tiene los campos requeridos', () => {
    expect(property.type).toBeTruthy()
    expect(property.title).toBeTruthy()
    expect(Array.isArray(property.features)).toBe(true)
    expect(property.features.length).toBeGreaterThan(0)
    expect(property.contact.whatsapp).toMatch(/^\d+$/)
  })
})
