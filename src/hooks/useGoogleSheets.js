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
 * @file useGoogleSheets.js
 * @description Hook personalizado para gestionar la integración con Google Sheets API.
 *              Maneja autenticación, operaciones CRUD y estado de la aplicación.
 * @author Alaskechufles
 * @version 1.0.0
 * @since 2025-07-22
 * @license MIT
 */

import { useState, useEffect } from "react";
import GoogleSheetsService from "../services/googleSheetsService";

/**
 * Hook personalizado para gestionar Google Sheets
 * @param {Object} config - Configuración para Google Sheets API
 * @param {string} config.apiKey - Clave de API de Google
 * @param {string} config.clientId - ID del cliente OAuth
 * @param {string} config.spreadsheetId - ID de la hoja de cálculo
 * @returns {Object} Estado y funciones para manejar Google Sheets
 */
const useGoogleSheets = (config) => {
  const [sheetsService] = useState(() => new GoogleSheetsService());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configuración por defecto
  const defaultConfig = {
    apiKey: "", // Tu API Key
    clientId: "", // Tu Client ID
    discoveryDoc: "https://sheets.googleapis.com/$discovery/rest?version=v4",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
    spreadsheetId: "", // ID de tu hoja de cálculo
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Inicializar el servicio
  useEffect(() => {
    const initializeService = async () => {
      try {
        setLoading(true);
        await sheetsService.initialize(
          finalConfig.apiKey,
          finalConfig.clientId,
          finalConfig.discoveryDoc,
          finalConfig.scopes
        );

        if (finalConfig.spreadsheetId) {
          sheetsService.setSpreadsheetId(finalConfig.spreadsheetId);
        }

        setIsInitialized(true);
        setIsSignedIn(sheetsService.isSignedIn());
      } catch (err) {
        setError(`Error inicializando: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (finalConfig.apiKey && finalConfig.clientId) {
      initializeService();
    }
  }, [
    finalConfig.apiKey,
    finalConfig.clientId,
    finalConfig.discoveryDoc,
    finalConfig.scopes,
    finalConfig.spreadsheetId,
    sheetsService,
  ]);

  // Iniciar sesión
  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const success = await sheetsService.signIn();
      if (success) {
        setIsSignedIn(sheetsService.isSignedIn());
        await loadData(); // Cargar datos después del login
      }
    } catch (err) {
      setError(
        `Error al iniciar sesión: ${
          err.message || err.error || "Error desconocido"
        }`
      );
      setIsSignedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const signOut = async () => {
    try {
      setLoading(true);
      await sheetsService.signOut();
      setIsSignedIn(false);
      setData([]);
      setHeaders([]);
    } catch (err) {
      setError(`Error al cerrar sesión: ${err.message || "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await sheetsService.getDataWithHeaders();
      setHeaders(result.headers);
      setData(result.rows);
    } catch (err) {
      setError(`Error cargando datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva fila
  const createRow = async (rowData) => {
    try {
      setLoading(true);
      setError(null);

      // Convertir objeto a array en el orden de los headers
      const values = headers.map((header) => rowData[header] || "");

      await sheetsService.createRow(values);
      await loadData(); // Recargar datos
      return true;
    } catch (err) {
      setError(`Error creando fila: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar fila
  const updateRow = async (rowIndex, rowData) => {
    try {
      setLoading(true);
      setError(null);

      // Convertir objeto a array en el orden de los headers
      const values = headers.map((header) => rowData[header] || "");
      const range = `A${rowIndex}:${String.fromCharCode(
        65 + headers.length - 1
      )}${rowIndex}`;

      await sheetsService.updateRow(range, values);
      await loadData(); // Recargar datos
      return true;
    } catch (err) {
      setError(`Error actualizando fila: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar fila
  const deleteRow = async (rowIndex) => {
    try {
      setLoading(true);
      setError(null);

      const range = `A${rowIndex}:${String.fromCharCode(
        65 + headers.length - 1
      )}${rowIndex}`;
      await sheetsService.deleteRow(range);
      await loadData(); // Recargar datos
      return true;
    } catch (err) {
      setError(`Error eliminando fila: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar filas
  const searchRows = async (searchColumn, searchValue) => {
    try {
      setError(null);
      return await sheetsService.searchRows(searchColumn, searchValue);
    } catch (err) {
      setError(`Error buscando: ${err.message}`);
      return [];
    }
  };

  // ============ FUNCIONES PARA PRESUPUESTOS ============

  /**
   * Guarda el presupuesto de un mes específico
   * @param {string} month - Mes en formato YYYY-MM
   * @param {Object} budgetData - Datos del presupuesto
   * @returns {Promise<boolean>} True si se guardó exitosamente
   */
  const saveBudget = async (month, budgetData) => {
    try {
      setLoading(true);
      setError(null);
      await sheetsService.saveBudget(month, budgetData);
      return true;
    } catch (err) {
      setError(`Error guardando presupuesto: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga el presupuesto de un mes específico
   * @param {string} month - Mes en formato YYYY-MM
   * @returns {Promise<Object>} Datos del presupuesto
   */
  const loadBudget = async (month) => {
    try {
      setLoading(true);
      setError(null);
      const budget = await sheetsService.loadBudget(month);
      return budget;
    } catch (err) {
      setError(`Error cargando presupuesto: ${err.message}`);
      return {};
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene todos los meses con presupuestos guardados
   * @returns {Promise<Array<string>>} Array de meses
   */
  const getBudgetMonths = async () => {
    try {
      setError(null);
      return await sheetsService.getBudgetMonths();
    } catch (err) {
      setError(`Error obteniendo meses: ${err.message}`);
      return [];
    }
  };

  return {
    // Estado
    isInitialized,
    isSignedIn,
    data,
    headers,
    loading,
    error,

    // Métodos de autenticación
    signIn,
    signOut,

    // Métodos CRUD
    loadData,
    createRow,
    updateRow,
    deleteRow,
    searchRows,

    // Métodos de presupuestos
    saveBudget,
    loadBudget,
    getBudgetMonths,

    // Servicio directo (para operaciones avanzadas)
    sheetsService,
  };
};

export default useGoogleSheets;
