import { FLOORPLAN } from '../tour-data.js'

/**
 * Plano interactivo de la casa.
 *
 * Dibuja cada espacio como un bloque clicable posicionado sobre una grilla
 * (las coordenadas `plan` de cada escena se convierten a porcentajes), resalta
 * la habitación actual ("estás aquí") y permite saltar a cualquier otra. Sólo
 * se muestran las escenas que definen un `plan`, de modo que se mantiene
 * coherente con el resto del sitio cuando una escena aún no tiene fotos.
 *
 * @param {{
 *   scenes: object[],
 *   currentId: string,
 *   onSelect: (id: string) => void,
 *   grid?: { width: number, height: number },
 * }} props
 */
export default function FloorPlan({ scenes, currentId, onSelect, grid = FLOORPLAN }) {
  const rooms = scenes.filter((scene) => scene.plan)
  if (rooms.length === 0) return null

  return (
    <section className="floorplan" id="plano" aria-labelledby="floorplan-title">
      <h2 id="floorplan-title" className="floorplan__title">
        Plano de la casa
      </h2>
      <p className="floorplan__hint">Tocá un espacio para ir directamente a él.</p>

      <div
        className="floorplan__grid"
        style={{ aspectRatio: `${grid.width} / ${grid.height}` }}
        role="group"
        aria-label="Plano interactivo de la casa"
      >
        {rooms.map((scene) => {
          const isActive = scene.id === currentId
          const { x, y, w, h } = scene.plan
          return (
            <button
              key={scene.id}
              type="button"
              className={`floorplan__room ${isActive ? 'is-active' : ''}`}
              style={{
                left: `${(x / grid.width) * 100}%`,
                top: `${(y / grid.height) * 100}%`,
                width: `${(w / grid.width) * 100}%`,
                height: `${(h / grid.height) * 100}%`,
              }}
              onClick={() => onSelect(scene.id)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={isActive ? `${scene.title} (estás aquí)` : `Ir a ${scene.title}`}
            >
              <span className="floorplan__room-name">{scene.title}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
