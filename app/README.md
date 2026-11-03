# Introvertido y Seguro — app interactiva (piloto)

Aplicación PWA separada de la landing de ventas. Contenido adaptado de los seis PDF de la edición ilustrada.

## Funciones

- 5 etapas C.A.L.M.A. con preguntas, notas y checklist.
- Reto de 30 días con versión fácil y escalas antes/después.
- Evaluación inicial y final de 8 preguntas.
- Herramientas de reuniones, networking, límites y frases.
- Guardado automático en Cloudflare D1 y copia local en el navegador.
- Clave de recuperación de 256 bits para abrir el mismo espacio en otro dispositivo.
- Exportar progreso a JSON y eliminar todos los datos.
- Instalable como PWA. No contiene Meta Pixel.

## Seguridad y límites del piloto

**Aún NO valida compras en Hotmart**. No promocionar como producto exclusivo hasta conectar un flujo de acceso autenticado y verificación de pago, cancelación y reembolso. Cualquiera puede crear un espacio durante el piloto. La clave actúa como credencial: si se comparte o se pierde puede comprometerse la confidencialidad o el acceso.

La clave se genera con `crypto.getRandomValues`; el backend solo almacena SHA-256, no la clave. Cualquier persona que posea la clave puede abrir el espacio. Esta autenticación no sustituye el control de licencias de Hotmart.

## Deployment

Cloudflare Worker separado `introvertido-y-seguro` con binding D1 `DB`, base de datos `introvertido-seguro-progress`. El Worker obtiene los archivos públicos de `main/app` de GitHub. No modificar el Worker existente `introvertido-y-exitoso`, que sirve la landing comercial.

## Integración futura Hotmart

- Webhook firmado o verificado en backend; validar evento con API de Hotmart si procede.
- Tabla de compras y relación comprador → identidad.
- Autenticación de usuario segura (por ejemplo email magic link) y revocación por cancelación/reembolso.
- Nunca exponer credenciales Hotmart ni confiar en códigos de pedido enviados desde el navegador.
- Añadir política de privacidad, términos y borrado de datos antes de comercializar.
