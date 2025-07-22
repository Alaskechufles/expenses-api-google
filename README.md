# 💼 ExpenseTracker - Gestor de Gastos e Ingresos

> **Copyright (c) 2025 Alaskechufles | Licencia MIT**

Una aplicación React moderna para gestionar tus finanzas personales conectada directamente con Google Sheets. Registra gastos e ingresos, visualiza métricas detalladas y mantén el control total de tus finanzas con una interfaz elegante y funcionalidades avanzadas.

## 🎯 **Características Destacadas**

### 💰 **Gestión Financiera Completa**

- **✅ CRUD Completo**: Crear, leer, actualizar y eliminar registros
- **🔄 Sincronización en Tiempo Real**: Integración directa con Google Sheets API v4
- **🎨 Modal System**: Formularios y confirmaciones en modales elegantes
- **⚡ Validación Inteligente**: Sistema de errores integrado sin alerts del navegador
- **🔍 Filtrado Avanzado**: Búsqueda, categorías, tipos y paginación (10 registros por página)
- **📊 Orden Cronológico**: Últimos registros primero para mejor experiencia

### 💸 **Tipos de Transacciones**

- **Gastos** (💸): Montos negativos con categorías específicas
- **Ingresos** (💰): Montos positivos con categorías diferenciadas
- **Auto-detección**: El sistema reconoce automáticamente el tipo por categoría

### 🎨 **Interfaz Moderna con Paleta Verde-Morado**

- **🟢 Verde**: Para ingresos, botones de confirmación y elementos positivos
- **🟣 Morado**: Para gastos, acciones principales y navegación
- **📱 Responsive**: Diseño completamente adaptable a móviles y desktop
- **✨ Animaciones**: Efectos suaves (fadeIn, gradientShift, float) para mejor UX

## ✨ Características Principales

### 💰 **Sistema de Gestión Avanzado**

- **📝 Formularios Inteligentes**: Validación en tiempo real con mensajes de error elegantes
- **🗂️ Categorías Dinámicas**: Se adaptan automáticamente según el tipo de transacción
- **💳 Métodos de Pago**: Soporte para efectivo, tarjetas y billeteras digitales
- **👥 Multi-usuario**: Sistema de registro por usuario (Sigrid, Diego)
- **🔒 Modal de Confirmación**: Eliminar registros con confirmación visual de datos

### 📊 **Dashboard de Métricas Completo**

- **📈 Análisis Temporal**: Resúmenes mensuales, anuales y totales generales
- **🏆 Top Categorías**: Ranking visual con barras de progreso
- **💎 Métodos de Pago**: Análisis detallado del uso de diferentes métodos
- **⚖️ Balance Inteligente**: Cálculo automático con indicadores de color
- **📋 Estadísticas**: Cantidad de transacciones y promedios por categoría

### 🔍 **Funcionalidades de Tabla Avanzadas**

- **🔎 Búsqueda Multi-campo**: Por descripción, categoría, método de pago, etc.
- **🏷️ Filtros por Categoría**: Selección específica de categorías
- **⚖️ Filtros por Tipo**: Solo gastos, solo ingresos, o todos
- **📄 Paginación**: Navegación por páginas de 10 registros
- **👁️ Filtros Ocultos**: Sistema de toggle para mostrar/ocultar filtros
- **📅 Orden Cronológico**: Registros más recientes primero

### 🔐 **Autenticación Moderna**

- **🚀 Google Identity Services**: OAuth2 moderna (no deprecated gapi.auth2)
- **🔑 Gestión de Tokens**: Manejo automático de acceso y renovación
- **🛡️ Seguridad**: Variables de entorno para credenciales
- **🌐 Multi-dominio**: Soporte para desarrollo y producción

## 🎯 Estructura de Google Sheet

Tu hoja de cálculo debe tener estos headers exactos en la primera fila:

```
| Date | Description | Category | How Much? | What payment method? | payment manager | who recorded |
```

### 📝 **Categorías Disponibles**

#### **💸 Gastos:**

```
Donaciones, Transporte, Entretenimiento, Renta, Ahorros,
Comida, Educación, Salud, Artículos del hogar, Servicios,
Artículos de trabajo, Regalos, Prestamos, Deudas, Otros
```

#### **💰 Ingresos:**

```
Salario, Freelance, Inversiones, Ventas, Bonos, Regalos, Otros
```

#### **💳 Métodos de Pago:**

```
Efectivo, Sigrid Interbank, Sigrid OH, Sigrid BCP Amex,
Sigrid BCP Visa, Sigrid BBVA, Sigrid Yape/plin/débito,
Diego Yape/plin/débito, Diego BBVA dolares débito
```

