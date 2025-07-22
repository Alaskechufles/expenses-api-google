import { useMemo } from 'react';
import { formatCurrency, parseAmount, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/expenseConstants';

const MetricsPage = ({ data }) => {
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

        return {
            ...totals,
            balance: totals.totalIncome - totals.totalExpenses,
            monthlyBalance: totals.monthlyIncome - totals.monthlyExpenses,
            yearlyBalance: totals.yearlyIncome - totals.yearlyExpenses,
            topExpenseCategories,
            topIncomeCategories,
            topPaymentMethods,
            currentMonth,
            currentYear
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">📊 Métricas Financieras</h1>
                    <p className="text-gray-600 mt-2">Análisis detallado de tus gastos e ingresos</p>
                </div>

                {/* Resumen General */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="text-3xl mr-4">💰</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Ingresos</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.totalIncome)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="text-3xl mr-4">💸</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Gastos</p>
                                <p className="text-2xl font-bold text-red-600">{formatCurrency(metrics.totalExpenses)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="text-3xl mr-4">📈</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Balance Total</p>
                                <p className={`text-2xl font-bold ${metrics.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(metrics.balance)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="text-3xl mr-4">📋</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Registros</p>
                                <p className="text-2xl font-bold text-blue-600">{data.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Métricas Mensuales y Anuales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Este Mes */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Este Mes ({metrics.currentMonth})</h3>
                        <div className="space-y-4">
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

                {/* Top Categorías */}
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
