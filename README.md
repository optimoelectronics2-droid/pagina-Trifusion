# Trifusion Technologies — sitio web

Sitio estático: HTML + CSS + JavaScript sin dependencias. **Abre con doble clic en `index.html`** (no necesita servidor).

## Estructura

```
trifusion/
├── index.html              Página final (generada, no se edita a mano)
├── src/index.template.html Plantilla de la página (aquí se edita el texto/estructura)
├── tools/build.py          Genera index.html desde la plantilla + data/*.json
├── data/
│   ├── site.json           WhatsApp, teléfono, Instagram, horarios, portada, reseñas
│   ├── categories.json     Tarjetas de "Nuestros productos"
│   └── products.json       Carrusel de novedades
├── css/                    tokens, base, layout, components, motion + sections/
├── js/                     hero, carousel, reveal, hours, reviews (opcionales)
└── assets/img/             logo, portada, mapa y fotos de productos
```

## Tareas comunes

Después de cualquier cambio en `data/` o `src/`, ejecuta:

```
python3 tools/build.py        # requiere Pillow: pip install pillow
```

- **Agregar un producto:** copia la foto a `assets/img/products/` y añade una entrada en `data/products.json`.
  Si la foto tiene fondo blanco propio, agrega `"blend": true` y no hace falta recortarla.
- **Cambiar teléfono, WhatsApp u horarios:** `data/site.json`.
- **Cambiar colores:** `css/tokens.css`.
- **Reseñas en vivo:** crea la función `/.netlify/functions/reviews` que devuelva `{ "rating": 4.5, "count": 2 }`.
  Sin ella se muestra el valor de `site.json`.

## Notas de rendimiento

- Sin scroll bloqueado, sin intro, sin canvas ni WebGL, sin `backdrop-filter`.
- El carrusel usa `scroll-snap` nativo: se desliza con el dedo, la rueda o las flechas.
- Si el JavaScript falla, todo el contenido sigue visible.
