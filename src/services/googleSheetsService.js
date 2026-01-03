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
 * @file googleSheetsService.js
 * @description Servicio para integración con Google Sheets API v4.
 *              Maneja autenticación OAuth2, operaciones CRUD y gestión de datos.
 * @author Alaskechufles
 * @version 1.0.0
 * @since 2025-07-22
 * @license MIT
 */

/**
 * Servicio para gestionar la integración con Google Sheets API
 * @class GoogleSheetsService
 */
class GoogleSheetsService {
  /**
   * Constructor del servicio de Google Sheets
   */
  constructor() {
    this.gapi = null;
    this.google = null;
    this.tokenClient = null;
    this.accessToken = null;
    this.spreadsheetId = ""; // Tu ID de la hoja de cálculo
    this.range = "A1:Z1000"; // Rango de datos
    this.mainSheetName = "Sheet1"; // Nombre de la hoja principal (puede ser configurado)
    this.isInitialized = false;
    this.isSignedInState = false;
    this.budgetSheetChecked = false; // Cache para evitar verificar la hoja repetidamente
    this.pendingRequests = new Map(); // Para evitar solicitudes duplicadas
  }

  // Inicializar Google API con la nueva Google Identity Services
  async initialize(apiKey, clientId, discoveryDoc, scopes) {
    try {
      if (this.isInitialized) return;

      // Cargar Google API
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Cargar Google Identity Services
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Inicializar gapi client
      await new Promise((resolve) => {
        window.gapi.load("client", resolve);
      });

      await window.gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: [discoveryDoc],
      });

