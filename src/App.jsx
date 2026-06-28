import { useCallback, useEffect, useState } from 'react'
import {
  scenes,
  property,
  getScene,
  nextScene,
  prevScene,
  DEFAULT_SCENE_ID,
} from './tour-data.js'
import SceneViewer from './components/SceneViewer.jsx'
import RoomMenu from './components/RoomMenu.jsx'
import PropertyInfo from './components/PropertyInfo.jsx'
import LocationMap from './components/LocationMap.jsx'
import FloorPlan from './components/FloorPlan.jsx'
import ShareBar from './components/ShareBar.jsx'

export default function App() {
  const [currentId, setCurrentId] = useState(DEFAULT_SCENE_ID)
  const [showVideo, setShowVideo] = useState(false)
  const scene = getScene(currentId)

  const goTo = useCallback((id) => {
    if (getScene(id)) setCurrentId(id)
  }, [])

  const goNext = useCallback(() => setCurrentId((id) => nextScene(id).id), [])
  const goPrev = useCallback(() => setCurrentId((id) => prevScene(id).id), [])

  // Navegación con teclado en el recorrido.
  useEffect(() => {
    function onKey(e) {
      if (showVideo) {
        if (e.key === 'Escape') setShowVideo(false)
        return
      }
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, showVideo])

  // Precarga sólo las portadas de las habitaciones vecinas (las imágenes son de
  // alta resolución; no conviene precargarlas todas).
  useEffect(() => {
    const vecinas = [prevScene(currentId), nextScene(currentId)].filter(Boolean)
    vecinas.forEach((s) => {
      const img = new Image()
      img.src = s.images[0]
    })
  }, [currentId])

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__dot" aria-hidden="true" />
          Tour Virtual
        </div>
        <div className="topbar__meta">
          <span className="badge badge--sm">{property.type}</span>
          <span className="topbar__price">{property.price}</span>
        </div>
      </header>

      <main>
        <section className="hero" aria-label="Recorrido virtual">
          <div className="hero__viewer">
            <SceneViewer scene={scene} onNavigate={goTo} />

            <button
              type="button"
              className="nav-arrow nav-arrow--prev"
              onClick={goPrev}
              aria-label="Habitación anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="nav-arrow nav-arrow--next"
              onClick={goNext}
              aria-label="Siguiente habitación"
            >
              ›
            </button>

            <button
              type="button"
              className="video-cta"
              onClick={() => setShowVideo(true)}
            >
              ▶ Ver recorrido en video
            </button>
          </div>

          <RoomMenu scenes={scenes} currentId={currentId} onSelect={goTo} />
        </section>

        <FloorPlan scenes={scenes} currentId={currentId} onSelect={goTo} />

        <PropertyInfo property={property} />

        <ShareBar title={property.title} price={property.price} />

        <LocationMap
          lat={property.coords.lat}
          lng={property.coords.lng}
          title={property.title}
        />
      </main>

      <footer className="footer">
        <p>
          Tour virtual generado a partir del video de la casa · {scenes.length}{' '}
          espacios.
        </p>
        <a className="footer__link" href="#detalles">
          Ver detalles del inmueble
        </a>
      </footer>

      {showVideo && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="Video del recorrido"
          onClick={() => setShowVideo(false)}
        >
          <div className="modal__body" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal__close"
              onClick={() => setShowVideo(false)}
              aria-label="Cerrar video"
            >
              ✕
            </button>
            <video className="modal__video" src={property.video} controls autoPlay>
              Tu navegador no soporta video HTML5.
            </video>
          </div>
        </div>
      )}
    </div>
  )
}
