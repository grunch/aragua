import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ShareBar from './ShareBar.jsx'

const baseProps = {
  title: 'Casa amplia',
  price: '$1,000,000',
  url: 'https://casa.example/anuncio',
}

afterEach(() => {
  // Limpiar APIs simuladas entre tests.
  delete navigator.share
  delete navigator.clipboard
})

describe('ShareBar', () => {
  it('genera un enlace de WhatsApp con el texto y la url', () => {
    render(<ShareBar {...baseProps} />)
    const wa = screen.getByRole('link', { name: /WhatsApp/ })
    const href = decodeURIComponent(wa.getAttribute('href'))
    expect(href).toContain('wa.me/?text=')
    expect(href).toContain('Casa amplia — $1,000,000')
    expect(href).toContain('https://casa.example/anuncio')
  })

  it('copia el enlace al portapapeles y muestra confirmación', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    navigator.clipboard = { writeText }
    render(<ShareBar {...baseProps} />)

    fireEvent.click(screen.getByRole('button', { name: /Copiar enlace/ }))

    expect(writeText).toHaveBeenCalledWith('https://casa.example/anuncio')
    expect(await screen.findByText(/Copiado/)).toBeInTheDocument()
  })

  it('oculta el botón de compartir nativo si el dispositivo no lo soporta', () => {
    render(<ShareBar {...baseProps} />)
    expect(screen.queryByRole('button', { name: 'Compartir' })).not.toBeInTheDocument()
  })

  it('usa la API de compartir nativa cuando está disponible', () => {
    const share = vi.fn().mockResolvedValue(undefined)
    navigator.share = share
    render(<ShareBar {...baseProps} />)

    fireEvent.click(screen.getByRole('button', { name: 'Compartir' }))
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Casa amplia', url: 'https://casa.example/anuncio' })
    )
  })
})
