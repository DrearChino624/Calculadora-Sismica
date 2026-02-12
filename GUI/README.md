# Calculadora Sísmica NEC-15 - Aplicación Web/APK

## 📱 Descripción

Aplicación web progresiva (PWA) para calcular espectros sísmicos y fuerzas laterales según la **Norma Ecuatoriana de Construcción NEC-15**. Puede instalarse como aplicación en Android, iOS y escritorio.

## ✨ Características

- ✅ **Cálculo completo según NEC-15**
- ✅ **Interfaz moderna y responsiva**  
- ✅ **Gráficas interactivas** (Chart.js)
- ✅ **Modo oscuro/claro**
- ✅ **Exportación de resultados** (PDF, JSON)
- ✅ **Instalable como APK** (PWA)
- ✅ **Funciona offline** (una vez instalada)
- ✅ **Sin necesidad de servidor**

## 🚀 Cómo Usar

### Opción 1: Navegador Web

1. Abrir `index.html` en cualquier navegador moderno
2. Completar los formularios
3. Ver resultados y gráficas

### Opción 2: Instalar como App (PWA)

#### En Android:
1. Abrir el sitio en Chrome
2. Menú → "Agregar a pantalla de inicio"
3. ¡Listo! La app quedará instalada

#### En iOS:
1. Abrir en Safari
2. Botón compartir → "Agregar a pantalla de inicio"

#### En Escritorio (Chrome/Edge):
1. Ícono de instalación en la barra de direcciones
2. Clic en "Instalar"

### Opción 3: Convertir a APK

Para generar un APK real para distribuir:

1. **Usar herramientas online:**
   - [PWABuilder](https://www.pwabuilder.com/)
   - [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)
   
2. **Pasos:**
   - Subir la app a un servidor web (puede ser local con http-server)
   - Usar PWABuilder para generar el APK
   - Descargar e instalar en Android

## 📐 Funcionalidades Implementadas

### 1️⃣ Parámetros del Sitio
- Zona sísmica (I a VI)
- Tipo de suelo (A a E)
- Región geográfica (Sierra, Costa, Oriente, Galápagos)

### 2️⃣ Características de la Estructura
- Número de pisos (1-50)
- Alturas por piso
- Pesos por piso

### 3️⃣ Sistema Estructural
- Hormigón - Pórticos especiales
- Hormigón - Muros estructurales
- Acero - Pórticos sin arriostrar
- Acero - Pórticos arriostrados
- Sistema mixto

### 4️⃣ Factores de Diseño
- Factor R (ductilidad)
- Factor I (importancia)
- φP (irregularidad en planta)
- φE (irregularidad en elevación)

### 📊 Resultados Calculados

- ✅ Espectro de respuesta elástico
- ✅ Espectro de respuesta inelástico
- ✅ Periodo fundamental T₁
- ✅ Coeficiente sísmico C
- ✅ Cortante basal V
- ✅ Distribución de fuerzas laterales
- ✅ Validaciones NEC-15

### 📈 Gráficas

- Espectros elástico/inelástico con T₁ marcado
- Distribución de fuerzas laterales por nivel

### 💾 Exportación

- Guardar proyecto (JSON)
- Exportar PDF (próximamente)
- Capturas de gráficas

## 🛠️ Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- No requiere instalación de software adicional

## 📁 Estructura de Archivos

```
NEC15_App/
├── index.html              # Página principal
├── manifest.json           # Configuración PWA
├── css/
│   └── styles.css          # Estilos modernos
├── js/
│   ├── nec15-core.js       # Lógica de cálculos NEC-15
│   └── app.js              # Lógica de la aplicación
├── img/
│   └── icon-*.png          # Iconos para PWA
└── README.md               # Este archivo
```

## 🔧 Tecnologías Usadas

- **HTML5**: Estructura
- **CSS3**: Estilos modernos con variables CSS
- **JavaScript**: Lógica pura (sin frameworks)
- **Chart.js**: Gráficas interactivas
- **PWA**: Instalación como app nativa

## 📚 Fórmulas Implementadas

Todas las fórmulas de la NEC-15:

1. **Espectro elástico** (3 tramos según periodo)
2. **Periodos característicos** (T₀, Tc)
3. **Periodo fundamental** (método empírico)
4. **Coeficiente sísmico** con validación de cortante mínimo
5. **Distribución de fuerzas** con exponente k variable

## 🎨 Características de Diseño

- ✨ Diseño moderno y profesional
- 🌓 Modo oscuro/claro
- 📱 100% responsivo (móvil, tablet, escritorio)
- ⚡ Animaciones suaves
- 🎯 Interfaz intuitiva
- ♿ Accesible

## 🔐 Privacidad

- ✅ Todo el procesamiento es local
- ✅ No envía datos a servidores
- ✅ No requiere cuenta ni login
- ✅ Totalmente gratuita

## 📖 Ejemplo de Uso

1. **Seleccionar parámetros:**
   - Zona: V (Quito)
   - Suelo: B (Roca)
   - Región: Sierra

2. **Configurar estructura:**
   - 3 pisos
   - Alturas: 3m cada uno
   - Pesos: 96t cada uno

3. **Sistema: Pórticos especiales H.A.**
   - R = 8, I = 1.5

4. **Calcular →** Ver resultados y gráficas

## 🚦 Estado del Proyecto

✅ **Completado y Funcional**

- [x] Interfaz completa
- [x] Cálculos NEC-15 implementados
- [x] Gráficas interactivas
- [x] Modo oscuro
- [x] PWA configurada
- [x] Exportación JSON
- [ ] Exportación PDF (en progreso)

## 📞 Soporte

Para consultas sobre la norma NEC-15:
- [Norma oficial](https://www.habitatyvivienda.gob.ec/)

## 📄 Licencia

Proyecto educativo - Libre uso

---

**Desarrollado con ❤️ para ingenieros civiles y estructurales**

*Última actualización: Febrero 2026*
