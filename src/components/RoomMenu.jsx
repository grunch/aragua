/**
 * Tira de miniaturas para saltar directamente a cualquier habitación.
 *
 * @param {{ scenes: object[], currentId: string, onSelect: (id: string) => void }} props
 */
export default function RoomMenu({ scenes, currentId, onSelect }) {
  return (
    <nav className="room-menu" aria-label="Habitaciones">
      <ul className="room-menu__list">
        {scenes.map((scene) => (
          <li key={scene.id}>
            <button
              type="button"
              className={`room-thumb ${scene.id === currentId ? 'is-active' : ''}`}
              onClick={() => onSelect(scene.id)}
              aria-current={scene.id === currentId ? 'true' : undefined}
            >
              <img
                className="room-thumb__img"
                src={scene.thumb || scene.images[0]}
                alt=""
                loading="lazy"
                width="160"
                height="90"
              />
              <span className="room-thumb__label">{scene.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
