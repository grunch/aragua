import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PropertyInfo from './PropertyInfo.jsx'

const property = {
  type: 'En venta',
  price: '$1,000,000',
  title: 'Casa de prueba',
  location: 'Ciudad',
  highlights: [{ label: 'Recámaras', value: '2' }],
  description: 'Una casa bonita.',
  features: ['Jardín', 'Cocina equipada'],
  contact: {
    name: 'Ana',
    phone: '+52 55 1234 5678',
    whatsapp: '525512345678',
    email: 'ana@ejemplo.com',
  },
}

describe('PropertyInfo', () => {
  it('muestra titular, precio y ubicación', () => {
    render(<PropertyInfo property={property} />)
    expect(screen.getByText('Casa de prueba')).toBeInTheDocument()
    expect(screen.getByText('$1,000,000')).toBeInTheDocument()
    expect(screen.getByText('Ciudad')).toBeInTheDocument()
  })

  it('lista las características', () => {
    render(<PropertyInfo property={property} />)
    expect(screen.getByText('Jardín')).toBeInTheDocument()
    expect(screen.getByText('Cocina equipada')).toBeInTheDocument()
  })

  it('genera un enlace de WhatsApp con el número', () => {
    render(<PropertyInfo property={property} />)
    const wa = screen.getByRole('link', { name: 'WhatsApp' })
    expect(wa).toHaveAttribute('href', expect.stringContaining('wa.me/525512345678'))
  })

  it('genera enlaces tel y mailto', () => {
    render(<PropertyInfo property={property} />)
    expect(screen.getByText(/Llamar/).closest('a')).toHaveAttribute(
      'href',
      'tel:+525512345678'
    )
    expect(screen.getByText('ana@ejemplo.com').closest('a')).toHaveAttribute(
      'href',
      'mailto:ana@ejemplo.com'
    )
  })
})
