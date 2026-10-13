import { Link } from '@inertiajs/react';
import { useState } from 'react';
import Button from '../../components/Button';
import ConfirmDelete from '../../components/ConfirmDelete';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import Pagination from '../../components/Pagination';
import Panel from '../../components/Panel';
import StockAdjustModal from '../../components/StockAdjustModal';
import StockBadge, { MovementBadge } from '../../components/StockBadge';
import AppLayout from '../../layouts/AppLayout';
import { formatDateTime, formatPeso } from '../../lib/format';
import useAuth from '../../lib/useAuth';

export default function Show({ product, movements }) {
    const { can } = useAuth();
    const [adjusting, setAdjusting] = useState(null);

    const details = [
        ['SKU', product.sku],
        ['Category', product.category ? <Link href={`/product-category/product-categories/${product.category.id}`} className="text-accent hover:underline">{product.category.name}</Link> : null],
        ['Supplier', product.supplier ? <Link href={`/supplier/suppliers/${product.supplier.id}`} className="text-accent hover:underline">{product.supplier.name}</Link> : 'None'],
        ['Price', formatPeso(product.price)],
        ['Size', product.size || 'None'],
        ['Color', product.color || 'None'],
        ['Low stock at', `${product.low_stock_threshold} units or fewer`],
        ['Last updated', formatDateTime(product.updated_at)],
    ];

    return (
        <AppLayout title={product.name}>
            <div className="mb-3 text-sm">
                <Link href="/product/products" className="text-ink-2 hover:text-ink">
                    Products
                </Link>
                <span className="px-1.5 text-ink-3">/</span>
                <span className="text-ink">{product.name}</span>
            </div>

            <PageHeader
                title={product.name}
                description={product.description}
                actions={
                    <>
                        {can('adjust stock') && <Button onClick={() => setAdjusting(product)}>Stock in/out</Button>}
                        {can('edit products') && (
                            <Button variant="secondary" href={`/product/products/${product.id}/edit`}>
                                Edit
                            </Button>
                        )}
                        {can('delete products') && (
                            <ConfirmDelete
                                url={`/product/products/${product.id}`}
                                title="Delete this product?"
                                message={`"${product.name}" and its ${movements.total} stock record(s) will be permanently deleted.`}
                            />
                        )}
                    </>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Panel title="Stock" className="lg:col-span-1">
                    <p className="text-4xl font-semibold tabular-nums tracking-tight text-ink">{product.stock}</p>
                    <p className="mt-1 text-sm text-ink-2">units on hand</p>
                    <div className="mt-3">
                        <StockBadge status={product.stock_status} />
                    </div>
                    <p className="mt-4 text-sm text-ink-2">
                        Value: <span className="font-medium text-ink">{formatPeso(product.stock * product.price)}</span>
                    </p>
                </Panel>

                <Panel title="Details" className="lg:col-span-2">
                    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                        {details.map(([label, value]) => (
                            <div key={label}>
                                <dt className="text-xs font-medium text-ink-3">{label}</dt>
                                <dd className="mt-0.5 text-sm text-ink">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </Panel>
            </div>

            <Panel title="Stock history" className="mt-6" bodyClassName="">
                {movements.data.length === 0 ? (
                    <EmptyState title="No stock movements yet" description="Stock in and stock out records for this product will show here." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="text-xs text-ink-3">
                                <tr className="border-b border-line">
                                    <th className="px-5 py-2.5 font-medium">Date</th>
                                    <th className="px-5 py-2.5 font-medium">Type</th>
                                    <th className="px-5 py-2.5 text-right font-medium">Qty</th>
                                    <th className="px-5 py-2.5 text-right font-medium">Before / after</th>
                                    <th className="px-5 py-2.5 font-medium">By</th>
                                    <th className="px-5 py-2.5 font-medium">Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {movements.data.map((movement) => (
                                    <tr key={movement.id}>
                                        <td className="px-5 py-2.5 whitespace-nowrap text-ink-2">{formatDateTime(movement.created_at)}</td>
                                        <td className="px-5 py-2.5">
                                            <MovementBadge type={movement.type} />
                                        </td>
                                        <td className="px-5 py-2.5 text-right font-medium tabular-nums text-ink">
                                            {movement.type === 'in' ? '+' : '-'}
                                            {movement.quantity}
                                        </td>
                                        <td className="px-5 py-2.5 text-right tabular-nums text-ink-2">
                                            {movement.quantity_before} to {movement.quantity_after}
                                        </td>
                                        <td className="px-5 py-2.5 text-ink-2">{movement.user ?? 'Deleted user'}</td>
                                        <td className="px-5 py-2.5 text-ink-2">{movement.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination paginator={movements} noun="records" />
            </Panel>

            <StockAdjustModal product={adjusting} onClose={() => setAdjusting(null)} />
        </AppLayout>
    );
}
