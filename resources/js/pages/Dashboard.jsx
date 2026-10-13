import { Link } from '@inertiajs/react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import StockBadge, { MovementBadge } from '../components/StockBadge';
import AppLayout from '../layouts/AppLayout';
import { formatDateTime, formatNumber, formatPeso } from '../lib/format';
import useAuth from '../lib/useAuth';

export default function Dashboard({ stats, needsAttention, recentMovements, categories }) {
    const { user, can } = useAuth();
    const firstName = user?.name?.split(' ')[0] ?? '';

    return (
        <AppLayout title="Dashboard">
            <PageHeader
                title={`Hello, ${firstName}`}
                description="Stock levels across all categories, what needs restocking, and the latest activity."
                actions={
                    can('create products') && (
                        <Button href="/product/products/create">Add product</Button>
                    )
                }
            />

            {/* KPI strip */}
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3 xl:grid-cols-6">
                <Stat label="Products" value={formatNumber(stats.products)} />
                <Stat label="Units in stock" value={formatNumber(stats.units)} />
                <Stat label="Stock value" value={formatPeso(stats.stock_value)} />
                <Stat label="Suppliers" value={formatNumber(stats.suppliers)} />
                <Stat label="Low stock" value={formatNumber(stats.low_stock)} tone={stats.low_stock > 0 ? 'text-warn' : undefined} href="/product/products?status=low_stock" />
                <Stat label="Out of stock" value={formatNumber(stats.out_of_stock)} tone={stats.out_of_stock > 0 ? 'text-bad' : undefined} href="/product/products?status=out_of_stock" />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
                <Panel
                    title="Needs restocking"
                    className="lg:col-span-3"
                    bodyClassName=""
                    actions={
                        <Link href="/product/products?status=low_stock" className="text-sm font-medium text-accent hover:underline">
                            View low stock
                        </Link>
                    }
                >
                    {needsAttention.length === 0 ? (
                        <EmptyState title="Everything is stocked" description="No product is at or below its low stock threshold." />
                    ) : (
                        <ul className="divide-y divide-line">
                            {needsAttention.map((product) => (
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
                                        <span className="text-sm tabular-nums text-ink-2">
                                            {product.stock} / {product.low_stock_threshold}
                                        </span>
                                        <StockBadge status={product.stock_status} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>

                <Panel
                    title="Recent stock activity"
                    className="lg:col-span-2"
                    bodyClassName=""
                    actions={
                        can('view stock movements') && (
                            <Link href="/stock/movements" className="text-sm font-medium text-accent hover:underline">
                                Full history
                            </Link>
                        )
                    }
                >
                    {recentMovements.length === 0 ? (
                        <EmptyState title="No activity yet" description="Stock in and stock out records will appear here." />
                    ) : (
                        <ul className="divide-y divide-line">
                            {recentMovements.map((movement) => (
                                <li key={movement.id} className="px-5 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <Link href={`/product/products/${movement.product?.id}`} className="truncate text-sm font-medium text-ink hover:text-accent">
                                            {movement.product?.name}
                                        </Link>
                                        <span className={`shrink-0 text-sm font-medium tabular-nums ${movement.type === 'in' ? 'text-ok' : 'text-ink-2'}`}>
                                            {movement.type === 'in' ? '+' : '-'}
                                            {movement.quantity}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-ink-3">
                                        <MovementBadge type={movement.type} />
                                        <span className="truncate">
                                            {movement.user ?? 'Deleted user'}, {formatDateTime(movement.created_at)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>
            </div>

            <Panel title="Stock by category" className="mt-6" bodyClassName="">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-ink-3">
                            <tr>
                                <th className="px-5 py-2.5 font-medium">Category</th>
                                <th className="px-5 py-2.5 text-right font-medium">Products</th>
                                <th className="px-5 py-2.5 text-right font-medium">Units</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-5 py-2.5 text-ink">{category.name}</td>
                                    <td className="px-5 py-2.5 text-right tabular-nums text-ink-2">{category.products_count}</td>
                                    <td className="px-5 py-2.5 text-right tabular-nums text-ink-2">{formatNumber(category.units)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Panel>
        </AppLayout>
    );
}

function Stat({ label, value, tone, href }) {
    const body = (
        <>
            <p className="text-xs font-medium text-ink-3">{label}</p>
            <p className={`mt-1 text-xl font-semibold tabular-nums tracking-tight ${tone ?? 'text-ink'}`}>{value}</p>
        </>
    );

    return href ? (
        <Link href={href} className="block bg-surface px-4 py-4 transition-colors hover:bg-surface-2">
            {body}
        </Link>
    ) : (
        <div className="bg-surface px-4 py-4">{body}</div>
    );
}
