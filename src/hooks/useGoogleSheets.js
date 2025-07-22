import { useState, useEffect } from "react";
import GoogleSheetsService from "../services/googleSheetsService";

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

    // Servicio directo (para operaciones avanzadas)
    sheetsService,
  };
};

export default useGoogleSheets;
