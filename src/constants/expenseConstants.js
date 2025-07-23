/**
 * Copyright (c) 2025 Alaskechufles
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @file expenseConstants.js
 * @description Constantes y utilidades para la gestión de gastos e ingresos.
 *              Define categorías, métodos de pago, gestores y funciones de formato.
 * @author Alaskechufles
 * @version 1.0.0
 * @since 2025-07-22
 * @license MIT
 */

/**
 * Tipos de transacciones disponibles en la aplicación
 * @constant {Object}
 */
export const TRANSACTION_TYPES = {
  EXPENSE: "Gasto",
  INCOME: "Ingreso",
};

/**
 * Categorías disponibles para gastos
 * @constant {string[]}
 */
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

/**
 * Categorías disponibles para ingresos
 * @constant {string[]}
 */
export const INCOME_CATEGORIES = [
  "Sigrid Mendel",
  "Sigrid Anglo",
  "Sigrid otro",
  "Diego Pathway",
  "Diego Funval",
  "Diego Anglo",
  "Diego otro",
];

/**
 * Métodos de pago disponibles en la aplicación
 * @constant {string[]}
 */
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

/**
 * Gestores de pago disponibles
 * @constant {string[]}
 */
export const PAYMENT_MANAGERS = [
  "Fam Huarsaya Berlanga",
  "Mamá de Sigrid",
  "Fam de Diego",
  "Otros",
];

/**
 * Usuarios que pueden registrar transacciones
 * @constant {string[]}
 */
export const RECORDERS = ["Sigrid", "Diego"];

/**
 * Headers de la hoja de cálculo (deben coincidir exactamente con Google Sheets)
 * @constant {string[]}
 */
export const SHEET_HEADERS = [
  "Date",
  "Description",
  "Category",
  "How Much?",
  "What payment method?",
  "payment manager",
  "who recorded",
];

/**
 * Formatea una fecha para el formulario
 * @param {string|Date} [date] - Fecha a formatear
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const formatDate = (date) => {
  if (!date) return new Date().toISOString().split("T")[0];
  return new Date(date).toISOString().split("T")[0];
};

/**
 * Formatea un número como moneda peruana (PEN)
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada con símbolo de moneda
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount);
};

/**
 * Parsea un valor de texto a número para montos
 * @param {string|number} value - Valor a parsear
 * @returns {number} Valor numérico parseado o 0 si no es válido
 */
export const parseAmount = (value) => {
  if (!value) return 0;

  // Convertir a string para procesamiento
  let stringValue = value.toString().trim();

  // Si ya es un número válido, devolverlo
  if (!isNaN(stringValue) && !isNaN(parseFloat(stringValue))) {
    return parseFloat(stringValue);
  }

  // Remover símbolos de moneda (S/, $) y espacios, pero preservar puntos y comas para decimales
  let cleaned = stringValue.replace(/[S/$\s]/g, "");

  // Detectar si usa coma como separador decimal (formato europeo/latinoamericano)
  // Si hay una coma después del último punto, o solo hay coma, es separador decimal
  const lastDotIndex = cleaned.lastIndexOf(".");
  const lastCommaIndex = cleaned.lastIndexOf(",");

  if (lastCommaIndex > lastDotIndex) {
    // La coma está después del punto o es el único separador decimal
    // Reemplazar todas las comas anteriores (separadores de miles) por nada
    // y la última coma por punto decimal
    cleaned = cleaned.replace(/,(?=.*,)/g, "").replace(",", ".");
  } else if (lastDotIndex > lastCommaIndex && lastCommaIndex !== -1) {
    // El punto está después de la coma, entonces las comas son separadores de miles
    cleaned = cleaned.replace(/,/g, "");
  }

  // Parsear el resultado final
  const result = parseFloat(cleaned);

  // Verificar que es un número válido
  return isNaN(result) ? 0 : result;
};

/**
 * Formatea un número para mostrar en el input del formulario
 * @param {string|number} value - Valor a formatear
 * @returns {string} Valor formateado para el input
 */
export const formatInputAmount = (value) => {
  if (!value || value === "0" || value === 0) return "";

  const numericValue = parseAmount(value);
  if (numericValue === 0) return "";

  // Formatear con máximo 2 decimales, eliminando ceros innecesarios
  return numericValue.toFixed(2).replace(/\.?0+$/, "");
};
