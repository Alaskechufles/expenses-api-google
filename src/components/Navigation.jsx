import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ isSignedIn, onSignOut, loading }) => {
    const location = useLocation();

    const navigation = [
        { name: 'Gastos e Ingresos', href: '/', icon: '💰' },
        { name: 'Métricas', href: '/metrics', icon: '📊' },
    ];

    return (
        <nav className="bg-white shadow-lg mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-gray-900">
                                💼 ExpenseTracker
                            </Link>
                        </div>
                        {isSignedIn && (
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${location.pathname === item.href
                                                ? 'border-blue-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        {isSignedIn && (
                            <button
                                onClick={onSignOut}
                                disabled={loading}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                🚪 Cerrar Sesión
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isSignedIn && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${location.pathname === item.href
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                    }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
