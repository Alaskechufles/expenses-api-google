// Tipos de transacciones
export const TRANSACTION_TYPES = {
  EXPENSE: "Gasto",
  INCOME: "Ingreso",
};

// Categorías de gastos
export const EXPENSE_CATEGORIES = [
  "Alimentación",
  "Transporte",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Hogar",
  "Ropa",
  "Tecnología",
  "Servicios",
  "Otros",
];

// Categorías de ingresos
export const INCOME_CATEGORIES = [
  "Salario",
  "Freelance",
  "Inversiones",
  "Ventas",
  "Bonos",
  "Regalos",
  "Otros",
];

// Métodos de pago
export const PAYMENT_METHODS = [
  "Efectivo",
  "Tarjeta de Débito",
  "Tarjeta de Crédito",
  "Transferencia Bancaria",
  "PayPal",
  "Bizum",
  "Otros",
];

// Gestores de pago
export const PAYMENT_MANAGERS = [
  "Banco Santander",
  "BBVA",
  "CaixaBank",
  "ING",
  "Revolut",
  "N26",
  "PayPal",
  "Efectivo",
  "Otros",
];

// Usuarios que pueden registrar
export const RECORDERS = [
  "Usuario 1",
  "Usuario 2",
  "Usuario 3",
  "Administrador",
];

// Headers de la hoja de cálculo (deben coincidir exactamente con tu Google Sheet)
export const SHEET_HEADERS = [
  "Date",
  "Description",
  "Category",
  "How Much?",
  "What payment method?",
  "payment manager",
  "who recorded",
];

// Función para formatear fecha
export const formatDate = (date) => {
  if (!date) return new Date().toISOString().split("T")[0];
  return new Date(date).toISOString().split("T")[0];
};

// Función para formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount);
};

// Función para parsear cantidad
export const parseAmount = (value) => {
  if (!value) return 0;
  // Remover símbolos de moneda y espacios, reemplazar comas por puntos
  const cleaned = value
    .toString()
    .replace(/[S/.$,\s]/g, "")
    .replace(",", ".");
  return parseFloat(cleaned) || 0;
};
