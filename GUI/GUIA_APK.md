# Guía para Generar APK de Android (Calculadora Sísmica FPGY)

Como esta es una Aplicación Web Progresiva (PWA), puedes generar un archivo `.apk` (o `.aab` para Play Store) fácilmente usando herramientas gratuitas.

No necesitas instalar Android Studio ni configurar entornos complejos.

## Pasos para generar el APK

### Método Recomendado: PWABuilder (Gratis y Rápido)

Este método toma tu aplicación web y la empaqueta como una app nativa de Android.

#### 1. Publicar la aplicación (Requisito)
Para que PWABuilder funcione, tu aplicación debe estar accesible en internet (no solo en tu computador).
- Puedes subir la carpeta `NEC15_App` a servicios gratuitos como **Netlify**, **Vercel** o **GitHub Pages**.
- **Netlify Drop:** [https://app.netlify.com/drop](https://app.netlify.com/drop) -> Simplemente arrastra la carpeta `NEC15_App` y te dará una URL (ej: `https://nec15-calc.netlify.app`).

#### 2. Generar el APK
1. Ve a [PWABuilder.com](https://www.pwabuilder.com/).
2. Ingresa la URL de tu aplicación publicada (ej: `https://nec15-calc.netlify.app`).
3. Haz clic en **Start**.
4. Verás que la tarjeta "Android" dice "Ready". Haz clic en **Package for Stores**.
5. En la ventana que se abre:
   - **Package ID:** Deja el por defecto o pon algo como `com.tu-nombre.nec15-fpgy`.
   - **App Name:** Calculadora Sísmica FPGY.
   - Haz clic en **Generate**.
6. **¡Listo!** Se descargará un archivo `.zip`.

#### 3. Instalar en tu Android
1. Descomprime el archivo `.zip` descargado.
2. Busca el archivo que termina en `.apk` (dentro de `android/apk/release/` o similar).
3. Envía ese archivo a tu teléfono (por WhatsApp, USB, Drive).
4. Ábrelo en tu teléfono e instálalo. (Puede que debas activar "Instalar de fuentes desconocidas").

---

## Opción Alternativa: TWA (Trusted Web Activity) con Android Studio

Si prefieres hacerlo manualmente (más complejo):
1. Instala Android Studio.
2. Crea un proyecto nuevo.
3. Clona [este repositorio plantilla](https://github.com/GoogleChromeLabs/svgomg-twa).
4. Edita el `build.gradle` para apuntar a tu URL.
5. Genera el APK firmado.

*(Recomendamos fuertemente usar el método PWABuilder por su simplicidad)*.
