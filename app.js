/**
 * META PIXEL + TRACKING PROPIO SIN UTMIFY
 * Producto: Introvertido y Seguro | Método C.A.L.M.A. de 30 Días
 * Pixel: 3945503179000292
 */
(function () {
  'use strict';

  /* =====================================================
     1. META PIXEL
  ===================================================== */

  !function(f,b,e,v,n,t,s)
  {
    if(f.fbq)return;
    n=f.fbq=function(){
      n.callMethod ?
      n.callMethod.apply(n,arguments) :
      n.queue.push(arguments)
    };

    if(!f._fbq) f._fbq=n;

    n.push=n;
    n.loaded=!0;
    n.version='2.0';
    n.queue=[];

    t=b.createElement(e);
    t.async=!0;
    t.src=v;

    s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s);

  }(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );

  fbq('init', '3945503179000292');

  fbq('track', 'PageView');

  // El precio y checkout de la nueva edición se confirmarán antes de lanzar campañas.
  // No atribuir un importe incorrecto a este ViewContent.
  fbq('track', 'ViewContent', {
    content_name: 'Introvertido y Seguro | Método C.A.L.M.A. de 30 Días',
    content_type: 'product',
    content_ids: ['8875939']
  });


  /* =====================================================
     2. UTMs + CLICK IDs
  ===================================================== */

  const TRACKING_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'fbclid',
    'gclid',
    'ttclid'
  ];

  const STORAGE_PREFIX = 'ie_tracking_';


  /* =====================================================
     3. LEER PARÁMETROS DE LA URL
  ===================================================== */

  const params = new URLSearchParams(window.location.search);

  const currentTracking = {};

  TRACKING_KEYS.forEach(function(key) {

    const value = params.get(key);

    if(value) {

      currentTracking[key] = value;

      try {
        localStorage.setItem(
          STORAGE_PREFIX + key,
          value
        );
      } catch(e) {}

    }

  });


  /* =====================================================
     4. GUARDAR PRIMERA ATRIBUCIÓN
  ===================================================== */

  try {

    if(
      !localStorage.getItem(
        STORAGE_PREFIX + 'first_touch'
      )
    ) {

      localStorage.setItem(
        STORAGE_PREFIX + 'first_touch',

        JSON.stringify({
          ...currentTracking,
          landing_page: window.location.href,
          referrer: document.referrer || '',
          timestamp: new Date().toISOString()
        })

      );

    }

  } catch(e) {}


  /* =====================================================
     5. GUARDAR ÚLTIMA ATRIBUCIÓN
  ===================================================== */

  try {

    localStorage.setItem(
      STORAGE_PREFIX + 'last_touch',

      JSON.stringify({
        ...currentTracking,
        landing_page: window.location.href,
        referrer: document.referrer || '',
        timestamp: new Date().toISOString()
      })

    );

  } catch(e) {}


  /* =====================================================
     6. FUNCIÓN PARA RECUPERAR TRACKING
  ===================================================== */

  window.getTrackingData = function() {

    const data = {};

    TRACKING_KEYS.forEach(function(key) {

      try {

        const value = localStorage.getItem(
          STORAGE_PREFIX + key
        );

        if(value) {
          data[key] = value;
        }

      } catch(e) {}

    });

    return data;

  };


  /* =====================================================
     7. DECORAR URL DE HOTMART
  ===================================================== */

  window.decorateHotmartUrl = function(rawUrl) {

    try {

      const url = new URL(
        rawUrl,
        window.location.href
      );

      if(
        url.hostname !== 'pay.hotmart.com'
      ) {
        return rawUrl;
      }

      const tracking =
        window.getTrackingData();

      Object.entries(tracking)
        .forEach(function([key,value]) {

          if(
            !url.searchParams.has(key)
          ) {

            url.searchParams.set(
              key,
              value
            );

          }

        });

      return url.toString();

    } catch(e) {

      return rawUrl;

    }

  };


  /* =====================================================
     8. AGREGAR UTMs A BOTONES HOTMART
  ===================================================== */

  function decorateHotmartLinks() {

    document
      .querySelectorAll('a[href]')
      .forEach(function(link) {

        try {

          const url = new URL(
            link.href,
            window.location.href
          );

          if(
            url.hostname ===
            'pay.hotmart.com'
          ) {

            link.href =
              window.decorateHotmartUrl(
                link.href
              );

          }

        } catch(e) {}

      });

  }


  /* =====================================================
     9. RESPALDO PARA LINKS DINÁMICOS
  ===================================================== */

  document.addEventListener(
    'click',

    function(event) {

      const link =
        event.target.closest &&
        event.target.closest(
          'a[href]'
        );

      if(!link) return;

      try {

        const url =
          new URL(
            link.href,
            window.location.href
          );

        if(
          url.hostname ===
          'pay.hotmart.com'
        ) {

          link.href =
            window.decorateHotmartUrl(
              link.href
            );

        }

      } catch(e) {}

    },

    true
  );


  /* =====================================================
     10. INICIAR
  ===================================================== */

  if(
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      decorateHotmartLinks
    );

  } else {

    decorateHotmartLinks();

  }

})();
