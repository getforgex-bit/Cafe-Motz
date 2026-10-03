# MOTZ CAFÉ

Sitio de una sola página para MOTZ CAFÉ (Motozintla de Mendoza, Chiapas): prólogo cinematográfico con scroll, carta, combos, programa de lealtad y pedidos por WhatsApp.

React 19 + Vite 8 + Tailwind v4 + `motion`. Es un sitio 100% estático (sin backend): el carrito vive en `localStorage` y el "pedido" es un enlace a WhatsApp.

## Desarrollo local

Requisitos: Node.js 22.12 o superior.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # verificación de tipos (tsc --noEmit)
npm run build      # build de producción en ./dist
```

## Despliegue en Cloudflare

El build (`./dist`) se sirve como assets estáticos. La configuración está en `wrangler.jsonc` (incluye `build.command`, así que `npx wrangler deploy` compila solo) y las cabeceras HTTP (seguridad y caché) en `public/_headers`.

**Despliegue por defecto** (recomendado): **Workers & Pages → Create → Import a repository** → este repositorio → **Deploy**, sin cambiar nada (nombre `cafe-motz`, build command vacío, deploy command `npx wrangler deploy`). Cada push a `main` publica.

Desde la terminal:

```bash
npx wrangler login     # una sola vez
npm run deploy         # compila con Vite y publica
```

Para probar localmente con el runtime de Cloudflare: `npm run cf:dev` (http://localhost:8787).

Queda en `https://cafe-motz.<tu-cuenta>.workers.dev`. Usa Workers y no Pages: en la misma cuenta que Scan-bar, la página lo encuentra sola y Scan-bar sabe a qué URL mandar sus códigos. Pasos de todo el sistema: `docs/DESPLIEGUE.md` en el repositorio Scan-bar.

### Límite de tamaño de archivos

Cloudflare limita cada asset estático a 25 MiB. Hoy el más grande es `public/videos/sierra-madre.mp4` (~5.4 MiB); cualquier video nuevo o reemplazo debe quedarse por debajo de ese límite (o alojarse en R2 / Cloudflare Stream).

## Scan-bar (catálogo y códigos)

Scan-bar es la base de datos de productos y códigos de barras de los negocios (`src/lib/scanbar.ts`):

- El menú de `src/data/coffeeData.ts` se registra solo en Scan-bar (Scan-bar revisa este repositorio cada 10 minutos; `npm run sync:repos` allá lo fuerza): cada tamaño es un producto con su código (`americano-ch`, `americano-gde`), y la leche y los extras de `MODIFICADORES` también.
- **Cada bebida configurada** (tamaño + leche + extras) recibe su código al agregarse al pedido: se ve en el pedido con su código de barras y viaja en el mensaje de WhatsApp para cobrarla en caja escaneándolo.
- Los productos agregados desde Scan-bar (*Administración → Productos y etiquetas*) aparecen en el menú: categoría = pestaña (`calientes`, `frios`, `comida`, `postres`), hasta dos variantes (chico, grande).
- Conexión: automática si la página vive en `cafe-motz.<tu-cuenta>.workers.dev` (usa `scan-bar.<tu-cuenta>.workers.dev`). En otro dominio: `VITE_SCANBAR_URL=https://URL-DE-SCAN-BAR` al compilar (en Cloudflare, variable de build); `VITE_SCANBAR_URL=off` la apaga.
- Probar en local: Scan-bar en otro puerto (`PORT=3001 npm start` allá), `npm run dev` aquí y abrir `http://localhost:3000/?scanbar=http://localhost:3001` (solo acepta localhost).
- Contrato y diseño completo: `docs/INTEGRACION-WEBS.md` en el repositorio Scan-bar.
