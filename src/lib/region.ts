import { useSyncExternalStore } from 'react'
import type { RegionKey } from './config'

/* Which price list the visitor sees.

   Order of trust, highest first:
   1. a choice the visitor made with the currency switcher (remembered);
   2. the country Cloudflare reports for the request (/api/geo), cached for the
      session — accurate, and nothing leaves your own site;
   3. a guess from the browser's time zone and language, used instantly on first
      paint and whenever the edge lookup is unavailable (local development, or
      the function not deployed).
   Anything that isn't India or Canada sees the US list, in dollars. */

const KEY = 'region'
const SESSION_KEY = 'region-edge'

const isRegion = (v: unknown): v is RegionKey => v === 'IN' || v === 'US' || v === 'CA'

function read(storage: 'local' | 'session'): RegionKey | null {
  try {
    const v = (storage === 'local' ? window.localStorage : window.sessionStorage).getItem(
      storage === 'local' ? KEY : SESSION_KEY,
    )
    return isRegion(v) ? v : null
  } catch {
    return null
  }
}

function write(storage: 'local' | 'session', value: RegionKey) {
  try {
    ;(storage === 'local' ? window.localStorage : window.sessionStorage).setItem(
      storage === 'local' ? KEY : SESSION_KEY,
      value,
    )
  } catch {
    /* storage can be blocked; the choice then lasts for this page view only */
  }
}

const CANADIAN_ZONES =
  /^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina|Montreal|Moncton|Glace_Bay|Goose_Bay|Iqaluit|Whitehorse|Yellowknife|Rankin_Inlet|Cambridge_Bay|Nipigon|Thunder_Bay|Dawson|Dawson_Creek|Fort_Nelson|Swift_Current|Inuvik|Resolute|Pangnirtung|Atikokan|Blanc-Sablon|Creston)/

function guess(): RegionKey {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
    if (zone === 'Asia/Kolkata' || zone === 'Asia/Calcutta') return 'IN'
    if (CANADIAN_ZONES.test(zone)) return 'CA'
    const lang = navigator.language ?? ''
    if (/-IN$/i.test(lang)) return 'IN'
    if (/-CA$/i.test(lang)) return 'CA'
  } catch {
    /* fall through to the default */
  }
  return 'US'
}

const fromCountry = (country: string): RegionKey =>
  country === 'IN' ? 'IN' : country === 'CA' ? 'CA' : 'US'

let current: RegionKey = read('local') ?? read('session') ?? guess()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

/* a visitor's own choice: remembered, and never overridden by the edge lookup */
export function setRegion(next: RegionKey) {
  write('local', next)
  if (next === current) return
  current = next
  emit()
}

let started = false

/* Ask the edge where the request came from, once per page load. Skipped when
   the visitor has chosen a currency, or when this session already asked. */
export async function initRegion() {
  if (started) return
  started = true
  if (read('local') || read('session')) return
  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 2500)
    const res = await fetch('/api/geo', { cache: 'no-store', signal: controller.signal })
    window.clearTimeout(timer)
    if (!res.ok) return
    const data: unknown = await res.json()
    const country =
      typeof data === 'object' && data !== null && 'country' in data
        ? (data as { country: unknown }).country
        : null
    if (typeof country !== 'string' || country.length !== 2) return
    const next = fromCountry(country.toUpperCase())
    write('session', next)
    if (next !== current && !read('local')) {
      current = next
      emit()
    }
  } catch {
    /* no edge lookup available: the time-zone guess stands */
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useRegion(): [RegionKey, (region: RegionKey) => void] {
  const region = useSyncExternalStore(
    subscribe,
    () => current,
    () => current,
  )
  return [region, setRegion]
}
