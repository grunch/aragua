import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SceneViewer from './SceneViewer.jsx'

const sceneWithGallery = {
  id: 'sala',
  title: 'Sala',
  subtitle: 'Estancia luminosa',
  images: ['scenes/sala-1.jpg', 'scenes/sala-2.jpg'],
  hotspots: [{ to: 'comedor', label: 'Ir al comedor', x: 50, y: 50 }],
}

const sceneSingle = {
  id: 'bano',
  title: 'Baño',
  subtitle: 'Completo',
  images: ['scenes/bano-1.jpg'],
  thumb: 'scenes/bano-thumb.jpg',
  hotspots: [],
}

describe('SceneViewer', () => {
  it('muestra el título y subtítulo de la habitación', () => {
    render(<SceneViewer scene={sceneWithGallery} onNavigate={() => {}} />)
    expect(screen.getByText('Sala')).toBeInTheDocument()
    expect(screen.getByText('Estancia luminosa')).toBeInTheDocument()
  })

  it('llama onNavigate con el destino al pulsar un hotspot', () => {
    const onNavigate = vi.fn()
    render(<SceneViewer scene={sceneWithGallery} onNavigate={onNavigate} />)
    fireEvent.click(screen.getByRole('button', { name: 'Ir al comedor' }))
    expect(onNavigate).toHaveBeenCalledWith('comedor')
  })

  it('muestra controles de galería sólo si hay varias fotos', () => {
    const { rerender } = render(
      <SceneViewer scene={sceneWithGallery} onNavigate={() => {}} />
    )
    expect(
      screen.getByRole('button', { name: 'Siguiente foto de la habitación' })
    ).toBeInTheDocument()

    rerender(<SceneViewer scene={sceneSingle} onNavigate={() => {}} />)
    expect(
      screen.queryByRole('button', { name: 'Siguiente foto de la habitación' })
    ).not.toBeInTheDocument()
  })

  it('avanza de foto al pulsar siguiente', () => {
    render(<SceneViewer scene={sceneWithGallery} onNavigate={() => {}} />)
    const dots = screen.getAllByRole('tab')
    expect(dots[0]).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(
      screen.getByRole('button', { name: 'Siguiente foto de la habitación' })
    )
    expect(dots[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('muestra el esqueleto (blur) mientras la imagen no ha cargado', () => {
    const { container } = render(
      <SceneViewer scene={sceneSingle} onNavigate={() => {}} />
    )
    const skeleton = container.querySelector('.viewer__skeleton')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).not.toHaveClass('is-loaded')
    // Usa la miniatura como placeholder difuminado.
    expect(skeleton.style.backgroundImage).toContain('bano-thumb.jpg')
  })

  it('oculta el esqueleto cuando la imagen termina de cargar', () => {
    const { container } = render(
      <SceneViewer scene={sceneSingle} onNavigate={() => {}} />
    )
    const loader = container.querySelector('.viewer__loader')
    fireEvent.load(loader)
    expect(container.querySelector('.viewer__skeleton')).toHaveClass('is-loaded')
  })

  it('vuelve a mostrar el esqueleto al cambiar de habitación', () => {
    const { container, rerender } = render(
      <SceneViewer scene={sceneSingle} onNavigate={() => {}} />
    )
    fireEvent.load(container.querySelector('.viewer__loader'))
    expect(container.querySelector('.viewer__skeleton')).toHaveClass('is-loaded')

    rerender(<SceneViewer scene={sceneWithGallery} onNavigate={() => {}} />)
    expect(container.querySelector('.viewer__skeleton')).not.toHaveClass('is-loaded')
  })
})
