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

El build (`./dist`) se sirve como assets estáticos. La configuración está en `wrangler.jsonc` y las cabeceras HTTP (seguridad y caché) en `public/_headers`.

### Opción A: Cloudflare Workers (recomendada)

```bash
npx wrangler login     # una sola vez
npm run deploy         # build + wrangler deploy
```

Para probar localmente con el runtime de Cloudflare: `npm run cf:dev` (http://localhost:8787).

También puedes conectar este repositorio en **Workers & Pages → Create → Import a repository**, con:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

### Opción B: Cloudflare Pages

En **Workers & Pages → Create → Pages → Connect to Git**, selecciona este repositorio y usa:

- Framework preset: `None` (o `Vite`)
- Build command: `npm run build`
- Build output directory: `dist`
- Variable de entorno (opcional): `NODE_VERSION=22`

Pages sirve el sitio como SPA automáticamente y respeta `public/_headers`.

### Límite de tamaño de archivos

Cloudflare limita cada asset estático a 25 MiB. `public/videos/sierra-verde-mesa.mp4` pesa ~23.9 MiB, así que cualquier video nuevo o reemplazo debe quedarse por debajo de ese límite (o alojarse en R2 / Cloudflare Stream).
