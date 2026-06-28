/**
 * Datos del tour virtual.
 *
 * Las imágenes ya no se hardcodean: provienen de `scenes-manifest.json`, que se
 * genera con `npm run scenes` a partir de los subdirectorios de public/scenes/
 * (el nombre de cada carpeta es el id de la escena).
 *
 * Aquí sólo definimos los METADATOS de cada escena (título, subtítulo, orden y
 * hotspots de navegación) y la ficha del inmueble. Las escenas sin imágenes
 * todavía (p. ej. cuarto-3 y cuarto-4) se omiten automáticamente hasta que se
 * agreguen fotos y se regenere el manifiesto.
 *
 * NOTA: los campos con `// EDITAR` son placeholders (precio, contacto, m²...).
 */
import manifest from './scenes-manifest.json'

// Orden del recorrido + metadatos. Los hotspots `x`,`y` van en % sobre la foto.
const SCENE_META = [
  {
    id: 'living',
    title: 'Living',
    subtitle: 'Sala principal con sofá y grandes ventanales al jardín',
    hotspots: [{ to: 'galeria', label: 'Ir a la galería', x: 20, y: 55 }],
  },
  {
    id: 'galeria',
    title: 'Galería',
    subtitle: 'Galería-comedor con vitral, ventanales y vista al jardín',
    hotspots: [
      { to: 'living', label: 'Volver al living', x: 12, y: 60 },
      { to: 'cocina', label: 'Ir a la cocina', x: 60, y: 40 },
      { to: 'cuarto-1', label: 'Cuartos', x: 42, y: 38 },
      { to: 'jardin-central', label: 'Salir al jardín', x: 88, y: 55 },
    ],
  },
  {
    id: 'cocina',
    title: 'Cocina',
    subtitle: 'Equipada con estufa de gas, horno y microondas',
    hotspots: [
      { to: 'galeria', label: 'Volver a la galería', x: 15, y: 35 },
      { to: 'lavadero', label: 'Ir al lavadero', x: 82, y: 55 },
    ],
  },
  {
    id: 'lavadero',
    title: 'Lavadero',
    subtitle: 'Área de lavado con lavarropas y espacio de servicio',
    hotspots: [{ to: 'cocina', label: 'Volver a la cocina', x: 70, y: 40 }],
  },
  {
    id: 'cuarto-1',
    title: 'Cuarto 1 · Estudio',
    subtitle: 'Habitación con estantería y biblioteca',
    hotspots: [
      { to: 'galeria', label: 'Volver a la galería', x: 12, y: 45 },
      { to: 'cuarto-2', label: 'Cuarto 2', x: 80, y: 50 },
    ],
  },
  {
    id: 'cuarto-2',
    title: 'Cuarto 2 · Recámara',
    subtitle: 'Habitación con clóset amplio y buena luz natural',
    hotspots: [
      { to: 'cuarto-1', label: 'Cuarto 1', x: 18, y: 40 },
      { to: 'cuarto-3', label: 'Cuarto 3', x: 55, y: 45 },
      { to: 'galeria', label: 'Volver a la galería', x: 85, y: 40 },
    ],
  },
  {
    id: 'cuarto-3',
    title: 'Cuarto 3',
    subtitle: 'Próximamente: fotos en alta calidad',
    hotspots: [
      { to: 'cuarto-2', label: 'Cuarto 2', x: 20, y: 45 },
      { to: 'cuarto-4', label: 'Cuarto 4', x: 75, y: 45 },
    ],
  },
  {
    id: 'cuarto-4',
    title: 'Cuarto 4',
    subtitle: 'Próximamente: fotos en alta calidad',
    hotspots: [{ to: 'cuarto-3', label: 'Cuarto 3', x: 25, y: 45 }],
  },
  {
    id: 'sala-jardin',
    title: 'Sala jardín',
    subtitle: 'Patio cubierto con piso de loseta, junto al jardín',
    hotspots: [{ to: 'jardin-central', label: 'Ir al jardín', x: 80, y: 55 }],
  },
  {
    id: 'jardin-central',
    title: 'Jardín central',
    subtitle: 'Patio jardín con cantero, plantas y mucho sol',
    hotspots: [
      { to: 'sala-jardin', label: 'Sala jardín', x: 15, y: 50 },
      { to: 'galeria', label: 'Volver a la galería', x: 82, y: 35 },
    ],
  },
]

// Combina metadatos + manifiesto y descarta escenas sin imágenes todavía.
const withImages = SCENE_META.map((meta) => {
  const entry = manifest[meta.id] || { images: [], thumb: null }
  return {
    ...meta,
    images: entry.images,
    thumb: entry.thumb || entry.images[0] || null,
  }
}).filter((scene) => scene.images.length > 0)

// Evita hotspots "muertos" hacia escenas que aún no tienen fotos.
const activeIds = new Set(withImages.map((s) => s.id))

export const scenes = withImages.map((scene) => ({
  ...scene,
  hotspots: scene.hotspots.filter((h) => activeIds.has(h.to)),
}))

export const property = {
  type: 'En venta', // EDITAR: "En venta" o "En renta"
  price: 'Precio a consultar', // EDITAR: p. ej. "$2,450,000 MXN"
  title: 'Casa amplia con galería y jardín',
  location: 'Ubicación por confirmar', // EDITAR: colonia, ciudad
  highlights: [
    { label: 'Cuartos', value: '4' }, // EDITAR
    { label: 'Baños', value: '1' }, // EDITAR
    { label: 'Construcción', value: '— m²' }, // EDITAR
    { label: 'Terreno', value: '— m²' }, // EDITAR
  ],
  description:
    'Casa de generosas proporciones con una característica galería-comedor ' +
    'iluminada por grandes ventanales y un vitral decorativo. Pisos de loseta ' +
    'en tono terracota, cuartos amplios, cocina equipada con estufa de gas y ' +
    'jardín central soleado. Mucha luz natural durante todo el día.',
  features: [
    'Galería-comedor con vitral y ventanales',
    'Pisos de loseta de barro (terracota)',
    'Cocina equipada (estufa de gas, horno, microondas)',
    'Varios cuartos amplios',
    'Lavadero independiente',
    'Sala jardín / patio cubierto',
    'Jardín central soleado',
    'Abundante luz natural',
  ],
  contact: {
    name: 'Nombre del anunciante', // EDITAR
    phone: '+52 000 000 0000', // EDITAR
    whatsapp: '5210000000000', // EDITAR: formato internacional sin "+"
    email: 'contacto@ejemplo.com', // EDITAR
  },
  // Video original del recorrido (se copia a /public en el build).
  video: 'casa.mp4',
}

/** Devuelve la escena por id, o undefined si no existe. */
export function getScene(id) {
  return scenes.find((s) => s.id === id)
}

/** Índice de la escena en el recorrido (para prev/next). */
export function getSceneIndex(id) {
  return scenes.findIndex((s) => s.id === id)
}

/** Escena siguiente en el recorrido lineal (circular). */
export function nextScene(id) {
  const i = getSceneIndex(id)
  if (i === -1) return undefined
  return scenes[(i + 1) % scenes.length]
}

/** Escena anterior en el recorrido lineal (circular). */
export function prevScene(id) {
  const i = getSceneIndex(id)
  if (i === -1) return undefined
  return scenes[(i - 1 + scenes.length) % scenes.length]
}
