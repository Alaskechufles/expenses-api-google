// Tipos de transacciones
export const TRANSACTION_TYPES = {
  EXPENSE: "Gasto",
  INCOME: "Ingreso",
};

// Categorías de gastos
export const EXPENSE_CATEGORIES = [
  "Donaciones",
  "Transporte",
  "Entretenimiento",
  "Renta",
  "Ahorros",
  "Comida",
  "Educación",
  "Salud",
  "Artículos del hogar",
  "Servicios",
  "Artículos de trabajo",
  "Regalos",
  "Prestamos",
  "Deudas",
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
  "Sigrid Interbank",
  "Sigrid OH",
  "Sigrid BCP Amex",
  "Sigrid BCP Visa",
  "Sigrid BBVA",
  "Sigrid Yape/plin/débito",
  "Diego Yape/plin/débito",
  "Diego BBVA dolares débito",
];

// Gestores de pago
export const PAYMENT_MANAGERS = [
  "Fam Huarsaya Berlanga",
  "Mamá de Sigrid",
  "Fam de Diego",
  "Otros",
];

// Usuarios que pueden registrar
export const RECORDERS = ["Sigrid", "Diego"];

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
