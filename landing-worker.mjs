// Landing only. The training app and payment webhook have separate Workers.
const RAW_BASE = 'https://raw.githubusercontent.com/luandystore-code/introvertido-y-exitoso/main/';
const FILES = {
  '/': ['index.html', 'text/html; charset=UTF-8'],
  '/index.html': ['index.html', 'text/html; charset=UTF-8'],
  '/styles.css': ['styles.css', 'text/css; charset=UTF-8'],
  '/app.js': ['app.js', 'application/javascript; charset=UTF-8'],
  '/assets/demo-poster.jpg': ['assets/demo-poster.jpg', 'image/jpeg'],
  '/assets/introvertido-seguro-demo.mp4': ['assets/introvertido-seguro-demo.mp4', 'video/mp4']
};
export default {
  async fetch(request) {
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', {status:405,headers:{Allow:'GET, HEAD'}});
    const url = new URL(request.url);
    if (url.pathname === '/favicon.ico') return new Response(null, {status:204});
    const [file, type] = FILES[url.pathname] || FILES['/'];
    const headers = new Headers();
    for (const name of ['Range','If-Range','If-None-Match','If-Modified-Since']) {
      if (request.headers.has(name)) headers.set(name,request.headers.get(name));
    }
    try {
      const upstream = await fetch(RAW_BASE + file + '?release=demo-20261104', {
        method:request.method, headers,
        cf:file === 'index.html' ? {cacheEverything:false} : {cacheEverything:true,cacheTtl:60}
      });
      if (!upstream.ok && ![304,416].includes(upstream.status)) {
        return new Response('No se pudo cargar este recurso. Inténtalo de nuevo.', {status:502});
      }
      const responseHeaders = new Headers(upstream.headers);
      // Replace the raw-file policy with a policy scoped to this sales landing.
      responseHeaders.set('Content-Security-Policy', "default-src 'self'; script-src 'self' https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.facebook.com; media-src 'self'; connect-src 'self' https://*.facebook.com https://*.facebook.net; frame-src https://www.facebook.com; object-src 'none'; base-uri 'self'; form-action 'self' https://pay.hotmart.com");
      responseHeaders.delete('Content-Disposition');
      responseHeaders.set('Content-Type',type);
      responseHeaders.set('Cache-Control',file === 'index.html' ? 'no-store' : 'public, max-age=60');
      responseHeaders.set('X-Content-Type-Options','nosniff');
      responseHeaders.set('Referrer-Policy','strict-origin-when-cross-origin');
      return new Response(request.method === 'HEAD' || [304,416].includes(upstream.status) ? null : upstream.body, {status:upstream.status,headers:responseHeaders});
    } catch {
      return new Response('No se pudo cargar la landing. Inténtalo de nuevo.', {status:502});
    }
  }
};
