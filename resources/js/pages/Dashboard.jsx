import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const logout = () => {
        router.post('/logout');
    };

    const { auth } = usePage().props;

    return (
        <>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">
                                    Dashboard
                                </h1>

                                <p className="mt-2 text-gray-600">
                                    You are successfully authenticated.
                                </p>
                            </div>

                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">
                                {auth.roles.includes('admin') && (
                                <Link
                                    href="/product-category/product-categories"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Product Category
                                </Link>
                                )}

                                <Link
                                    href="/product/products"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Products
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}