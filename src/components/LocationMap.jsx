/**
 * Sección de ubicación: muestra la casa en Google Maps mediante un iframe
 * embebido (no requiere API key) y un enlace para abrir el mapa completo.
 *
 * @param {{ lat: number, lng: number, title?: string }} props
 */
export default function LocationMap({ lat, lng, title = 'Ubicación' }) {
  const query = `${lat},${lng}`
  const embedSrc = `https://maps.google.com/maps?q=${query}&z=16&output=embed`
  const linkHref = `https://www.google.com/maps/search/?api=1&query=${query}`

  return (
    <section className="location" id="ubicacion" aria-labelledby="location-title">
      <h2 id="location-title" className="location__title">
        Ubicación
      </h2>
      <p className="location__coords">
        {lat}, {lng}
      </p>
      <div className="location__map">
        <iframe
          title={`Mapa de ${title}`}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        className="btn btn--ghost location__link"
        href={linkHref}
        target="_blank"
        rel="noreferrer"
      >
        Abrir en Google Maps
      </a>
    </section>
  )
}
