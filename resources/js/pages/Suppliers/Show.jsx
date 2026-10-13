import { Link } from '@inertiajs/react';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import Panel from '../../components/Panel';
import StockBadge from '../../components/StockBadge';
import AppLayout from '../../layouts/AppLayout';
import useAuth from '../../lib/useAuth';

export default function Show({ supplier, products }) {
    const { can } = useAuth();

    const details = [
        ['Contact person', supplier.contact_person],
        ['Contact number', supplier.contact_number],
        ['Email', supplier.email],
        ['Address', supplier.address],
    ];

    return (
        <AppLayout title={supplier.name}>
            <div className="mb-3 text-sm">
                <Link href="/supplier/suppliers" className="text-ink-2 hover:text-ink">
                    Suppliers
                </Link>
                <span className="px-1.5 text-ink-3">/</span>
                <span className="text-ink">{supplier.name}</span>
            </div>

            <PageHeader
                title={supplier.name}
                actions={
                    can('edit suppliers') && (
                        <Button variant="secondary" href={`/supplier/suppliers/${supplier.id}/edit`}>
                            Edit
                        </Button>
                    )
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Panel title="Contact" className="lg:col-span-1">
                    <dl className="grid gap-3">
                        {details.map(([label, value]) => (
                            <div key={label}>
                                <dt className="text-xs font-medium text-ink-3">{label}</dt>
                                <dd className="mt-0.5 text-sm break-words text-ink">{value || 'Not set'}</dd>
                            </div>
                        ))}
                    </dl>
                </Panel>

                <Panel title={`Products supplied (${products.length})`} className="lg:col-span-2" bodyClassName="">
                    {products.length === 0 ? (
                        <EmptyState title="No products from this supplier" />
                    ) : (
                        <ul className="divide-y divide-line">
                            {products.map((product) => (
                                <li key={product.id} className="flex items-center justify-between gap-4 px-5 py-3">
                                    <div className="min-w-0">
                                        <Link href={`/product/products/${product.id}`} className="block truncate text-sm font-medium text-ink hover:text-accent">
                                            {product.name}
                                        </Link>
                                        <p className="text-xs text-ink-3">
                                            {product.sku} in {product.category}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-3">
                                        <span className="text-sm tabular-nums text-ink-2">{product.stock}</span>
                                        <StockBadge status={product.stock_status} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>
            </div>
        </AppLayout>
    );
}
