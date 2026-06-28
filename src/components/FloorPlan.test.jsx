import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FloorPlan from './FloorPlan.jsx'

const grid = { width: 10, height: 10 }
const scenes = [
  { id: 'sala', title: 'Sala', plan: { x: 0, y: 0, w: 5, h: 5 } },
  { id: 'cocina', title: 'Cocina', plan: { x: 5, y: 0, w: 5, h: 5 } },
  // Escena sin `plan`: no debe aparecer en el plano.
  { id: 'patio', title: 'Patio' },
]

describe('FloorPlan', () => {
  it('dibuja un bloque por cada escena que tiene plan', () => {
    render(<FloorPlan scenes={scenes} currentId="sala" onSelect={() => {}} grid={grid} />)
    expect(screen.getByRole('button', { name: /Sala/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cocina/ })).toBeInTheDocument()
  })

  it('omite las escenas sin plan', () => {
    render(<FloorPlan scenes={scenes} currentId="sala" onSelect={() => {}} grid={grid} />)
    expect(screen.queryByRole('button', { name: /Patio/ })).not.toBeInTheDocument()
  })

  it('marca la habitación actual con aria-current', () => {
    render(<FloorPlan scenes={scenes} currentId="cocina" onSelect={() => {}} grid={grid} />)
    const activo = screen.getByRole('button', { current: true })
    expect(activo).toHaveTextContent('Cocina')
  })

  it('posiciona cada bloque según su plan y la grilla (en %)', () => {
    render(<FloorPlan scenes={scenes} currentId="sala" onSelect={() => {}} grid={grid} />)
    const cocina = screen.getByRole('button', { name: /Cocina/ })
    expect(cocina.style.left).toBe('50%')
    expect(cocina.style.top).toBe('0%')
    expect(cocina.style.width).toBe('50%')
    expect(cocina.style.height).toBe('50%')
  })

  it('llama onSelect con el id al hacer clic en un bloque', () => {
    const onSelect = vi.fn()
    render(<FloorPlan scenes={scenes} currentId="sala" onSelect={onSelect} grid={grid} />)
    fireEvent.click(screen.getByRole('button', { name: /Cocina/ }))
    expect(onSelect).toHaveBeenCalledWith('cocina')
  })

  it('no renderiza nada si ninguna escena tiene plan', () => {
    const sinPlan = [{ id: 'a', title: 'A' }]
    const { container } = render(
      <FloorPlan scenes={sinPlan} currentId="a" onSelect={() => {}} grid={grid} />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
