import { useEffect, useState } from 'react'

/**
 * Visor principal de una habitación: imagen de fondo, hotspots de navegación
 * superpuestos y, si la escena tiene varias fotos, controles de galería.
 *
 * @param {{ scene: object, onNavigate: (id: string) => void }} props
 */
export default function SceneViewer({ scene, onNavigate }) {
  const [imageIndex, setImageIndex] = useState(scene.startIndex ?? 0)

  // Al cambiar de habitación, mostrar su imagen inicial (cover o la primera).
  useEffect(() => {
    setImageIndex(scene.startIndex ?? 0)
  }, [scene.id, scene.startIndex])

  const images = scene.images
  const hasGallery = images.length > 1
  const currentImage = images[imageIndex]

  function showImage(nextIndex) {
    const total = images.length
    setImageIndex((nextIndex + total) % total)
  }

  return (
    <div className="viewer">
      <div
        className="viewer__stage"
        style={{ backgroundImage: `url(${currentImage})` }}
        role="img"
        aria-label={`${scene.title}. ${scene.subtitle}`}
      >
        {/* Hotspots de navegación entre habitaciones */}
        {scene.hotspots.map((h) => (
          <button
            key={h.to}
            type="button"
            className="hotspot"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            onClick={() => onNavigate(h.to)}
            aria-label={h.label}
            title={h.label}
          >
            <span className="hotspot__pulse" aria-hidden="true" />
            <span className="hotspot__label">{h.label}</span>
          </button>
        ))}

        {/* Controles de galería dentro de la habitación */}
        {hasGallery && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-arrow--prev"
              onClick={() => showImage(imageIndex - 1)}
              aria-label="Foto anterior de la habitación"
            >
              ‹
            </button>
            <button
              type="button"
              className="gallery-arrow gallery-arrow--next"
              onClick={() => showImage(imageIndex + 1)}
              aria-label="Siguiente foto de la habitación"
            >
              ›
            </button>
            <div className="gallery-dots" role="tablist" aria-label="Fotos de la habitación">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  className={`gallery-dot ${i === imageIndex ? 'is-active' : ''}`}
                  onClick={() => showImage(i)}
                  aria-label={`Foto ${i + 1} de ${images.length}`}
                  aria-selected={i === imageIndex}
                  role="tab"
                />
              ))}
            </div>
          </>
        )}

        {/* Rótulo de la habitación */}
        <div className="viewer__caption">
          <h2 className="viewer__title">{scene.title}</h2>
          <p className="viewer__subtitle">{scene.subtitle}</p>
        </div>
      </div>
    </div>
  )
}