### 📊 **Ejemplo de datos:**

```
| 2025-01-15 | Compra supermercado | Comida | -45.50 | Efectivo | Sigrid BBVA | Sigrid |
| 2025-01-15 | Salario enero | Salario | 2500.00 | Sigrid Interbank | Banco | Diego |
| 2025-01-16 | Uber a trabajo | Transporte | -15.30 | Sigrid Yape/plin/débito | Yape | Sigrid |
```

## 🚀 Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
git clone <tu-repositorio>
cd expenses-api-google
npm install
```

### 2. Configurar Google Cloud Console

1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita la **Google Sheets API**
3. Crea credenciales:
   - **API Key** para acceso a la API
   - **OAuth 2.0 Client ID** para autenticación
4. Configura dominios autorizados:
   - `http://localhost:5173` (desarrollo)
   - Tu dominio de producción

### 3. Configurar variables de entorno

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus credenciales:

```bash
# Google Sheets API Configuration
VITE_GOOGLE_API_KEY=tu_api_key_aqui
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui
VITE_GOOGLE_SPREADSHEET_ID=tu_spreadsheet_id_aqui
```

**⚠️ Importante**:

- Nunca subas el archivo `.env` al repositorio
- El archivo `.env.example` muestra la estructura requerida
- Las variables deben empezar con `VITE_` para ser accesibles en el frontend

### 4. Preparar Google Sheet

1. Crea una nueva hoja de cálculo
2. Agrega los headers exactos en la primera fila
3. Configura permisos de edición
4. Copia el ID desde la URL

### 5. Ejecutar

```bash
npm run dev
```

## 📱 Uso de la Aplicación

### 🔐 **Autenticación**

1. **🚀 Pantalla de Login Mejorada**: Diseño con gradientes y animaciones
2. **🔑 "Iniciar Sesión con Google"**: Botón con efectos hover
3. **✅ Autorización**: Permite acceso a tus hojas de cálculo
4. **🎉 ¡Listo para usar!**: Acceso inmediato a todas las funcionalidades

### 💰 **Gestión de Registros**

#### **➕ Crear Nuevo Registro**

- **🎯 Botón Principal**: "Nuevo Registro" con colores dinámicos
- **📋 Modal de Formulario**: Interfaz limpia sin alerts del navegador
- **⚖️ Tipo de Transacción**: Selector visual entre Gasto (💸) e Ingreso (💰)
- **🏷️ Categorías Inteligentes**: Se adaptan automáticamente al tipo seleccionado
- **✅ Validación Visual**: Errores mostrados en panel elegante con iconos

#### **✏️ Editar Registros**

- **🔄 Modal de Edición**: Misma interfaz que creación
- **📊 Auto-detección de Tipo**: Basado en la categoría existente
- **💡 Montos Absolutos**: Se muestran sin signo negativo para mejor UX
- **🚫 Sin Modificación Forzada**: No es necesario cambiar el monto al editar

#### **🗑️ Eliminar Registros**

- **⚠️ Modal de Confirmación**: Muestra todos los datos del registro
- **📋 Vista Previa**: Descripción, categoría, monto y fecha
- **🔴 Confirmación Visual**: Botón rojo con efectos hover
- **❌ Cancelación Fácil**: Botón gris para cancelar

### 📊 **Análisis y Métricas**

#### **� Página de Métricas Dedicada**

- **🧭 Navegación**: Acceso desde menú principal
- **📊 Resúmenes Completos**: Totales generales, mensuales y anuales
- **🏆 Top Categorías**: Ranking visual con barras de progreso animadas
- **💳 Análisis de Métodos**: Uso detallado de formas de pago
- **⚖️ Balance Inteligente**: Cálculo automático con indicadores de color

#### **🎯 Métricas Disponibles**

- **💰 Total General**: Suma de todos los ingresos y gastos
- **📅 Mes Actual**: Análisis del período corriente
- **📆 Año Actual**: Resumen anual en curso
- **📈 Tendencias**: Identificación de patrones de gasto

### 🔍 **Filtros y Búsqueda Avanzados**

#### **🔎 Sistema de Búsqueda**

- **📝 Campo Principal**: Búsqueda por descripción (placeholder dinámico)
- **🔄 Búsqueda en Tiempo Real**: Resultados instantáneos al escribir
- **🎯 Multi-campo**: Busca en descripción, categoría, método de pago, etc.

#### **🏷️ Filtros Inteligentes**

