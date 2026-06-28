import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from './ThemeToggle.jsx'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('ThemeToggle', () => {
  it('aplica el tema oscuro por defecto', () => {
    render(<ThemeToggle />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('alterna a claro al hacer clic y actualiza la etiqueta accesible', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button', { name: /modo claro/i })
    fireEvent.click(btn)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(screen.getByRole('button', { name: /modo oscuro/i })).toBeInTheDocument()
  })

  it('persiste la elección en localStorage', () => {
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: /modo claro/i }))
    expect(localStorage.getItem('mi-casa-theme')).toBe('light')
  })

  it('respeta el tema guardado al montar', () => {
    localStorage.setItem('mi-casa-theme', 'light')
    render(<ThemeToggle />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(screen.getByRole('button', { name: /modo oscuro/i })).toBeInTheDocument()
  })
})
