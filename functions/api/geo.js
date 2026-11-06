// Cloudflare Pages Function: GET /api/geo
//
// Reports the two-letter country Cloudflare resolved for the request, so the site
// can show local prices. Only the country is returned: no IP address, nothing is
// stored, and nothing is sent to a third party. `request.cf.country` is always
// present on Cloudflare's network; the CF-IPCountry header is the backup.
//
// Not cacheable: the answer differs per visitor.
export function onRequestGet({ request }) {
  const country = (request.cf && request.cf.country) || request.headers.get('CF-IPCountry') || null

  return new Response(JSON.stringify({ country }), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'private, no-store',
    },
  })
}
