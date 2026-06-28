import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from './App.jsx'
import { scenes } from './tour-data.js'

describe('App', () => {
  it('arranca en la primera habitación', () => {
    render(<App />)
    // El título de la escena aparece en el rótulo del visor.
    expect(
      screen.getByRole('img', { name: new RegExp(scenes[0].title) })
    ).toBeInTheDocument()
  })

  it('avanza a la siguiente habitación con la flecha', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente habitación' }))
    expect(
      screen.getByRole('img', { name: new RegExp(scenes[1].title) })
    ).toBeInTheDocument()
  })

  it('retrocede de forma circular a la última habitación', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Habitación anterior' }))
    const last = scenes[scenes.length - 1].title
    expect(screen.getByRole('img', { name: new RegExp(last) })).toBeInTheDocument()
  })

  it('navega con el teclado (flecha derecha)', () => {
    render(<App />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(
      screen.getByRole('img', { name: new RegExp(scenes[1].title) })
    ).toBeInTheDocument()
  })

  it('abre y cierra el modal de video', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Ver recorrido en video/ }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cerrar video' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('salta a una habitación desde el menú de miniaturas', () => {
    render(<App />)
    const objetivo = scenes[3]
    fireEvent.click(screen.getByText(objetivo.title))
    expect(
      screen.getByRole('img', { name: new RegExp(objetivo.title) })
    ).toBeInTheDocument()
  })
})
