import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useGoogleSheets from './hooks/useGoogleSheets';
import Navigation from './components/Navigation';
import ExpensesPage from './pages/ExpensesPage';
import MetricsPage from './components/MetricsPage';

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
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 border-l-4 border-red-500">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Configuración Faltante</h2>
            <p className="text-gray-700 mb-4">
              Las variables de entorno de Google Sheets no están configuradas.
            </p>
            <div className="text-left bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-800 mb-2">Variables requeridas:</p>
              <ul className="text-sm text-gray-600 space-y-1">
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
            <p className="text-sm text-gray-500 mt-4">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Configurando Google Sheets...</h2>
          <p className="text-gray-500">Inicializando conexión con la API</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-6">💼</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">ExpenseTracker</h1>
            <p className="text-gray-600 mb-8">
              Gestiona tus gastos e ingresos de forma inteligente conectando directamente con Google Sheets.
            </p>

            <button
              onClick={signIn}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Conectando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Iniciar Sesión con Google
                </>
              )}
            </button>

            <div className="mt-8 text-left">
              <h3 className="font-semibold text-gray-800 mb-3">✨ Características:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Registra gastos e ingresos
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Métricas y análisis detallados
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Sincronización con Google Sheets
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Filtros y categorización
                </li>
              </ul>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
