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
 * @file App.jsx
 * @description Componente principal de la aplicación de gestión de gastos e ingresos.
 *              Maneja la autenticación con Google, enrutamiento y configuración general.
 * @author Alaskechufles
 * @version 1.0.0
 * @since 2025-07-22
 * @license MIT
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useGoogleSheets from './hooks/useGoogleSheets';
import Navigation from './components/Navigation';
import ExpensesPage from './pages/ExpensesPage';
import MetricsPage from './components/MetricsPage';

/**
 * Componente principal de la aplicación
 * @returns {JSX.Element} La aplicación completa con enrutamiento y autenticación
 */
function App() {
  // Configuración de Google Sheets desde variables de entorno
  const config = {
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    spreadsheetId: import.meta.env.VITE_GOOGLE_SPREADSHEET_ID
  };

  const {
    isInitialized,
    isSignedIn,
    data,
    headers,
    loading,
    error,
    signIn,
    signOut,
    loadData,
    createRow,
    updateRow,
    deleteRow
  } = useGoogleSheets(config);

  // Validar que las variables de entorno estén configuradas
  if (!config.apiKey || !config.clientId || !config.spreadsheetId) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 max-w-md w-full border-l-4 border-red-500">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">⚠️</div>
            <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Configuración Faltante</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Las variables de entorno de Google Sheets no están configuradas.
            </p>
            <div className="text-left bg-gray-50 p-3 sm:p-4 rounded-lg">
              <p className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Variables requeridas:</p>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li className={config.apiKey ? 'text-green-600' : 'text-red-600'}>
                  {config.apiKey ? '✓' : '✗'} VITE_GOOGLE_API_KEY
                </li>
                <li className={config.clientId ? 'text-green-600' : 'text-red-600'}>
                  {config.clientId ? '✓' : '✗'} VITE_GOOGLE_CLIENT_ID
                </li>
                <li className={config.spreadsheetId ? 'text-green-600' : 'text-red-600'}>
                  {config.spreadsheetId ? '✓' : '✗'} VITE_GOOGLE_SPREADSHEET_ID
                </li>
              </ul>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-4">
              Consulta el README.md para instrucciones de configuración.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si no está inicializado
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Configurando Google Sheets...</h2>
          <p className="text-sm sm:text-base text-gray-500">Inicializando conexión con la API</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado
  if (!isSignedIn) {
    return (
      <div className=" min-h-screen bg-gradient-to-br from-green-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-2xs sm:max-w-md w-full">
          <div className="text-center">
            <div className="relative mb-6 sm:mb-8">
              <div className="text-6xl sm:text-7xl mb-2 animate-bounce">💼</div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
            </div>

            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                ExpenseTracker
              </h1>
              <div className="relative">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6 italic">
                  <span className="relative">
                    Fam. Huarsaya Berlanga
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-purple-400 rounded-full"></div>
                  </span>
                </h2>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-green-100">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed font-medium">
                ✨ Gestiona tus gastos e ingresos de forma
                <span className="text-green-600 font-semibold"> inteligente </span>
                conectando directamente con
                <span className="text-purple-600 font-semibold"> Google Sheets</span>.
              </p>
            </div>

            <button
              onClick={signIn}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                  Conectando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Iniciar Sesión con Google
                </>
              )}
            </button>

            <div className="mt-8 sm:mt-10 text-left">
              <h3 className="font-bold text-gray-800 mb-4 text-base sm:text-lg flex items-center">
                <span className="text-2xl mr-2">✨</span>
                Características principales:
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                  <span className="text-green-500 mr-3 text-lg flex-shrink-0">💰</span>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Registra gastos e ingresos</span>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                  <span className="text-purple-500 mr-3 text-lg flex-shrink-0">📊</span>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Métricas y análisis detallados</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                  <span className="text-blue-500 mr-3 text-lg flex-shrink-0">🔄</span>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Sincronización con Google Sheets</span>
                </div>
                <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors">
                  <span className="text-amber-500 mr-3 text-lg flex-shrink-0">🔍</span>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Filtros y categorización</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation
          isSignedIn={isSignedIn}
          onSignOut={signOut}
          loading={loading}
        />

        <Routes>
          <Route
            path="/"
            element={
              <ExpensesPage
                data={data}
                headers={headers}
                loading={loading}
                error={error}
                createRow={createRow}
                updateRow={updateRow}
                deleteRow={deleteRow}
                loadData={loadData}
              />
            }
          />
          <Route
            path="/metrics"
            element={<MetricsPage data={data} />}
          />
          {/* Ruta catch-all para redirigir rutas no encontradas */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