- **👁️ Toggle de Visibilidad**: Botón "Filtrar" para mostrar/ocultar opciones
- **📂 Filtro por Categoría**: Dropdown con todas las categorías disponibles
- **⚖️ Filtro por Tipo**: "Solo Gastos", "Solo Ingresos", "Todos"
- **🔄 Limpiar Filtros**: Botón para resetear todos los filtros

#### **📄 Paginación Profesional**

- **📋 10 Registros por Página**: Navegación optimizada
- **⬅️➡️ Navegación**: Botones anterior/siguiente con estados
- **📊 Información de Página**: "Página X de Y" con total de registros
- **🔢 Numeración Visual**: Indicadores de página actual

## 🛠️ Tecnologías Utilizadas

### 🚀 **Frontend Stack**

- **⚛️ React 19**: Framework moderno con las últimas características
- **⚡ Vite**: Build tool ultrarrápido con HMR
- **🧭 React Router DOM**: Navegación SPA con catch-all routes
- **🎨 Tailwind CSS**: Framework CSS utility-first con tema personalizado

### 🔗 **Integración Backend**

- **📊 Google Sheets API v4**: Integración directa como base de datos
- **🔐 Google Identity Services**: OAuth2 moderna (reemplaza gapi.auth2 deprecated)
- **🛡️ Variables de Entorno**: Gestión segura de credenciales con Vite

### 🎨 **UI/UX Avanzado**

- **🎭 Modal System**: Componentes modales reutilizables (Modal.jsx, ExpenseFormModal.jsx, ConfirmModal.jsx)
- **✨ Animaciones CSS**: Efectos personalizados (fadeIn, gradientShift, float)
- **🎨 Paleta Verde-Morado**: Esquema de colores profesional y moderno
- **📱 Responsive Design**: Completamente adaptable desde móvil hasta desktop

### 🏗️ **Arquitectura de Código**

- **🔧 Custom Hooks**: useGoogleSheets para manejo de estado
- **🧩 Componentes Modulares**: Separación clara de responsabilidades
- **📚 Constantes Centralizadas**: expenseConstants.js para configuración
- **🛠️ Servicios**: GoogleSheetsService para API calls

## 📊 Estructura del Proyecto

```
📁 src/
├── 🧩 components/
│   ├── 📝 ExpenseForm.jsx         # Formulario con validación avanzada
│   ├── 📋 ExpenseTable.jsx        # Tabla con filtros y paginación
│   ├── 📊 MetricsPage.jsx         # Dashboard completo de métricas
│   ├── 🧭 Navigation.jsx          # Navegación responsive
│   ├── 🪟 Modal.jsx               # Componente modal base
│   ├── 📝 ExpenseFormModal.jsx    # Modal wrapper para formulario
│   └── ⚠️ ConfirmModal.jsx        # Modal de confirmación con datos
├── 📄 pages/
│   └── 💰 ExpensesPage.jsx        # Página principal de gestión
├── 📚 constants/
│   └── 🔧 expenseConstants.js     # Constantes, categorías y utils
├── 🎣 hooks/
│   └── 📊 useGoogleSheets.js      # Hook para manejo de Google Sheets
├── 🔗 services/
│   └── 🔐 googleSheetsService.js  # Servicio API con autenticación moderna
├── 🎨 index.css                   # Estilos globales y animaciones
└── ⚛️ App.jsx                     # Componente raíz con routing
```

### 🏗️ **Arquitectura de Componentes**

#### **🔄 Flujo de Datos**

```
App.jsx → useGoogleSheets → GoogleSheetsService → Google Sheets API
   ↓           ↓                    ↓
ExpensesPage → ExpenseTable    ExpenseFormModal
                   ↓                ↓
              ConfirmModal     ExpenseForm
```

#### **🎯 Responsabilidades**

- **📊 useGoogleSheets**: Estado global, operaciones CRUD
- **🔐 GoogleSheetsService**: Autenticación, API calls
- **📝 ExpenseForm**: Validación, manejo de formularios
- **📋 ExpenseTable**: Visualización, filtros, paginación
- **🪟 Modal System**: UX moderna sin alerts del navegador

## 🎨 Características de Diseño

### 🌈 **Paleta de Colores Verde-Morado**

#### **💰 Ingresos (Verde)**

```css
bg-green-500, hover:bg-green-600    /* Botones principales */
text-green-600, border-green-500    /* Textos e indicadores */
focus:ring-green-500               /* Estados de foco */
```

#### **💸 Gastos (Morado)**

```css
bg-purple-500, hover:bg-purple-600  /* Botones principales */
text-purple-600, border-purple-500  /* Textos e indicadores */
focus:ring-purple-500              /* Estados de foco */
```

#### **🎯 Elementos de Interfaz**

