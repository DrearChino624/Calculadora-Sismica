# Documentación de la Interfaz Gráfica de Usuario (GUI)

## Introducción
La aplicación **NEC15_App** es una herramienta diseñada para [describir brevemente el propósito principal de la aplicación, por ejemplo: "gestionar tareas, proporcionar información, etc."]. La interfaz gráfica de usuario (GUI) ha sido desarrollada para ofrecer una experiencia intuitiva y amigable para los usuarios, permitiéndoles interactuar de manera eficiente con las funcionalidades de la aplicación.

## Características principales de la GUI

1. **Pantalla de inicio**
   - **Archivo:** `index.html`
   - La pantalla principal de la aplicación proporciona un acceso rápido a las funciones principales.
   - Incluye un diseño limpio y moderno, con navegación intuitiva.

2. **Diseño visual**
   - **Archivo CSS:** `css/styles.css`
   - La interfaz utiliza un diseño responsivo que se adapta a diferentes tamaños de pantalla, asegurando una experiencia óptima tanto en dispositivos móviles como en computadoras de escritorio.
   - Los colores y tipografías han sido seleccionados para garantizar una buena legibilidad y una apariencia profesional.

3. **Interactividad**
   - **Archivos JavaScript:** `js/app.js`, `js/nec15-core.js`
   - La aplicación incluye funcionalidades interactivas como [describir funcionalidades específicas, por ejemplo: "búsqueda en tiempo real, navegación dinámica, etc."].
   - Se utiliza JavaScript para manejar eventos y actualizar dinámicamente el contenido de la página.

4. **Recursos multimedia**
   - **Carpeta de imágenes:** `img/`
   - La aplicación incluye imágenes y otros recursos multimedia para mejorar la experiencia del usuario.

5. **Soporte offline**
   - **Archivo Service Worker:** `sw.js`
   - La aplicación está equipada con un Service Worker que permite su uso en modo offline, mejorando la accesibilidad y la experiencia del usuario.

## Estructura del proyecto
El proyecto está organizado de la siguiente manera:

```
NEC15_App/
├── GUIA_APK.md
├── index.html
├── manifest.json
├── README.md
├── sw.js
├── assets/
├── css/
│   └── styles.css
├── img/
└── js/
    ├── app.js
    └── nec15-core.js
```

- **index.html:** Archivo principal de la aplicación que contiene la estructura HTML.
- **css/styles.css:** Archivo de estilos que define la apariencia de la interfaz.
- **js/app.js y js/nec15-core.js:** Archivos JavaScript que controlan la lógica y la interactividad de la aplicación.
- **sw.js:** Service Worker para habilitar funcionalidades offline.
- **assets/, img/:** Carpetas que contienen recursos adicionales como imágenes y otros archivos necesarios para la aplicación.

## Conclusión
La GUI de **NEC15_App** ha sido diseñada para proporcionar una experiencia de usuario eficiente y agradable, integrando características modernas como diseño responsivo, interactividad y soporte offline. Este documento proporciona una visión general de las funcionalidades y la estructura del proyecto para facilitar su comprensión y uso.