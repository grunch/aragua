import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TourProgress from './TourProgress.jsx'

describe('TourProgress', () => {
  it('muestra "Espacio X de N" (índice 0-based)', () => {
    render(<TourProgress index={2} total={9} />)
    expect(screen.getByText('Espacio 3 de 9')).toBeInTheDocument()
  })

  it('expone una barra de progreso accesible', () => {
    render(<TourProgress index={2} total={9} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '3')
    expect(bar).toHaveAttribute('aria-valuemin', '1')
    expect(bar).toHaveAttribute('aria-valuemax', '9')
  })

  it('rellena la barra según el porcentaje recorrido', () => {
    const { container } = render(<TourProgress index={2} total={9} />)
    const fill = container.querySelector('.tour-progress__fill')
    expect(fill.style.width).toBe('33%')
  })

  it('limita el índice al rango válido', () => {
    render(<TourProgress index={20} total={5} />)
    expect(screen.getByText('Espacio 5 de 5')).toBeInTheDocument()
  })

  it('no renderiza nada si no hay espacios', () => {
    const { container } = render(<TourProgress index={0} total={0} />)
    expect(container).toBeEmptyDOMElement()
  })
})