```css
bg-blue-500, hover:bg-blue-600     /* Navegación y acciones */
bg-gray-100, text-gray-700         /* Elementos neutros */
bg-red-500, hover:bg-red-600       /* Acciones destructivas */
```

### ✨ **Animaciones Personalizadas**

#### **🎭 Efectos CSS**

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

#### **📱 Interactividad**

- **🖱️ Hover Effects**: Transiciones suaves en botones y cards
- **🎯 Focus States**: Anillos de color para accesibilidad
- **💫 Loading States**: Spinners y animaciones de carga
- **📱 Touch Friendly**: Elementos táctiles optimizados para móvil

### 🎭 **Iconos y Elementos Visuales**

#### **💰 Transacciones**

- 💸 **Gastos** | 💰 **Ingresos** | ⚖️ **Balance**
- 📅 **Fechas** | 🏷️ **Categorías** | 💳 **Métodos de Pago**

#### **🔧 Acciones**

- ➕ **Crear** | ✏️ **Editar** | 🗑️ **Eliminar**
- 🔍 **Buscar** | 🔄 **Filtrar** | 📊 **Analizar**

#### **📊 Métricas**

- 📈 **Crecimiento** | 📉 **Decrecimiento** | 🎯 **Objetivos**
- 🏆 **Top Rankings** | 📋 **Resúmenes** | ⚡ **Insights**

## 🔧 Configuración Avanzada

### Variables de Entorno

Crea un archivo `.env`:

```
VITE_GOOGLE_API_KEY=tu-api-key
VITE_GOOGLE_CLIENT_ID=tu-client-id
VITE_SPREADSHEET_ID=tu-spreadsheet-id
```

### Personalización de Categorías

Edita `src/constants/expenseConstants.js` para modificar:

- Categorías de gastos e ingresos
- Métodos de pago disponibles
- Gestores de pago
- Usuarios que pueden registrar

## 🚨 Solución de Problemas

### 🔐 **Errores de Autenticación**

#### **❌ "Failed to initialize Google API"**

```bash
✅ Verifica que las credenciales sean correctas en .env
✅ Confirma que el dominio esté autorizado en Google Cloud Console
✅ Asegúrate de que la Google Sheets API esté habilitada
✅ Revisa que VITE_GOOGLE_CLIENT_ID no tenga espacios extra
```

#### **❌ "Redirect URI mismatch"**

```bash
✅ Agrega http://localhost:5173 a dominios autorizados
✅ Para producción, agrega tu dominio real
✅ No incluyas rutas, solo el dominio base
```

### 📊 **Problemas de Sincronización**

#### **❌ "Can't access spreadsheet"**

```bash
✅ Verifica el VITE_GOOGLE_SPREADSHEET_ID en .env
✅ Asegúrate de que la hoja sea accesible para tu cuenta
✅ Confirma que los permisos de edición estén activados
✅ Revisa que la hoja no esté en modo "Solo lectura"
```

#### **❌ "Headers don't match"**

```bash
✅ Los headers deben estar exactamente así:
   Date | Description | Category | How Much? | What payment method? | payment manager | who recorded
✅ Sin espacios extra, mayúsculas/minúsculas exactas
✅ Primera fila de la hoja debe contener solo los headers
```

### 🎯 **Errores de Formato**

#### **❌ "Invalid amount format"**

```bash
✅ Los montos se formatean automáticamente
✅ Acepta: 45.50, 45,50, 45 (sin símbolos de moneda)
✅ El sistema agregará automáticamente el signo negativo para gastos
```

#### **❌ "Category not found"**

```bash
✅ Usa solo categorías definidas en expenseConstants.js
✅ Para gastos: Comida, Transporte, Renta, etc.
✅ Para ingresos: Salario, Freelance, Bonos, etc.
✅ Respeta mayúsculas y minúsculas exactas
```

### 🔧 **Problemas de Desarrollo**

#### **❌ "Environment variables not loaded"**

```bash
✅ Archivo .env debe estar en la raíz del proyecto
✅ Variables deben empezar con VITE_ para ser accesibles
✅ Reinicia el servidor de desarrollo después de cambios
✅ No uses comillas en los valores del .env
```

#### **❌ "Build errors"**

```bash
✅ Ejecuta: npm install para actualizar dependencias
✅ Borra node_modules y reinstala si es necesario
✅ Verifica que todas las variables de entorno estén configuradas
✅ Revisa la consola del navegador para errores específicos
```

### 🆘 **Soporte Adicional**

#### **🔍 Debug Mode**

