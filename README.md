# Introvertido y Seguro — landing de ventas (en preparación)

Landing existente, renovada para el producto **Introvertido y Seguro | Método C.A.L.M.A. de 30 Días**, producto Hotmart **8875939**.

URL publicada: https://introvertido-y-exitoso.luandylabs.workers.dev/

> La ruta del Worker conserva el slug anterior por motivos técnicos. El contenido visual y metadatos de la página corresponden a la nueva edición. La landing está en preparación: **NO anunciar ni abrir tráfico de pago hasta agregar el checkout del producto nuevo**.

## Producto mostrado

La oferta refleja los 7 módulos existentes en Hotmart Club:

1. Empieza aquí.
2. Libro principal: Introvertido y Seguro.
3. Reto práctico de 30 días.
4. Bono: Kit de frases y guiones.
5. Bono: Cuaderno de ejercicios.
6. Bono: Checklist de networking.
7. Acceso a la app interactiva C.A.L.M.A.

La app es una herramienta externa complementaria, disponible a través del recurso PDF de Hotmart Club. Permite actividades, anotaciones, avance de 0 a 30 días, análisis educativo y comparación de autoevaluaciones. No sincroniza datos automáticamente entre dispositivos; cada persona puede exportar su respaldo.

No se publica aquí el enlace público de la app para evitar distribuir el bono antes de la compra.

## Cambios CRO de la landing

- Promesa clara, retos reales y cinco etapas C.A.L.M.A.
- Vista conceptual de la app y su utilidad sin inventar resultados de compradores.
- Los siete recursos del área de miembros se muestran explícitamente.
- Se retiraron testimonios y estadísticas sin evidencia.
- Se retiraron afirmaciones antiguas sobre páginas, precio y acceso vitalicio no confirmadas para esta edición.
- FAQ aclara límites del guardado, condiciones educativas y acceso desde Hotmart.
- CTA de navegación llevan al contenido y a la descripción de la oferta. **Botón de compra deshabilitado intencionalmente** hasta contar con checkout real.
- Diseño responsive verde y dorado con barra inferior móvil.

## Pendiente antes de abrir anuncios

1. Recibir **URL exacta del checkout de Hotmart para el producto 8875939**, sin reutilizar la URL del producto anterior.
2. Confirmar precio real, divisa, garantía/plazo de reembolso y condiciones de acceso.
3. Insertar checkout y precio en todos los CTA, incluido header, hero, tarjeta de precio, CTA final y barra fija móvil; asegurar preservación de UTMs/fbclid.
4. Validar Pixel ID 3945503179000292 en la cuenta de anuncios adecuada. app.js mantiene PageView y ViewContent con content_id 8875939, sin valor monetario hasta confirmar precio.
5. Probar recorrido completo: clic de anuncio → landing → checkout → compra de prueba → acceso a Hotmart Club → PDF de app → navegación y guardado de ejercicios.
6. Publicar solo testimonios y métricas verificables, si los hubiera.

## Archivos

- index.html: copy y estructura de la landing.
- styles.css: diseño responsive, vista conceptual de la app.
- app.js: Pixel y atribución UTM.
- app/: aplicación complementaria independiente.
- docs/AUDIT.md: auditorías históricas, pueden referirse a la edición anterior.

## Tracking

El código de la landing mantiene el Meta Pixel anteriormente instalado, los eventos PageView y ViewContent, primera/última atribución y persistencia de UTMs/click IDs en localStorage. Cuando haya una URL nueva de checkout pay.hotmart.com, el decorador de app.js puede agregar los parámetros de atribución automáticamente.

**No cambiar** el Worker receptor de Webhook ni la app interactiva al configurar el checkout: son recursos independientes.
