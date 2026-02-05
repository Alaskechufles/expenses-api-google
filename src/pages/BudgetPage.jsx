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
 * @file BudgetPage.jsx
 * @description Página principal para gestionar presupuestos mensuales.
 *              Permite crear, editar y visualizar presupuestos con montos esperados y reales.
 * @author Alaskechufles
 * @version 1.0.0
 * @since 2026-01-02
 * @license MIT
 */

import { useState, useEffect, useRef } from 'react';
import { BUDGET_CATEGORIES, parseAmount, formatCurrency } from '../constants/expenseConstants';

/**
 * Componente de página de presupuestos mensuales
 * @param {Object} props - Props del componente
 * @param {Array} props.expenses - Array de gastos e ingresos registrados
 * @param {Function} props.saveBudget - Función para guardar presupuesto
 * @param {Function} props.loadBudget - Función para cargar presupuesto
 * @param {Function} props.getBudgetMonths - Función para obtener meses con presupuestos
 * @param {boolean} props.loading - Estado de carga
 * @returns {JSX.Element} Página de presupuestos
 */
const BudgetPage = ({ expenses = [], saveBudget, loadBudget, getBudgetMonths, loading: externalLoading }) => {
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);
    const [budgetData, setBudgetData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const loadingRef = useRef(false); // Para evitar cargas duplicadas

    // Cargar presupuesto cuando cambia el mes
    useEffect(() => {
        const loadMonthBudget = async () => {
            // Evitar cargas duplicadas
            if (!loadBudget || loadingRef.current) return;
            
            // Si ya tenemos datos para este mes, no recargar
            if (budgetData[selectedMonth]) return;

            loadingRef.current = true;
            setIsLoading(true);

            try {
                const loadedBudget = await loadBudget(selectedMonth);
                
                // Inicializar con valores por defecto si no hay datos guardados
                const initialBudget = {};
                Object.keys(BUDGET_CATEGORIES).forEach(category => {
                    initialBudget[category] = {
                        expected: loadedBudget[category]?.expected || 0,
                        real: 0
                    };
                });

                setBudgetData(prev => ({
                    ...prev,
                    [selectedMonth]: initialBudget
                }));
            } catch (error) {
                console.error('Error cargando presupuesto:', error);
                // Inicializar con valores vacíos en caso de error
                const initialBudget = {};
                Object.keys(BUDGET_CATEGORIES).forEach(category => {
                    initialBudget[category] = {
                        expected: 0,
                        real: 0
                    };
                });
                setBudgetData(prev => ({
                    ...prev,
                    [selectedMonth]: initialBudget
                }));
            } finally {
                loadingRef.current = false;
                setIsLoading(false);
            }
        };

        loadMonthBudget();
    }, [selectedMonth]); // Removido loadBudget de dependencias para evitar loops

    // Calcular montos reales desde las transacciones
    useEffect(() => {
        // Esperar a que haya datos del presupuesto cargados
        if (!budgetData[selectedMonth]) return;

        const [year, month] = selectedMonth.split('-');
        const filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.data.Date);
            return expenseDate.getFullYear() === parseInt(year) && 
                   expenseDate.getMonth() + 1 === parseInt(month);
        });

        const realAmounts = {};
        Object.keys(BUDGET_CATEGORIES).forEach(category => {
            realAmounts[category] = 0;
        });

        // Sumar transacciones por categoría
        filteredExpenses.forEach(expense => {
            const category = expense.data.Category;
            const amount = parseAmount(expense.data['How Much?']);
            
            if (realAmounts.hasOwnProperty(category)) {
                realAmounts[category] += Math.abs(amount);
            }
        });

        // Actualizar SOLO los montos reales, manteniendo los esperados
        setBudgetData(prev => {
            const currentBudget = prev[selectedMonth];
            if (!currentBudget) return prev;
            
            const updatedBudget = {};
            
            Object.keys(BUDGET_CATEGORIES).forEach(category => {
                updatedBudget[category] = {
                    expected: currentBudget[category]?.expected || 0, // Mantener el expected existente
                    real: realAmounts[category] || 0
                };
            });

            return {
                ...prev,
                [selectedMonth]: updatedBudget
            };
        });
    }, [expenses, selectedMonth, budgetData[selectedMonth]?.Pathway?.expected]); // Agregamos una dependencia del expected para saber cuándo se cargaron los datos

    const handleExpectedChange = (category, value) => {
        setBudgetData(prev => {
            const newBudgetData = {
                ...prev,
                [selectedMonth]: {
                    ...prev[selectedMonth],
                    [category]: {
                        ...prev[selectedMonth][category],
                        expected: parseAmount(value)
                    }
                }
            };

            return newBudgetData;
        });
    };

    const handleSaveBudget = async () => {
        if (!saveBudget) {
            alert('Función de guardado no disponible');
            return;
        }

        if (isEditing) {
            // Guardar
            setIsSaving(true);
            setSaveMessage('');
            try {
                const success = await saveBudget(selectedMonth, budgetData[selectedMonth]);
                if (success) {
                    setSaveMessage('✅ Presupuesto guardado exitosamente');
                    setTimeout(() => setSaveMessage(''), 3000);
                } else {
                    setSaveMessage('❌ Error al guardar presupuesto');
                }
            } catch (error) {
                console.error('Error guardando:', error);
                setSaveMessage('❌ Error al guardar presupuesto');
            } finally {
                setIsSaving(false);
            }
        }
        setIsEditing(!isEditing);
    };

    const calculateTotals = () => {
        const currentBudget = budgetData[selectedMonth] || {};
        let incomeExpected = 0, incomeReal = 0;
        let expensesExpected = 0, expensesReal = 0;

        Object.entries(BUDGET_CATEGORIES).forEach(([category, config]) => {
            const amounts = currentBudget[category] || { expected: 0, real: 0 };
            if (config.isIncome && category !== 'Saldo Anterior') {
                incomeExpected += amounts.expected;
                incomeReal += amounts.real;
            } else if (!config.isIncome) {
                expensesExpected += amounts.expected;
                expensesReal += amounts.real;
            }
        });

        return { incomeExpected, incomeReal, expensesExpected, expensesReal };
    };

    const totals = calculateTotals();
    const currentBudget = budgetData[selectedMonth] || {};

    // Mostrar indicador de carga mientras se cargan los datos
    if (isLoading && !currentBudget.Pathway) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Cargando presupuesto...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">💰 Presupuestos Mensuales</h1>
                    <p className="text-gray-600">Planifica y monitorea tus ingresos y gastos esperados vs reales</p>
                    {saveMessage && (
                        <p className={`mt-2 text-sm font-medium ${saveMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                            {saveMessage}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleSaveBudget}
                    disabled={isSaving || externalLoading || isLoading}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isEditing 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    {isSaving ? '⏳ Guardando...' : isEditing ? '✅ Guardar' : '✏️ Editar Montos'}
                </button>
            </div>

            {/* Selector de mes */}
            <div className="mb-6 bg-white rounded-lg shadow p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Seleccionar Mes
                </label>
                <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    disabled={isEditing}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
            </div>

            {/* Resumen de Totales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">💵 Ingresos Totales</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-700">Esperado:</span>
                            <span className="font-bold text-green-700">{formatCurrency(totals.incomeExpected)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Real:</span>
                            <span className="font-bold text-green-800">{formatCurrency(totals.incomeReal)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700">Diferencia:</span>
                            <span className={`font-bold ${totals.incomeReal >= totals.incomeExpected ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(totals.incomeReal - totals.incomeExpected)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-800 mb-3">💸 Gastos Totales</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-700">Esperado:</span>
                            <span className="font-bold text-red-700">{formatCurrency(totals.expensesExpected)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Real:</span>
                            <span className="font-bold text-red-800">{formatCurrency(totals.expensesReal)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700">Diferencia:</span>
                            <span className={`font-bold ${totals.expensesReal <= totals.expensesExpected ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(totals.expensesExpected - totals.expensesReal)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de Ingresos */}
            <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
                <div className="bg-green-600 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold">💵 INGRESOS</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto Esperado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Real</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DIF ME-R</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Object.entries(BUDGET_CATEGORIES)
                                .filter(([_, config]) => config.isIncome)
                                .map(([category, config]) => {
                                    const amounts = currentBudget[category] || { expected: 0, real: 0 };
                                    const diff = amounts.real - amounts.expected;
                                    return (
                                        <tr key={category} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{config.type}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {isEditing && config.isEditable ? (
                                                    <input
                                                        type="number"
                                                        value={amounts.expected}
                                                        onChange={(e) => handleExpectedChange(category, e.target.value)}
                                                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <span className="font-medium text-gray-700">{formatCurrency(amounts.expected)}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="font-bold text-green-600">{formatCurrency(amounts.real)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`font-bold ${diff < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {formatCurrency(diff)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            <tr className="bg-green-50 font-bold">
                                <td className="px-6 py-4 text-sm">TOTAL</td>
                                <td className="px-6 py-4"></td>
                                <td className="px-6 py-4 text-sm">{formatCurrency(totals.incomeExpected)}</td>
                                <td className="px-6 py-4 text-sm text-green-600">{formatCurrency(totals.incomeReal)}</td>
                                <td className="px-6 py-4 text-sm">{formatCurrency(totals.incomeReal - totals.incomeExpected)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tabla de Gastos */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-red-600 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold">💸 GASTOS</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto Esperado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Real</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DIF ME-R</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Object.entries(BUDGET_CATEGORIES)
                                .filter(([_, config]) => !config.isIncome)
                                .map(([category, config]) => {
                                    const amounts = currentBudget[category] || { expected: 0, real: 0 };
                                    const diff = amounts.expected - amounts.real;
                                    return (
                                        <tr key={category} className={`hover:bg-gray-50 ${config.isCalculated ? 'bg-yellow-50' : ''}`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {category} {config.isCalculated && '🧮'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">{config.type}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {isEditing && config.isEditable ? (
                                                    <input
                                                        type="number"
                                                        value={amounts.expected}
                                                        onChange={(e) => handleExpectedChange(category, e.target.value)}
                                                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <span className="font-medium text-gray-700">{formatCurrency(amounts.expected)}</span>
                                                )}
                                                {config.isCalculated && <span className="ml-2 text-xs text-gray-500">(Auto)</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="font-bold text-red-600">{formatCurrency(amounts.real)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`font-bold ${diff < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {formatCurrency(diff)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            <tr className="bg-red-50 font-bold">
                                <td className="px-6 py-4 text-sm">TOTAL</td>
                                <td className="px-6 py-4"></td>
                                <td className="px-6 py-4 text-sm">{formatCurrency(totals.expensesExpected)}</td>
                                <td className="px-6 py-4 text-sm text-red-600">{formatCurrency(totals.expensesReal)}</td>
                                <td className="px-6 py-4 text-sm">{formatCurrency(totals.expensesExpected - totals.expensesReal)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Leyenda */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">📖 Leyenda</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-800">
                    <div><span className="font-bold">V:</span> Variable</div>
                    <div><span className="font-bold">IV:</span> Ingreso Variable</div>
                    <div><span className="font-bold">IF:</span> Ingreso Fijo</div>
                    <div><span className="font-bold">GV:</span> Gasto Variable</div>
                    <div><span className="font-bold">GF:</span> Gasto Fijo</div>
                    <div><span className="font-bold">🧮:</span> Calculado automáticamente</div>
                </div>
            </div>
        </div>
    );
};

export default BudgetPage;
