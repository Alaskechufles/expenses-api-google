# 💼 ExpenseTracker - Gestor de Gastos e Ingresos

Una aplicación React moderna para gestionar tus finanzas personales conectada directamente con Google Sheets. Registra gastos e ingresos, visualiza métricas detalladas y mantén el control total de tus finanzas.

## ✨ Características Principales

### 💰 Gestión de Finanzas

- **Registro de Gastos e Ingresos**: Formulario intuitivo con categorización automática
- **Campos Específicos**: Fecha, Descripción, Categoría, Monto, Método de Pago, Gestor, Usuario
- **Validación Inteligente**: Diferenciación automática entre gastos (negativos) e ingresos (positivos)
- **Categorías Predefinidas**: Para gastos (Alimentación, Transporte, etc.) e ingresos (Salario, Freelance, etc.)

### 📊 Métricas y Análisis

- **Dashboard de Métricas**: Página dedicada con análisis detallados
- **Resúmenes Temporales**: Totales mensuales, anuales y generales
- **Análisis por Categorías**: Top categorías de gastos e ingresos con barras de progreso
- **Métricas de Métodos de Pago**: Análisis del uso de diferentes métodos de pago
- **Balance en Tiempo Real**: Cálculo automático de ingresos - gastos

### 🎨 Interfaz Moderna

- **Diseño con Tailwind CSS**: Interfaz limpia y responsiva
- **Navegación con React Router**: Páginas separadas para gastos y métricas
- **Filtros Avanzados**: Búsqueda por múltiples campos, filtros por categoría y tipo
- **Indicadores Visuales**: Colores diferenciados para gastos (rojo) e ingresos (verde)

### 🔐 Integración con Google Sheets

- **Google Identity Services**: Autenticación moderna y segura
- **Sincronización en Tiempo Real**: Cambios reflejados inmediatamente en Google Sheets
- **Estructura Compatible**: Headers específicos para datos financieros

## 🎯 Estructura de Google Sheet

Tu hoja de cálculo debe tener estos headers exactos en la primera fila:

```
| Date | Description | Category | How Much? | What payment method? | payment manager | who recorded |
```

### Ejemplo de datos:

```
| 2024-01-15 | Compra supermercado | Alimentación | -45.50 | Tarjeta de Débito | BBVA | Usuario 1 |
| 2024-01-15 | Salario enero | Salario | 2500.00 | Transferencia Bancaria | Banco Santander | Usuario 1 |
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

### 3. Configurar la aplicación

Edita `src/App.jsx` y actualiza la configuración:

```javascript
const config = {
  apiKey: "TU_API_KEY_AQUI",
  clientId: "TU_CLIENT_ID_AQUI",
  spreadsheetId: "TU_SPREADSHEET_ID_AQUI",
};
```

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

### Autenticación

1. Haz clic en "Iniciar Sesión con Google"
2. Autoriza el acceso a tus hojas de cálculo
3. ¡Listo para usar!

### Gestión de Registros

- **➕ Nuevo Registro**: Formulario con campos específicos para finanzas
- **Tipo de Transacción**: Selector visual entre Gasto (💸) e Ingreso (💰)
- **Categorías Inteligentes**: Se adaptan según el tipo seleccionado
- **✏️ Editar**: Modifica cualquier registro existente
- **🗑️ Eliminar**: Borra registros con confirmación

### Análisis y Métricas

- **📊 Página de Métricas**: Navegación desde el menú principal
- **Resúmenes**: Totales generales, mensuales y anuales
- **Top Categorías**: Ranking de gastos e ingresos con barras visuales
- **Métodos de Pago**: Análisis del uso de diferentes formas de pago
- **Balance**: Cálculo automático con indicadores de color

### Filtros y Búsqueda

- **Búsqueda**: Por descripción, categoría, método de pago, etc.
- **Filtro por Categoría**: Selecciona categorías específicas
- **Filtro por Tipo**: Solo gastos, solo ingresos, o todos
- **🔄 Limpiar Filtros**: Resetea todos los filtros aplicados

## 🛠️ Tecnologías Utilizadas

- **React 19** + **Vite**: Framework moderno y rápido
- **React Router Dom**: Navegación entre páginas
- **Tailwind CSS**: Diseño utilitario y responsivo
- **Google Sheets API v4**: Integración directa con hojas de cálculo
- **Google Identity Services**: Autenticación OAuth2 moderna

## 📊 Estructura del Proyecto

```
src/
├── components/
│   ├── ExpenseForm.jsx         # Formulario específico para gastos/ingresos
│   ├── ExpenseTable.jsx        # Tabla con filtros avanzados
│   ├── MetricsPage.jsx         # Dashboard de métricas
│   └── Navigation.jsx          # Barra de navegación
├── pages/
│   └── ExpensesPage.jsx        # Página principal de gestión
├── constants/
│   └── expenseConstants.js     # Constantes y utilidades
├── hooks/
│   └── useGoogleSheets.js      # Hook personalizado para Google Sheets
├── services/
│   └── googleSheetsService.js  # Servicio de API con GIS
└── App.jsx                     # Componente principal con routing
```

## 🎨 Características de Diseño

### Paleta de Colores

- **Gastos**: Rojos (#dc3545, #ef4444)
- **Ingresos**: Verdes (#28a745, #10b981)
- **Interfaz**: Azules (#3b82f6, #2563eb)
- **Neutros**: Grises para fondos y texto

### Iconos y Elementos Visuales

- 💸 Gastos | 💰 Ingresos | 📊 Métricas
- 📅 Fechas | 🏷️ Categorías | 💳 Métodos de Pago
- Barras de progreso para métricas
- Animaciones suaves con Tailwind

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

### Error de Autenticación

- Verifica que las credenciales sean correctas
- Confirma que el dominio esté autorizado en Google Cloud
- Revisa que la Google Sheets API esté habilitada

### Problemas de Sincronización

- Comprueba el Spreadsheet ID
- Verifica los permisos de la hoja de cálculo
- Asegúrate de que los headers coincidan exactamente

### Errores de Formato

- Los montos deben ser números (se formatean automáticamente)
- Las fechas deben estar en formato YYYY-MM-DD
- Las categorías deben existir en las constantes definidas

## 🎯 Próximas Características

- [ ] 📈 Gráficos interactivos con Chart.js
- [ ] 📱 PWA para uso móvil
- [ ] 📊 Exportación a PDF/Excel
- [ ] 🔔 Notificaciones de límites de gasto
- [ ] 👥 Soporte para múltiples usuarios
- [ ] 💱 Conversión de monedas
- [ ] 📸 Captura de recibos con OCR
- [ ] 🤖 Categorización automática con IA

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.
