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
    this.isInitialized = false;
    this.isSignedInState = false;
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
  async readData(range = this.range) {
    try {
      if (!this.isSignedIn()) {
        throw new Error("Usuario no autenticado");
      }

      this.ensureTokenSet();

      const response = await this.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      return response.result.values || [];
    } catch (error) {
      console.error("Error leyendo datos:", error);
      throw error;
    }
  }

  // CREATE - Agregar nueva fila
  async createRow(values, range = "A:Z") {
    try {
      if (!this.isSignedIn()) {
        throw new Error("Usuario no autenticado");
      }

      this.ensureTokenSet();

      const response = await this.gapi.client.sheets.spreadsheets.values.append(
        {
          spreadsheetId: this.spreadsheetId,
          range: range,
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
  async updateRow(range, values) {
    try {
      if (!this.isSignedIn()) {
        throw new Error("Usuario no autenticado");
      }

      this.ensureTokenSet();

      const response = await this.gapi.client.sheets.spreadsheets.values.update(
        {
          spreadsheetId: this.spreadsheetId,
          range: range,
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
  async deleteRow(range) {
    try {
      if (!this.isSignedIn()) {
        throw new Error("Usuario no autenticado");
      }

      this.ensureTokenSet();

      const response = await this.gapi.client.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: range,
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
}

export default GoogleSheetsService;
