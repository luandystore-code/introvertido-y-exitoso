/**
 * Checkout Elements oficial de Hotmart.
 * La moneda local y el total se muestran dentro del checkout: no existe
 * una API pública documentada para duplicar ese importe fuera del widget.
 * La oferta nkxmax79 fue proporcionada por el propietario del producto.
 */
(function () {
  'use strict';
  var selector='#inline_checkout';
  var root=document.querySelector(selector);
  if (!root) return;
  var started=false;
  function showError() {
    var status=document.getElementById('hotmart-inline-status');
    if (status) status.textContent='No se pudo cargar el formulario aquí. Usa el enlace a Hotmart para ver tu precio local y comprar.';
  }
  function mount() {
    if (started) return;
    started=true;
    var script=document.createElement('script');
    script.src='https://checkout.hotmart.com/lib/hotmart-checkout-elements.js';
    script.async=true;
    script.onload=function () {
      try {
        if (!window.checkoutElements || typeof window.checkoutElements.init !== 'function') {
          showError(); return;
        }
        var element=window.checkoutElements.init('inlineCheckout',{offer:'nkxmax79'});
        var pending=element.mount(selector);
        if (pending && typeof pending.catch==='function') pending.catch(showError);
        var status=document.getElementById('hotmart-inline-status');
        if (status) status.remove();
      } catch (error) { showError(); }
    };
    script.onerror=showError;
    document.head.appendChild(script);
  }
  // Carga diferida para reducir el impacto del checkout externo en la landing móvil.
  if ('IntersectionObserver' in window) {
    var observer=new IntersectionObserver(function(entries) {
      if (entries.some(function(entry){return entry.isIntersecting;})) {
        observer.disconnect();mount();
      }
    }, {rootMargin:'500px 0px'});
    observer.observe(root);
  } else {mount();}
})();