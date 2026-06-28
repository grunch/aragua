# Tour Virtual · Casa

Sitio web de **tour virtual por escenas** para recorrer la casa habitación por
habitación. Las imágenes se extrajeron y mejoraron automáticamente a partir del
video `casa.mp4`.

## ¿Qué incluye?

- **Recorrido interactivo** con _hotspots_ que conectan las habitaciones
  (sala → comedor → recámaras → cocina → terraza).
- **Galería** por habitación (varias fotos donde el video lo permitió).
- **Navegación** por flechas, miniaturas y teclado (← →).
- **Video original** del recorrido en un modal ("Ver recorrido en video").
- **Ficha del inmueble** (modo venta/alquiler) con características y contacto
  por WhatsApp / teléfono / email.

## Stack

- React 18 + Vite (sitio estático, sin servidor)
- Vitest + Testing Library (pruebas)

## Cómo correrlo

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # genera /dist listo para publicar
npm run preview  # previsualiza el build
npm test         # pruebas
npm run coverage # cobertura
```

## Publicar

El build (`/dist`) es estático: súbelo a Vercel, Netlify o GitHub Pages.
`base: './'` en `vite.config.js` permite servirlo desde cualquier subruta.

> El video pesa ~33 MB y se incluye en `/public`. Si no quieres distribuirlo,
> elimina `public/casa.mp4` y el botón "Ver recorrido en video" en `src/App.jsx`.

## Imágenes y escenas

Las imágenes viven en `public/scenes/<escena>/`, **una carpeta por habitación**
(el nombre de la carpeta es el `id` de la escena). El flujo es:

```bash
npm run scenes   # escanea public/scenes/, genera miniaturas (_thumb.jpg)
                 # y reescribe src/scenes-manifest.json
```

`src/tour-data.js` combina ese manifiesto con los metadatos (título, subtítulo,
hotspots) de cada escena. **Las escenas sin fotos se omiten solas** hasta que se
agreguen imágenes y se vuelva a correr `npm run scenes`.

### Agregar las que faltan (cuarto-3, cuarto-4)

1. Copia las fotos en `public/scenes/cuarto-3/` y `public/scenes/cuarto-4/`.
2. Ejecuta `npm run scenes`.
3. Listo: aparecen en el tour (los metadatos ya están definidos en
   `src/tour-data.js`).

## Personalizar

- **Datos del inmueble** (precio, ubicación, m², contacto): `src/tour-data.js`
  → objeto `property`. Los campos marcados con `// EDITAR` son placeholders.
- **Orden, títulos y hotspots** de las habitaciones: `src/tour-data.js`
  → arreglo `SCENE_META`.

## Notas

- Las fotos son de alta resolución; el visor principal las muestra a tamaño
  completo y la tira de habitaciones usa miniaturas livianas (`_thumb.jpg`) para
  cargar rápido.
- **No es un tour 360°**: las fotos no son esféricas. Para un tour panorámico
  arrastrable haría falta material grabado en 360°.
- `cuarto-3` y `cuarto-4` están pendientes de fotos en buena calidad.
