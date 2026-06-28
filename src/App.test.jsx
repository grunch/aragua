import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from './App.jsx'
import {
  scenes,
  getScene,
  nextScene,
  prevScene,
  DEFAULT_SCENE_ID,
} from './tour-data.js'

const def = getScene(DEFAULT_SCENE_ID)

describe('App', () => {
  it('arranca por defecto en la galería, mostrando 03.png', () => {
    render(<App />)
    expect(DEFAULT_SCENE_ID).toBe('galeria')
    const stage = screen.getByRole('img', { name: new RegExp(def.title) })
    expect(stage).toBeInTheDocument()
    expect(stage.style.backgroundImage).toContain('galeria/03.png')
  })

  it('avanza a la siguiente habitación con la flecha', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente habitación' }))
    expect(
      screen.getByRole('img', { name: new RegExp(nextScene(DEFAULT_SCENE_ID).title) })
    ).toBeInTheDocument()
  })

  it('retrocede de forma circular con la flecha', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Habitación anterior' }))
    expect(
      screen.getByRole('img', { name: new RegExp(prevScene(DEFAULT_SCENE_ID).title) })
    ).toBeInTheDocument()
  })

  it('navega con el teclado (flecha derecha)', () => {
    render(<App />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(
      screen.getByRole('img', { name: new RegExp(nextScene(DEFAULT_SCENE_ID).title) })
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
    const objetivo = scenes.find((s) => s.id !== DEFAULT_SCENE_ID)
    fireEvent.click(screen.getByText(objetivo.title))
    expect(
      screen.getByRole('img', { name: new RegExp(objetivo.title) })
    ).toBeInTheDocument()
  })
})
