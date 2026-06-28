import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RoomMenu from './RoomMenu.jsx'

const scenes = [
  { id: 'sala', title: 'Sala', images: ['scenes/sala-1.jpg'], hotspots: [] },
  { id: 'cocina', title: 'Cocina', images: ['scenes/cocina-1.jpg'], hotspots: [] },
]

describe('RoomMenu', () => {
  it('renderiza una miniatura por habitación', () => {
    render(<RoomMenu scenes={scenes} currentId="sala" onSelect={() => {}} />)
    expect(screen.getByText('Sala')).toBeInTheDocument()
    expect(screen.getByText('Cocina')).toBeInTheDocument()
  })

  it('marca la habitación activa con aria-current', () => {
    render(<RoomMenu scenes={scenes} currentId="cocina" onSelect={() => {}} />)
    const activo = screen.getByRole('button', { current: true })
    expect(activo).toHaveTextContent('Cocina')
  })

  it('llama onSelect con el id al hacer clic', () => {
    const onSelect = vi.fn()
    render(<RoomMenu scenes={scenes} currentId="sala" onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Cocina'))
    expect(onSelect).toHaveBeenCalledWith('cocina')
  })
})
