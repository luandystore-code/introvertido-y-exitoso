# Introvertido y Seguro — app de práctica sin contraseña

App PWA complementaria del curso en Hotmart Club, producto Hotmart `8875939`, totalmente separada de la landing comercial.

## Funcionamiento actual

- Acceso directo sin registro, contraseña ni petición de correo.
- Método C.A.L.M.A. en 5 etapas, reto de 30 días, autoevaluaciones y herramientas prácticas.
- Respuestas, checklists y puntuaciones guardados en `localStorage` del navegador con clave `calma_progreso_local_v1`.
- Exportación de respaldo JSON desde «Mi espacio» e importación en otro navegador.
- Opción voluntaria para recuperar los avances de una cuenta antigua de la app mediante su credencial anterior, sin borrarla del backend.
- Botón para eliminar solo los avances locales de esta versión.
- No se envían respuestas nuevas a D1, Hotmart ni Meta Ads desde la app sin contraseña.

## Advertencias importantes

- **El enlace es público.** Colocarlo dentro de Hotmart Club no restringe el acceso a quien obtenga la URL. Hotmart Club controla el acceso al contenido del curso, pero no autentica la app de Cloudflare.
- La app no se sincroniza automáticamente entre dispositivos, navegadores ni sesiones privadas. Borrar los datos del navegador elimina el progreso si no se descargó respaldo.
- Los registros pueden contener reflexiones privadas: los archivos de respaldo deben guardarse de forma segura.
- El Worker conserva la API antigua de cuentas únicamente para que usuarios previos puedan recuperar sus registros; esta app ya no crea cuentas ni realiza escrituras en D1.
- No eliminar las tablas `profiles`, `entries` y `user_handles` hasta resolver o descartar una migración de cuentas anteriores.
- El Webhook independiente `hotmart-calma-webhook` puede desactivarse desde Hotmart cuando no se necesita habilitar accesos por compra. Mantenerlo no altera esta experiencia de acceso libre.

## Publicación

URL: `https://introvertido-y-seguro.luandylabs.workers.dev/`

Cloudflare Worker: `introvertido-y-seguro`, sirve los assets públicos de `main/app` de GitHub. Se mantiene sin cambios la landing independiente `introvertido-y-exitoso`.

### Integración con Hotmart Club

Añadir una clase o recurso “Mi entrenamiento interactivo C.A.L.M.A.” con el enlace público anterior. No marcar el producto como área externa, pues Hotmart Club ya gestiona el acceso al curso.

## Comprobación sugerida

1. Abrir app en pestaña nueva: debe mostrar Inicio directamente sin modal.
2. Escribir un ejercicio; recargar y comprobar persistencia.
3. Marcar un reto y verificar el contador.
4. Descargar respaldo, borrar progreso local e importar el archivo.
5. Verificar que el curso en Hotmart Club y la landing comercial sigan intactos.
