// Integración con Scan-bar (contrato: docs/INTEGRACION-WEBS.md del repositorio Scan-bar).
// 1) Productos que se agregaron desde Scan-bar → se suman al menú.
// 2) Cada bebida configurada (tamaño + leche + extras) recibe su código EAN-13/QR para cobrarla en caja.
// Fuera de workers.dev y sin VITE_SCANBAR_URL (o si Scan-bar no responde) la página funciona exactamente igual que siempre.
import { useEffect, useState } from 'react';
import { MENU_ITEMS, MODIFICADORES } from '../data/coffeeData';
import type { CartItem, MenuItem, ProductCategory } from '../types';

const TIENDA = 'cafe-motz';

/**
 * URL de Scan-bar: VITE_SCANBAR_URL al compilar ("off" la apaga). Sin ella, en <web>.<cuenta>.workers.dev se usa
 * scan-bar.<cuenta>.workers.dev (misma cuenta de Cloudflare). Para pruebas, ?scanbar=http://localhost:3000 (solo localhost).
 */
function resolverUrl(): string {
  let url = String(import.meta.env.VITE_SCANBAR_URL ?? '').trim();
  const cuenta = /^[a-z0-9-]+\.([a-z0-9-]+\.workers\.dev)$/i.exec(window.location.hostname);
  if (!url && cuenta) url = `https://scan-bar.${cuenta[1]}`;
  if (url === 'off') url = '';
  try {
    const q = new URLSearchParams(window.location.search).get('scanbar');
    if (q !== null) { if (q) sessionStorage.setItem('scanbar:url', q); else sessionStorage.removeItem('scanbar:url'); }
    const local = sessionStorage.getItem('scanbar:url');
    if (local && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(local)) url = local;
  } catch { /* sin sessionStorage */ }
  return /^https?:\/\//.test(url) ? url.replace(/\/+$/, '') : '';
}
export const SCANBAR_URL = typeof window === 'undefined' ? '' : resolverUrl();

export const formatearGtin = (g: string) => `${g[0]} ${g.slice(1, 7)} ${g.slice(7)}`;

type Variante = { sku: string; label: string | null; priceCents: number; inStock: boolean };
type ProductoScanbar = { sku: string; name: string; category: string; description: string; imageUrl: string | null; attrs: Record<string, unknown>; variants: Variante[] };

const CATEGORIAS: ProductCategory[] = ['calientes', 'frios', 'comida', 'postres'];
const SKU = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const urlSegura = (u: unknown) => { try { const x = new URL(String(u)); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };

/** Producto de Scan-bar → platillo del menú. Categoría = pestaña del menú; hasta dos variantes = chico y grande. */
function aMenuItem(p: ProductoScanbar): MenuItem | null {
  const cat = p.category as ProductCategory;
  const [chico, grande] = p.variants ?? [];
  if (!CATEGORIAS.includes(cat) || !SKU.test(p.sku) || !chico || ![chico, grande].every(v => !v || (SKU.test(v.sku) && Number.isInteger(v.priceCents)))) return null;
  if (MENU_ITEMS.some(m => m.id === p.sku)) return null;
  return {
    id: p.sku, name: String(p.name), category: cat, description: String(p.description ?? ''),
    priceSmall: chico.priceCents / 100, sizeSmallLabel: chico.label ?? undefined,
    ...(grande ? { priceLarge: grande.priceCents / 100, sizeLargeLabel: grande.label ?? undefined } : {}),
    image: urlSegura(p.imageUrl) || MENU_ITEMS.find(m => m.category === cat)!.image,
    badge: 'Nuevo', skus: { small: chico.sku, large: grande?.sku },
  };
}

const CLAVE = `scanbar:catalogo:${TIENDA}`;
/** Menú extra desde Scan-bar: muestra la copia guardada al instante y la actualiza en cuanto responde. */
export function useMenuScanbar(): MenuItem[] {
  const [extras, setExtras] = useState<ProductoScanbar[]>(() => {
    if (!SCANBAR_URL) return [];
    try { const c = JSON.parse(localStorage.getItem(CLAVE) ?? '[]'); return Array.isArray(c) ? c : []; } catch { return []; }
  });
  useEffect(() => {
    if (!SCANBAR_URL) return;
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
    fetch(`${SCANBAR_URL}/v1/public/t/${TIENDA}/catalog`, { credentials: 'omit', signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`Scan-bar respondió ${r.status}`))))
      .then(r => { const lista = Array.isArray(r?.products) ? r.products : []; setExtras(lista); try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch { /* lleno */ } })
      .catch(e => console.warn('Scan-bar no disponible:', e.message))
      .finally(() => clearTimeout(t));
    return () => { clearTimeout(t); ctrl.abort(); };
  }, []);
  return extras.map(aMenuItem).filter((m): m is MenuItem => m !== null);
}

/** SKU del tamaño elegido. Debe coincidir con scripts/sync-repos.ts de Scan-bar: con dos tamaños id-ch / id-gde; con uno, id. */
export function skuDeTamano(m: MenuItem, size?: 'small' | 'large'): string {
  if (m.skus) return size === 'large' && m.skus.large ? m.skus.large : m.skus.small;
  return typeof m.priceLarge === 'number' ? `${m.id}-${size === 'large' ? 'gde' : 'ch'}` : m.id;
}

/** Lo que lleva una línea del carrito, en SKUs de Scan-bar (mismos cargos que suma el pedido). */
export function lineasDe(item: CartItem, menu: MenuItem[]): { sku: string; qty: number }[] | null {
  if (item.isCombo) return [{ sku: item.productId, qty: 1 }];
  const m = menu.find(x => x.id === item.productId);
  if (!m) return null;
  const lineas = [{ sku: skuDeTamano(m, item.size), qty: 1 }];
  if (['calientes', 'frios'].includes(m.category)) {
    if (item.milk && item.milk !== 'ninguna') lineas.push({ sku: MODIFICADORES.leche[item.milk].sku, qty: 1 });
    if (item.extraShot) lineas.push({ sku: MODIFICADORES.extraShot.sku, qty: 1 });
    if (item.whippedCream) lineas.push({ sku: MODIFICADORES.cremaBatida.sku, qty: 1 });
  }
  return lineas;
}

/** Pide a Scan-bar el código de una configuración. null si Scan-bar no está configurado o no respondió. */
export async function registrarConfiguracion(lines: { sku: string; qty: number }[], label: 'Bebida' | 'Pedido'): Promise<{ gtin: string; totalCents: number } | null> {
  if (!SCANBAR_URL) return null;
  try {
    const r = await fetch(`${SCANBAR_URL}/v1/public/t/${TIENDA}/configurations`, {
      method: 'POST', credentials: 'omit', signal: AbortSignal.timeout(8000),
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'web' },
      body: JSON.stringify({ label, lines }),
    });
    const body = await r.json().catch(() => null);
    if (!r.ok) throw new Error(body?.message ?? `Scan-bar respondió ${r.status}`);
    return /^\d{13}$/.test(body?.gtin) ? { gtin: body.gtin, totalCents: body.totalCents } : null;
  } catch (e) {
    console.warn('Scan-bar: no se pudo registrar la configuración:', (e as Error).message);
    return null;
  }
}
