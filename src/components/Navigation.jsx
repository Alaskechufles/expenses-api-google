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
 * @file Navigation.jsx
 * @description Componente de navegación principal con menú responsive.
 *              Maneja navegación entre páginas y autenticación de usuario.
 * @author Alaskechufles
 * @version 1.0.0
 * @since 2025-07-22
 * @license MIT
 */

import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

/**
 * Componente de navegación principal
 * @param {Object} props - Props del componente
 * @param {boolean} props.isSignedIn - Estado de autenticación del usuario
 * @param {Function} props.onSignOut - Función para cerrar sesión
 * @param {boolean} props.loading - Estado de carga
 * @returns {JSX.Element} Componente de navegación
 */
const Navigation = ({ isSignedIn, onSignOut, loading }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Gastos e Ingresos', href: '/', icon: '💰' },
        { name: 'Presupuestos', href: '/budget', icon: '📋' },
        { name: 'Métricas', href: '/metrics', icon: '📊' },
    ];

    return (
        <nav className="bg-white shadow-lg mb-4 sm:mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14 sm:h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                                <span className="hidden sm:inline">💼 ExpenseTracker</span>
                                <span className="sm:hidden">💼 ET</span>
                            </Link>
                        </div>
                        {isSignedIn && (
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 lg:space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${location.pathname === item.href
                                            ? 'border-green-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        <span className="hidden lg:inline">{item.name}</span>
                                        <span className="lg:hidden">{item.name.split(' ')[0]}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {isSignedIn && (
                            <>
                                {/* Desktop logout button */}
                                <button
                                    onClick={onSignOut}
                                    disabled={loading}
                                    className="hidden sm:block bg-purple-500 hover:bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    <span className="hidden lg:inline">🚪 Cerrar Sesión</span>
                                    <span className="lg:hidden">🚪 Salir</span>
                                </button>

                                {/* Mobile menu button */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                                >
                                    <span className="sr-only">Abrir menú principal</span>
                                    {isMobileMenuOpen ? (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isSignedIn && isMobileMenuOpen && (
                <div className="sm:hidden border-t border-gray-200">
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${location.pathname === item.href
                                    ? 'bg-green-50 border-green-500 text-green-700'
                                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                    }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                onSignOut();
                            }}
                            disabled={loading}
                            className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 text-base font-medium transition-colors disabled:opacity-50"
                        >
                            🚪 Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
