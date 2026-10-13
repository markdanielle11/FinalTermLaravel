import { Link } from '@inertiajs/react';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import { Select } from '../../components/Form';
import PageHeader from '../../components/PageHeader';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import { MovementBadge } from '../../components/StockBadge';
import AppLayout from '../../layouts/AppLayout';
import { formatDateTime } from '../../lib/format';
import useFilters from '../../lib/useFilters';

/**
 * Audit trail: every stock change with who made it and the quantity before and after.
 * Records are never edited or deleted from the UI.
 */
export default function Index({ movements, filters: initialFilters }) {
    const { filters, set, reset, active } = useFilters('/stock/movements', initialFilters);

    return (
        <AppLayout title="Stock history">
            <PageHeader title="Stock history" description="Every stock in and stock out, newest first. To record a movement, use Stock in/out on a product." />

            <div className="rounded-xl border border-line bg-surface">
                <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-[2fr_1fr_auto]">
                    <SearchInput label="Search by product" placeholder="Search product name or SKU" value={filters.search} onChange={(event) => set('search', event.target.value)} />
                    <div>
                        <label htmlFor="type" className="sr-only">
                            Movement type
                        </label>
                        <Select id="type" value={filters.type} onChange={(event) => set('type', event.target.value)}>
                            <option value="">In and out</option>
                            <option value="in">Stock in only</option>
                            <option value="out">Stock out only</option>
                        </Select>
                    </div>
                    <Button variant="ghost" onClick={reset} disabled={!active}>
                        Clear
                    </Button>
                </div>

                {movements.data.length === 0 ? (
                    <EmptyState
                        title={active ? 'No records match these filters' : 'No stock movements yet'}
                        description={active ? 'Try another product or type.' : 'Records appear here after the first stock in or out.'}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="bg-surface-2/60 text-xs text-ink-3">
                                <tr className="border-b border-line">
                                    <th className="px-4 py-2.5 font-medium">Date</th>
                                    <th className="px-4 py-2.5 font-medium">Product</th>
                                    <th className="px-4 py-2.5 font-medium">Type</th>
                                    <th className="px-4 py-2.5 text-right font-medium">Qty</th>
                                    <th className="px-4 py-2.5 text-right font-medium">Before / after</th>
                                    <th className="px-4 py-2.5 font-medium">By</th>
                                    <th className="px-4 py-2.5 font-medium">Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {movements.data.map((movement) => (
                                    <tr key={movement.id}>
                                        <td className="px-4 py-2.5 whitespace-nowrap text-ink-2">{formatDateTime(movement.created_at)}</td>
                                        <td className="px-4 py-2.5">
                                            {movement.product ? (
                                                <Link href={`/product/products/${movement.product.id}`} className="font-medium text-ink hover:text-accent">
                                                    {movement.product.name}
                                                </Link>
                                            ) : (
                                                <span className="text-ink-3">Deleted product</span>
                                            )}
                                            <p className="text-xs text-ink-3">{movement.product?.sku}</p>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <MovementBadge type={movement.type} />
                                        </td>
                                        <td className="px-4 py-2.5 text-right font-medium tabular-nums text-ink">
                                            {movement.type === 'in' ? '+' : '-'}
                                            {movement.quantity}
                                        </td>
                                        <td className="px-4 py-2.5 text-right tabular-nums text-ink-2">
                                            {movement.quantity_before} to {movement.quantity_after}
                                        </td>
                                        <td className="px-4 py-2.5 text-ink-2">{movement.user ?? 'Deleted user'}</td>
                                        <td className="px-4 py-2.5 text-ink-2">{movement.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination paginator={movements} noun="records" />
            </div>
        </AppLayout>
    );
}
