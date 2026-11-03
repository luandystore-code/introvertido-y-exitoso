# Introvertido y Exitoso

Base editable de la landing de venta de **Introvertido y Exitoso**.

## Origen

Página pública actual usada como referencia:
`https://infoproductosparaelfuturo.systeme.io/introvertidoyexitoso`

## Estructura

- `index.html` — contenido y estructura de la landing.
- `styles.css` — diseño responsive, mobile-first.
- `app.js` — preservación de UTMs/fbclid hacia Hotmart.
- `assets/` — imágenes originales del producto y testimonios.
- `docs/AUDIT.md` — hallazgos y próximos cambios CRO/Meta Ads.

## Checkout

Producto Hotmart actual:
`https://pay.hotmart.com/A100726729Y?checkoutMode=10`

Los CTA usan JavaScript para conservar parámetros de atribución que lleguen a la landing. No se fuerza `utm_source=organic`.

## Desarrollo local

No requiere build. Abrir `index.html` en el navegador o usar cualquier servidor estático.

Ejemplo:

```bash
python -m http.server 8080
```

## Próximo paso

1. Incorporar assets originales.
2. Crear rama de optimización CRO.
3. Cambiar hero usando el concepto creativo ganador.
4. Unificar precio/valor de referencia.
5. Verificar prueba social.
6. Publicar en Cloudflare Pages o equivalente.

## Tracking

La landing usa tracking propio sin UTMify en `app.js`:

- Meta Pixel `3945503179000292`
- `PageView`
- `ViewContent` para `Introvertido y Exitoso` con valor `9.00 USD`
- Persistencia en `localStorage` de UTMs y click IDs
- Primera y última atribución (`first_touch` / `last_touch`)
- Decoración automática de todos los enlaces `pay.hotmart.com`
- Respaldo para enlaces Hotmart agregados dinámicamente

Prefijo de almacenamiento: `ie_tracking_`.