```javascript
// Agrega esto temporalmente en App.jsx para debug
console.log("Config:", {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY ? "✅ Set" : "❌ Missing",
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing",
  spreadsheetId: import.meta.env.VITE_GOOGLE_SPREADSHEET_ID
    ? "✅ Set"
    : "❌ Missing",
});
```

#### **📋 Checklist de Verificación**

- [ ] ✅ Google Cloud Console configurado correctamente
- [ ] ✅ APIs habilitadas (Google Sheets API)
- [ ] ✅ Credenciales OAuth2 creadas
- [ ] ✅ Dominios autorizados configurados
- [ ] ✅ Variables de entorno en .env
- [ ] ✅ Headers de Google Sheet exactos
- [ ] ✅ Permisos de edición en la hoja

## 🎯 Próximas Características

### 📈 **Análisis Avanzado**

- [ ] � **Gráficos Interactivos**: Chart.js para visualización de datos
- [ ] � **Análisis Temporal**: Tendencias mensuales y comparativas
- [ ] 🎯 **Metas de Ahorro**: Establecer y trackear objetivos financieros
- [ ] � **Reportes PDF**: Exportación de resúmenes mensuales

### 📱 **Experiencia Móvil**

- [ ] 📲 **PWA Completa**: Instalación en dispositivos móviles
- [ ] 🔔 **Notificaciones Push**: Recordatorios de gastos límite
- [ ] 📸 **Captura de Recibos**: OCR para extracción automática de datos
- [ ] � **Gestos Táctiles**: Swipe para editar/eliminar en móvil

### 🤖 **Inteligencia Artificial**

- [ ] 🧠 **Categorización Automática**: IA para clasificar gastos
- [ ] 💡 **Insights Inteligentes**: Sugerencias basadas en patrones
- [ ] � **Predicciones**: Proyecciones de gastos futuros
- [ ] 🎯 **Detección de Anomalías**: Alertas para gastos inusuales

### 👥 **Funcionalidades Colaborativas**

- [ ] 🤝 **Multi-usuario**: Gestión familiar de gastos
- [ ] 🔒 **Roles y Permisos**: Admin, Editor, Visualizador
- [ ] 💬 **Comentarios**: Notas en transacciones
- [ ] 📤 **Compartir Reportes**: Enlaces públicos para resúmenes

### 💱 **Funcionalidades Avanzadas**

- [ ] 🌍 **Multi-moneda**: Soporte para diferentes divisas
- [ ] 📊 **Múltiples Hojas**: Separación por cuentas bancarias
- [ ] 🔄 **Transacciones Recurrentes**: Automatización de gastos fijos
- [ ] 📈 **Dashboard Ejecutivo**: KPIs y métricas avanzadas

## 📄 **Licencia y Copyright**

### 📜 **Información Legal**

```
MIT License

Copyright (c) 2025 Alaskechufles

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 🏢 **Detalles del Proyecto**

- **👨‍💻 Autor**: Alaskechufles
- **📅 Año**: 2025
- **🔖 Versión**: 1.0.0
- **📋 Licencia**: MIT License
- **🌐 Repositorio**: expenses-api-google
- **📧 Soporte**: Ver [COPYRIGHT](COPYRIGHT) para más información

### ✅ **Términos de Uso**

#### **Permisos Otorgados:**

- ✅ **Uso Comercial**: Libre uso en proyectos comerciales
- ✅ **Modificación**: Adaptar el código a tus necesidades
- ✅ **Distribución**: Compartir y redistribuir libremente
- ✅ **Uso Privado**: Uso personal sin restricciones

#### **Condiciones Requeridas:**

- 📋 **Aviso de Copyright**: Mantener en todas las copias
- 📋 **Texto de Licencia**: Incluir en distribuciones

#### **Limitaciones:**

- ❌ **Sin Garantías**: Software proporcionado "como está"
- ❌ **Sin Responsabilidad**: Autor no responsable por daños

---

## 🚀 **Comenzar Ahora**

### **🎯 Pasos Rápidos:**

1. **📥 Clona el repositorio**
2. **⚙️ Configura Google Cloud Console**
3. **🔑 Agrega variables de entorno**
4. **📊 Prepara tu Google Sheet**
5. **🚀 Ejecuta `npm run dev`**
6. **💰 ¡Gestiona tus finanzas!**

### **📞 ¿Necesitas Ayuda?**

- 📖 **Documentación**: Lee esta guía completa
- 🐛 **Issues**: Reporta problemas en GitHub
- 💡 **Sugerencias**: Propón nuevas características
- 📧 **Contacto**: Ver información en [COPYRIGHT](COPYRIGHT)

---

**🎉 ¡Disfruta gestionando tus finanzas de manera inteligente y elegante!**
