/**
 * Visualizador de precio local aproximado para Introvertido y Seguro.
 * Base de la oferta: US$9.99. Hotmart decide la moneda y el total finales.
 * No modifica la atribución ni los eventos de compra en USD.
 */
(function () {
  'use strict';
  var BASE_USD = 9.99;
  var COUNTRIES = {
    MX:['MXN','es-MX','MX$ ',2], PE:['PEN','es-PE','S/ ',2],
    CO:['COP','es-CO','COP $',0], CL:['CLP','es-CL','CLP $',0],
    AR:['ARS','es-AR','ARS $',0], ES:['EUR','es-ES','€',2],
    UY:['UYU','es-UY','UY$ ',0], PY:['PYG','es-PY','₲ ',0],
    BO:['BOB','es-BO','Bs ',2], CR:['CRC','es-CR','₡ ',0],
    GT:['GTQ','es-GT','Q ',2], DO:['DOP','es-DO','RD$ ',0],
    BR:['BRL','pt-BR','R$ ',2], CA:['CAD','en-CA','CA$ ',2],
    GB:['GBP','en-GB','£',2]
  };
  function read(storage,key) {
    try { return JSON.parse(storage.getItem(key) || 'null'); } catch (e) { return null; }
  }
  function write(storage,key,value) {
    try { storage.setItem(key, JSON.stringify(value)); } catch (e) { /* optional */ }
  }
  async function getJson(url) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 4500);
    try {
      var response = await fetch(url, { signal: controller.signal, credentials:'omit' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }
  async function country() {
    // Vista de prueba sin modificar el checkout: ?preview_country=MX
    var preview = new URLSearchParams(location.search).get('preview_country');
    if (preview && /^[a-z]{2}$/i.test(preview)) return preview.toUpperCase();
    var cached = read(sessionStorage, 'calma_geo_v1');
    if (cached && /^[A-Z]{2}$/.test(cached.code)) return cached.code;
    var result = await getJson('https://get.geojs.io/v1/ip/country.json');
    var code = String(result.country || '').toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) throw new Error('Invalid country');
    write(sessionStorage, 'calma_geo_v1', { code:code });
    return code;
  }
  async function rates() {
    var cached = read(localStorage, 'calma_fx_usd_v1');
    if (cached && Date.now()-cached.savedAt < 43200000 && cached.rates &&
        typeof cached.rates.MXN === 'number') return cached.rates;
    var result = await getJson('https://open.er-api.com/v6/latest/USD');
    if (result.result !== 'success' || !result.rates) throw new Error('No FX rates');
    write(localStorage, 'calma_fx_usd_v1', { savedAt:Date.now(), rates:result.rates });
    return result.rates;
  }
  function show(config,rate) {
    if (!Number.isFinite(rate) || rate <= 0) return;
    var code=config[0], locale=config[1], prefix=config[2], digits=config[3];
    var value=new Intl.NumberFormat(locale,{
      minimumFractionDigits:digits,maximumFractionDigits:digits
    }).format(BASE_USD*rate);
    var label='≈ '+prefix+value;
    document.querySelectorAll('[data-local-price]').forEach(function(el) {
      el.textContent=label;
      el.setAttribute('aria-label','Precio orientativo '+label+' '+code);
    });
    document.querySelectorAll('.price').forEach(function(el) {
      el.classList.add('is-local');
      el.classList.toggle('is-very-long',label.length>13);
      el.setAttribute('aria-label','Precio orientativo '+label+' '+code);
    });
    var note=document.getElementById('localized-price-note');
    if (note) note.hidden=false;
  }
  async function init() {
    if (!document.querySelector('[data-local-price]')) return;
    try {
      var config=COUNTRIES[await country()];
      if (!config) return; // Por defecto USD.
      var table=await rates();
      show(config,Number(table[config[0]]));
    } catch (e) {
      // Error de geolocalización o FX: conservar precio base USD visible.
    }
  }
  if (document.readyState==='loading') {
    document.addEventListener('DOMContentLoaded',init,{once:true});
  } else { init(); }
})();
