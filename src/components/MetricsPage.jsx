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
 * @file MetricsPage.jsx
 * @description Página de métricas y análisis financiero.
 *              Muestra estadísticas, gráficos y resúmenes de gastos e ingresos.
 * @author Alaskechufles
 * @version 1.0.0
 * @since 2025-07-22
 * @license MIT
 */

import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, parseAmount, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/expenseConstants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

/**
 * Página de métricas y análisis financiero
 * @param {Object} props - Props del componente
 * @param {Array} props.data - Datos de gastos e ingresos para análisis
 * @returns {JSX.Element} Página con métricas y estadísticas
 */
const MetricsPage = ({ data }) => {
    // Colores para gráficos
    const EXPENSE_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
    const INCOME_COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857'];
    
    const metrics = useMemo(() => {
        if (!data || data.length === 0) return null;

        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const currentYear = new Date().getFullYear().toString();

        // Calcular totales generales
        const totals = data.reduce((acc, row) => {
            const amount = parseAmount(row.data['How Much?']);
            const date = row.data['Date'];
            const category = row.data['Category'];
            const paymentMethod = row.data['What payment method?'];

            if (amount > 0) {
                acc.totalIncome += amount;
                acc.incomeByCategory[category] = (acc.incomeByCategory[category] || 0) + amount;
            } else {
                acc.totalExpenses += Math.abs(amount);
                acc.expensesByCategory[category] = (acc.expensesByCategory[category] || 0) + Math.abs(amount);
            }

            // Métricas por mes actual
            if (date && date.startsWith(currentMonth)) {
                if (amount > 0) {
                    acc.monthlyIncome += amount;
                } else {
                    acc.monthlyExpenses += Math.abs(amount);
                }
            }

            // Métricas por año
            if (date && date.startsWith(currentYear)) {
                if (amount > 0) {
                    acc.yearlyIncome += amount;
                } else {
                    acc.yearlyExpenses += Math.abs(amount);
                }
            }

            // Métricas por método de pago
            if (paymentMethod) {
                acc.paymentMethods[paymentMethod] = (acc.paymentMethods[paymentMethod] || 0) + Math.abs(amount);
            }

            return acc;
        }, {
            totalIncome: 0,
            totalExpenses: 0,
            monthlyIncome: 0,
            monthlyExpenses: 0,
            yearlyIncome: 0,
            yearlyExpenses: 0,
            incomeByCategory: {},
            expensesByCategory: {},
            paymentMethods: {}
        });

        // Convertir objetos a arrays ordenados
        const topExpenseCategories = Object.entries(totals.expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        const topIncomeCategories = Object.entries(totals.incomeByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        const topPaymentMethods = Object.entries(totals.paymentMethods)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        // Datos para gráficos
        const expensesPieData = topExpenseCategories.map(([category, amount]) => ({
            name: category,
            value: amount,
            percentage: ((amount / totals.totalExpenses) * 100).toFixed(1)
        }));

        const incomesPieData = topIncomeCategories.map(([category, amount]) => ({
            name: category,
            value: amount,
            percentage: ((amount / totals.totalIncome) * 100).toFixed(1)
        }));

        const paymentMethodsData = topPaymentMethods.map(([method, amount]) => ({
            method: method,
            amount: amount
        }));

        // Datos para gráfico de comparación mensual/anual
        const comparisonData = [
            {
                period: 'Este Mes',
                ingresos: totals.monthlyIncome,
                gastos: totals.monthlyExpenses,
                balance: totals.monthlyIncome - totals.monthlyExpenses
            },
            {
                period: 'Este Año',
                ingresos: totals.yearlyIncome,
                gastos: totals.yearlyExpenses,
                balance: totals.yearlyIncome - totals.yearlyExpenses
            }
        ];

        return {
            ...totals,
            balance: totals.totalIncome - totals.totalExpenses,
            monthlyBalance: totals.monthlyIncome - totals.monthlyExpenses,
            yearlyBalance: totals.yearlyIncome - totals.yearlyExpenses,
            topExpenseCategories,
            topIncomeCategories,
            topPaymentMethods,
            currentMonth,
            currentYear,
            expensesPieData,
            incomesPieData,
            paymentMethodsData,
            comparisonData
        };
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">No hay datos para mostrar</h2>
                        <p className="text-gray-600">Agrega algunos gastos e ingresos para ver las métricas.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📊 Métricas Financieras</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Análisis detallado de tus gastos e ingresos</p>
                </div>

                {/* Resumen General */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="text-2xl sm:text-3xl mr-3 sm:mr-4">💰</div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Ingresos</p>
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 truncate">{formatCurrency(metrics.totalIncome)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="text-2xl sm:text-3xl mr-3 sm:mr-4">💸</div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Gastos</p>
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 truncate">{formatCurrency(metrics.totalExpenses)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="text-2xl sm:text-3xl mr-3 sm:mr-4">📈</div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Balance Total</p>
                                <p className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${metrics.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(metrics.balance)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="text-2xl sm:text-3xl mr-3 sm:mr-4">📋</div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Registros</p>
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{data.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Métricas Mensuales y Anuales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Este Mes */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">📅 Este Mes ({metrics.currentMonth})</h3>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Ingresos:</span>
                                <span className="text-green-600 font-medium">{formatCurrency(metrics.monthlyIncome)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Gastos:</span>
                                <span className="text-red-600 font-medium">{formatCurrency(metrics.monthlyExpenses)}</span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Balance:</span>
                                    <span className={`font-bold ${metrics.monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(metrics.monthlyBalance)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Este Año */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📆 Este Año ({metrics.currentYear})</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Ingresos:</span>
                                <span className="text-green-600 font-medium">{formatCurrency(metrics.yearlyIncome)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Gastos:</span>
                                <span className="text-red-600 font-medium">{formatCurrency(metrics.yearlyExpenses)}</span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Balance:</span>
                                    <span className={`font-bold ${metrics.yearlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(metrics.yearlyBalance)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráficos de Análisis */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                    {/* Gráfico de Comparación Ingresos vs Gastos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">📊 Comparación Ingresos vs Gastos</CardTitle>
                            <CardDescription>
                                Comparación mensual y anual de ingresos, gastos y balance
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={metrics.comparisonData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="period" />
                                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                        <Tooltip 
                                            formatter={(value) => formatCurrency(value)}
                                            labelStyle={{ color: '#374151' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
                                        <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
                                        <Bar dataKey="balance" fill="#3b82f6" name="Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gráfico de Distribución de Gastos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">🥧 Distribución de Gastos</CardTitle>
                            <CardDescription>
                                Porcentaje de gastos por categoría
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={metrics.expensesPieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {metrics.expensesPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Gráficos adicionales */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                    {/* Distribución de Ingresos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">💰 Distribución de Ingresos</CardTitle>
                            <CardDescription>
                                Porcentaje de ingresos por categoría
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={metrics.incomesPieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                                            outerRadius={80}
                                            fill="#10b981"
                                            dataKey="value"
                                        >
                                            {metrics.incomesPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Métodos de Pago */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">💳 Uso por Método de Pago</CardTitle>
                            <CardDescription>
                                Comparación de uso de diferentes métodos de pago
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={metrics.paymentMethodsData} layout="horizontal">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                                        <YAxis dataKey="method" type="category" width={100} />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Bar dataKey="amount" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>                {/* Top Categorías */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Gastos por Categoría */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏷️ Top Gastos por Categoría</h3>
                        <div className="space-y-3">
                            {metrics.topExpenseCategories.map(([category, amount]) => (
                                <div key={category} className="flex justify-between items-center">
                                    <span className="text-gray-700">{category}</span>
                                    <div className="flex items-center">
                                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                            <div
                                                className="bg-red-500 h-2 rounded-full"
                                                style={{ width: `${(amount / metrics.totalExpenses) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-red-600 font-medium text-sm">{formatCurrency(amount)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Ingresos por Categoría */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Top Ingresos por Categoría</h3>
                        <div className="space-y-3">
                            {metrics.topIncomeCategories.map(([category, amount]) => (
                                <div key={category} className="flex justify-between items-center">
                                    <span className="text-gray-700">{category}</span>
                                    <div className="flex items-center">
                                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${(amount / metrics.totalIncome) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-green-600 font-medium text-sm">{formatCurrency(amount)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Métodos de Pago */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Uso por Método de Pago</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {metrics.topPaymentMethods.map(([method, amount]) => (
                            <div key={method} className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">{method}</div>
                                <div className="text-xl font-bold text-blue-600">{formatCurrency(amount)}</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${(amount / Math.max(...Object.values(metrics.paymentMethods))) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsPage;
