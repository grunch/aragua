/**
 * Ficha del inmueble para el modo venta/alquiler: titular, precio, datos
 * destacados, descripción, lista de características y bloque de contacto.
 *
 * @param {{ property: object }} props
 */
export default function PropertyInfo({ property }) {
  const { contact } = property
  const waText = encodeURIComponent(
    `Hola, me interesa la casa "${property.title}". ¿Podría darme más información?`
  )
  const waHref = `https://wa.me/${contact.whatsapp}?text=${waText}`

  return (
    <section className="info" id="detalles" aria-labelledby="info-title">
      <div className="info__grid">
        <div className="info__main">
          <span className="badge">{property.type}</span>
          <h2 id="info-title" className="info__title">
            {property.title}
          </h2>
          <p className="info__location">{property.location}</p>
          <p className="info__price">{property.price}</p>

          <ul className="highlights" aria-label="Datos del inmueble">
            {property.highlights.map((h) => (
              <li key={h.label} className="highlight">
                <span className="highlight__value">{h.value}</span>
                <span className="highlight__label">{h.label}</span>
              </li>
            ))}
          </ul>

          <p className="info__description">{property.description}</p>

          <h3 className="info__subhead">Características</h3>
          <ul className="features">
            {property.features.map((f) => (
              <li key={f} className="feature">
                {f}
              </li>
            ))}
          </ul>
        </div>

        <aside className="contact" aria-labelledby="contact-title">
          <h3 id="contact-title" className="contact__title">
            ¿Te interesa? Contáctanos
          </h3>
          <p className="contact__name">{contact.name}</p>
          <div className="contact__actions">
            <a className="btn btn--whatsapp" href={waHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="btn btn--ghost" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
              Llamar {contact.phone}
            </a>
            <a className="btn btn--ghost" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </div>
          <p className="contact__note">
            * Datos de contacto y especificaciones son de ejemplo. Edítalos en
            <code> src/tour-data.js</code>.
          </p>
        </aside>
      </div>
    </section>
  )
}
