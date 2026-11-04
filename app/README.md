# Introvertido y Seguro — app interactiva (piloto)

Aplicación PWA separada de la landing de ventas. Contenido adaptado de los seis PDF de la edición ilustrada.

## Funciones

- 5 etapas C.A.L.M.A. con preguntas, notas y checklist.
- Reto de 30 días con versión fácil y escalas antes/después.
- Evaluación inicial y final de 8 preguntas.
- Herramientas de reuniones, networking, límites y frases.
- Guardado automático en Cloudflare D1 y copia local en el navegador.
- Registro e ingreso con nombre de usuario elegido y contraseña personal de 12 a 128 caracteres.\n- Derivación de credencial mediante PBKDF2-SHA256 (310 000 iteraciones) en el navegador; el servidor conserva su hash SHA-256. El usuario se normaliza a minúsculas.\n- Las cuentas anteriores siguen usando su clave de recuperación original.
- Exportar progreso a JSON y eliminar todos los datos.
- Instalable como PWA. No contiene Meta Pixel.

## Seguridad y límites del piloto

**Aún NO valida compras en Hotmart**. No promocionar como producto exclusivo hasta conectar un flujo de acceso autenticado y verificación de pago, cancelación y reembolso. Cualquiera puede crear un espacio durante el piloto. La clave actúa como credencial: si se comparte o se pierde puede comprometerse la confidencialidad o el acceso.

Para cuentas nuevas, el usuario elige un identificador y una contraseña; el navegador deriva la credencial usada como token y el backend guarda un hash de ese token, no la contraseña en texto. La credencial derivada permanece en el navegador para recordar la sesión. No hay recuperación por correo, segundo factor ni rate limiting endurecido todavía. No usar como sistema final de acceso comercial sin auditoría, protección antiabuso y enlace a compra verificada.\n\nLas cuentas antiguas mantienen el acceso por clave aleatoria de recuperación. No existe migración automática de datos a una cuenta nueva.

## Deployment

Cloudflare Worker separado `introvertido-y-seguro` con binding D1 `DB`, base de datos `introvertido-seguro-progress`. El Worker obtiene los archivos públicos de `main/app` de GitHub. No modificar el Worker existente `introvertido-y-exitoso`, que sirve la landing comercial.

## Integración futura Hotmart

- Webhook firmado o verificado en backend; validar evento con API de Hotmart si procede.
- Tabla de compras y relación comprador → identidad.
- Autenticación de usuario reforzada (verificación por correo, recuperación de contraseña, rate limiting) y revocación por cancelación/reembolso.
- Nunca exponer credenciales Hotmart ni confiar en códigos de pedido enviados desde el navegador.
- Añadir política de privacidad, términos y borrado de datos antes de comercializar.
