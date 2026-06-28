/**
 * Indicador de progreso del recorrido: barra accesible + texto "Espacio X de N".
 *
 * @param {{ index: number, total: number }} props  `index` es 0-based.
 */
export default function TourProgress({ index, total }) {
  if (!total || total < 1) return null

  const safeIndex = Math.max(0, Math.min(index, total - 1))
  const current = safeIndex + 1
  const pct = Math.round((current / total) * 100)

  return (
    <div className="tour-progress">
      <div
        className="tour-progress__bar"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Espacio ${current} de ${total}`}
      >
        <span className="tour-progress__fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="tour-progress__label">
        Espacio {current} de {total}
      </p>
    </div>
  )
}
