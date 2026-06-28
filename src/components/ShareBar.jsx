import { useState } from 'react'

// Tiempo que se muestra el mensaje "¡Copiado!" tras copiar el enlace.
const COPIED_FEEDBACK_MS = 2000

/**
 * Barra para compartir el anuncio: compartir nativo (si el dispositivo lo
 * soporta), copiar el enlace al portapapeles y compartir por WhatsApp.
 *
 * El `url` por defecto es la dirección actual de la página; se puede inyectar
 * (p. ej. en tests) para no depender de `window.location`.
 *
 * @param {{ title: string, price?: string, url?: string }} props
 */
export default function ShareBar({ title, price, url }) {
  const [copied, setCopied] = useState(false)

  const shareUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = price ? `${title} — ${price}` : title
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  const waHref = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`

  async function handleNativeShare() {
    try {
      await navigator.share({ title, text: shareText, url: shareUrl })
    } catch {
      /* El usuario canceló el diálogo o no se pudo compartir: sin acción. */
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="share" aria-labelledby="share-title">
      <h2 id="share-title" className="share__title">
        Compartir este inmueble
      </h2>
      <div className="share__actions">
        {canNativeShare && (
          <button type="button" className="btn btn--ghost" onClick={handleNativeShare}>
            Compartir
          </button>
        )}
        <a
          className="btn btn--whatsapp"
          href={waHref}
          target="_blank"
          rel="noreferrer"
        >
          Compartir por WhatsApp
        </a>
        <button type="button" className="btn btn--ghost" onClick={handleCopy}>
          {copied ? '¡Copiado!' : 'Copiar enlace'}
        </button>
      </div>
    </section>
  )
}