      // Inicializar token client para OAuth2
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: scopes,
        callback: (response) => {
          if (response.error !== undefined) {
            throw response;
          }
          this.accessToken = response.access_token;
          this.isSignedInState = true;
          console.log("Token de acceso obtenido");
        },
      });

      this.gapi = window.gapi;
      this.google = window.google;
      this.isInitialized = true;
      console.log("Google Sheets API inicializada correctamente con GIS");
    } catch (error) {
      console.error("Error inicializando Google Sheets API:", error);
      throw error;
    }
  }

  // Verificar si el usuario está autenticado
  isSignedIn() {
    return this.isSignedInState && this.accessToken !== null;
  }

  // Iniciar sesión con la nueva API
  async signIn() {
    try {
      if (this.accessToken) {
        // Verificar si el token aún es válido
        return true;
      }

      return new Promise((resolve, reject) => {
        this.tokenClient.callback = (response) => {
          if (response.error !== undefined) {
            reject(response);
            return;
          }
          this.accessToken = response.access_token;
          this.isSignedInState = true;

          // Configurar el token para las requests
          this.gapi.client.setToken({
            access_token: this.accessToken,
          });

          console.log("Sesión iniciada correctamente");
          resolve(true);
        };
        this.tokenClient.requestAccessToken();
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  }

  // Cerrar sesión
  async signOut() {
    try {
      if (this.accessToken) {
        this.google.accounts.oauth2.revoke(this.accessToken, () => {
          console.log("Token revocado");
        });
      }

      this.accessToken = null;
      this.isSignedInState = false;
      this.gapi.client.setToken(null);

      console.log("Sesión cerrada correctamente");
      return true;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  }

  // Establecer el ID de la hoja de cálculo
  setSpreadsheetId(spreadsheetId) {
    this.spreadsheetId = spreadsheetId;
  }

  // Asegurar que el token esté configurado
  ensureTokenSet() {
    if (this.accessToken && this.isSignedIn()) {
      this.gapi.client.setToken({
        access_token: this.accessToken,
      });
    }
  }

  // READ - Leer datos de la hoja
  async readData(range = this.range, sheetName = null) {
    try {
      if (!this.isSignedIn()) {
        throw new Error("Usuario no autenticado");
      }

      this.ensureTokenSet();

      // Solo agregar el nombre de la hoja si se proporciona explícitamente
      let fullRange = range;
      if (sheetName) {
        fullRange = `${sheetName}!${range}`;
      }

      const response = await this.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: fullRange,
      });

      return response.result.values || [];
    } catch (error) {
      console.error("Error leyendo datos:", error);
      throw error;
    }
  }

  // CREATE - Agregar nueva fila
  async createRow(values, range = "A:Z", sheetName = null) {
    try {
      if (!this.isSignedIn()) {
        throw new Error("Usuario no autenticado");
      }

      this.ensureTokenSet();

      // Primero, obtener todos los datos para encontrar la última fila real con contenido
      const currentData = await this.readData(this.range, sheetName);
      
      // Encontrar la última fila que tiene al menos un valor no vacío
      let lastRowWithData = 0;
      for (let i = currentData.length - 1; i >= 0; i--) {
        const row = currentData[i];
        const hasData = row && row.some(cell => cell !== null && cell !== undefined && cell !== '');
        if (hasData) {
          lastRowWithData = i + 1; // +1 porque los índices empiezan en 0
          break;
        }
      }

      // La nueva fila será la siguiente después de la última con datos
      const newRowNumber = lastRowWithData + 1;
      
      // Construir el rango específico para la nueva fila
      const lastColumn = String.fromCharCode(64 + values.length); // A=65, así que 64+1=A
      let specificRange = `A${newRowNumber}:${lastColumn}${newRowNumber}`;
      if (sheetName) {
        specificRange = `${sheetName}!${specificRange}`;
      }

      // Usar UPDATE en lugar de APPEND para escribir en la posición específica
      const response = await this.gapi.client.sheets.spreadsheets.values.update(
        {
          spreadsheetId: this.spreadsheetId,
          range: specificRange,
          valueInputOption: "RAW",
          resource: {
            values: [values],
          },
        }
      );

      return response.result;
    } catch (error) {
      console.error("Error creando fila:", error);
      throw error;
    }
  }

  // UPDATE - Actualizar fila específica
  async updateRow(range, values, sheetName = null) {
    try {
      if (!this.isSignedIn()) {
        throw new Error("Usuario no autenticado");
      }

      this.ensureTokenSet();

      // Solo agregar el nombre de la hoja si se proporciona explícitamente
      let fullRange = range;
      if (sheetName) {
        fullRange = `${sheetName}!${range}`;
      }

      const response = await this.gapi.client.sheets.spreadsheets.values.update(
        {
          spreadsheetId: this.spreadsheetId,
          range: fullRange,
          valueInputOption: "RAW",
          resource: {
            values: [values],
          },
        }
      );

      return response.result;
    } catch (error) {
      console.error("Error actualizando fila:", error);
      throw error;
    }
  }

  // DELETE - Eliminar fila (limpiar contenido)
  async deleteRow(range, sheetName = null) {
    try {
      if (!this.isSignedIn()) {
        throw new Error("Usuario no autenticado");
      }

      this.ensureTokenSet();

      // Solo agregar el nombre de la hoja si se proporciona explícitamente
      let fullRange = range;
      if (sheetName) {
        fullRange = `${sheetName}!${range}`;
      }

      const response = await this.gapi.client.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: fullRange,
      });

      return response.result;
    } catch (error) {
      console.error("Error eliminando fila:", error);
      throw error;
    }
  }

  // Obtener datos en formato más manejable con headers
  async getDataWithHeaders() {
    try {
      const data = await this.readData();
      if (data.length === 0) return { headers: [], rows: [] };

      const headers = data[0];
      const rows = data.slice(1).map((row, index) => ({
        rowIndex: index + 2, // +2 porque empezamos desde la fila 2 (después del header)
        data: headers.reduce((obj, header, i) => {
          obj[header] = row[i] || "";
          return obj;
        }, {}),
      }));

      return { headers, rows };
    } catch (error) {
      console.error("Error obteniendo datos con headers:", error);
      throw error;
    }
  }

  // Buscar filas por criterio
  async searchRows(searchColumn, searchValue) {
    try {
      const { rows } = await this.getDataWithHeaders();
      return rows.filter(
        (row) =>
          row.data[searchColumn] &&
          row.data[searchColumn]
            .toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase())
      );
    } catch (error) {
      console.error("Error buscando filas:", error);
      throw error;
    }
  }

  // ============ FUNCIONES PARA PRESUPUESTOS ============

  /**
   * Maneja reintentos para errores 429 (rate limit)
   * @param {Function} apiCall - Función de API a ejecutar
   * @param {number} maxRetries - Número máximo de reintentos
   * @returns {Promise} Resultado de la llamada API
   */
  async retryWithBackoff(apiCall, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall();
      } catch (error) {
        const status = error.result?.error?.code || error.status;
        
        // Si es error 429 y no es el último intento, esperar y reintentar
        if (status === 429 && i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1000; // Backoff exponencial: 1s, 2s, 4s
          console.log(`Error 429: Esperando ${delay}ms antes de reintentar...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // Si no es 429 o es el último intento, lanzar el error
        throw error;
      }
    }
  }

  /**
   * Lee datos de presupuesto de una hoja específica
   * @param {string} sheetName - Nombre de la hoja (por defecto "Presupuestos")
   * @returns {Promise<Array>} Array de filas con datos de presupuesto
   */
  async readBudgetData(sheetName = "Presupuestos") {
    return this.retryWithBackoff(async () => {
      try {
        if (!this.isSignedIn()) {
          throw new Error("Usuario no autenticado");
        }

        this.ensureTokenSet();

        const response = await this.gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A:Z`,
        });

        return response.result.values || [];
      } catch (error) {
        // Si la hoja no existe, retornar array vacío
        if (error.result?.error?.code === 400) {
          console.log("Hoja de presupuestos no existe aún");
          return [];
        }
        throw error;
      }
    });
  }

  /**
   * Crea la hoja de presupuestos si no existe
   * @returns {Promise<boolean>} True si la hoja fue creada o ya existe
   */
  async ensureBudgetSheetExists() {
    try {
      // Si ya verificamos, no volver a hacerlo
      if (this.budgetSheetChecked) {
        return true;
      }

      // Evitar llamadas duplicadas simultáneas
      const requestKey = 'ensureBudgetSheet';
      if (this.pendingRequests.has(requestKey)) {
        return await this.pendingRequests.get(requestKey);
      }

      const requestPromise = (async () => {
        if (!this.isSignedIn()) {
          throw new Error("Usuario no autenticado");
        }

        this.ensureTokenSet();

        // Obtener información de la hoja de cálculo
        const spreadsheet = await this.gapi.client.sheets.spreadsheets.get({
          spreadsheetId: this.spreadsheetId,
        });

        const sheets = spreadsheet.result.sheets || [];
        const budgetSheetExists = sheets.some(
          (sheet) => sheet.properties.title === "Presupuestos"
        );

        if (!budgetSheetExists) {
          // Crear la hoja de presupuestos
          await this.gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.spreadsheetId,
            resource: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: "Presupuestos",
                    },
                  },
                },
              ],
            },
          });

          // Crear headers
          await this.gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetId,
            range: "Presupuestos!A1:C1",
            valueInputOption: "RAW",
            resource: {
              values: [["Month", "Category", "Expected"]],
            },
          });

          console.log("Hoja de presupuestos creada");
        }

        this.budgetSheetChecked = true;
        return true;
      })();

      this.pendingRequests.set(requestKey, requestPromise);
      
      try {
        const result = await requestPromise;
        return result;
      } finally {
        this.pendingRequests.delete(requestKey);
      }
    } catch (error) {
      console.error("Error verificando/creando hoja de presupuestos:", error);
      throw error;
    }
  }

  /**
   * Guarda o actualiza el presupuesto de un mes específico
   * @param {string} month - Mes en formato YYYY-MM
   * @param {Object} budgetData - Datos del presupuesto { categoria: expected }
   * @returns {Promise<Object>} Resultado de la operación
   */
  async saveBudget(month, budgetData) {
    try {
      if (!this.isSignedIn()) {
        throw new Error("Usuario no autenticado");
      }

      await this.ensureBudgetSheetExists();

      // Leer datos actuales
      const currentData = await this.readBudgetData();
      
      // Filtrar datos que no sean del mes actual
      const otherMonthsData = currentData
        .slice(1) // Saltar header
        .filter((row) => row[0] !== month);

      // Crear nuevos datos para este mes
      const newMonthData = Object.entries(budgetData).map(([category, data]) => [
        month,
        category,
        data.expected || 0,
      ]);

      // Combinar: header + otros meses + datos nuevos del mes actual
      const allData = [
        ["Month", "Category", "Expected"],
        ...otherMonthsData,
        ...newMonthData,
      ];

      // Limpiar toda la hoja y escribir nuevos datos
      await this.gapi.client.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: "Presupuestos!A:Z",
      });

      const response = await this.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: "Presupuestos!A1",
        valueInputOption: "RAW",
        resource: {
          values: allData,
        },
      });

      console.log("Presupuesto guardado exitosamente");
      return response.result;
    } catch (error) {
      console.error("Error guardando presupuesto:", error);
      throw error;
    }
  }

  /**
   * Carga el presupuesto de un mes específico
   * @param {string} month - Mes en formato YYYY-MM
   * @returns {Promise<Object>} Objeto con los datos del presupuesto
   */
  async loadBudget(month) {
    try {
      if (!this.isSignedIn()) {
        throw new Error("Usuario no autenticado");
      }

      await this.ensureBudgetSheetExists();

      const data = await this.readBudgetData();
      
      if (data.length <= 1) {
        // Solo hay header o está vacío
        return {};
      }

      // Filtrar por mes y convertir a objeto
      const budgetData = {};
      data.slice(1).forEach((row) => {
        if (row[0] === month) {
          const category = row[1];
          const expected = parseFloat(row[2]) || 0;
          budgetData[category] = {
            expected: expected,
            real: 0, // Se calculará desde las transacciones
          };
        }
      });

      return budgetData;
    } catch (error) {
      console.error("Error cargando presupuesto:", error);
      return {};
    }
  }

  /**
   * Obtiene todos los meses con presupuestos guardados
   * @returns {Promise<Array<string>>} Array de meses en formato YYYY-MM
   */
  async getBudgetMonths() {
    try {
      if (!this.isSignedIn()) {
        throw new Error("Usuario no autenticado");
      }

      await this.ensureBudgetSheetExists();

      const data = await this.readBudgetData();
      
      if (data.length <= 1) {
        return [];
      }

      // Obtener meses únicos
      const months = new Set();
      data.slice(1).forEach((row) => {
        if (row[0]) {
          months.add(row[0]);
        }
      });

      return Array.from(months).sort();
    } catch (error) {
      console.error("Error obteniendo meses de presupuesto:", error);
      return [];
    }
  }
}

export default GoogleSheetsService;
