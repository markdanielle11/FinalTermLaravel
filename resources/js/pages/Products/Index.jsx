import { ArrowsDownUpIcon, PencilSimpleIcon, PlusIcon } from '@phosphor-icons/react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import Button from '../../components/Button';
import ColorSwatch from '../../components/ColorSwatch';
import EmptyState from '../../components/EmptyState';
import { Select } from '../../components/Form';
import PageHeader from '../../components/PageHeader';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import StockAdjustModal from '../../components/StockAdjustModal';
import StockBadge from '../../components/StockBadge';
import AppLayout from '../../layouts/AppLayout';
import { formatPeso } from '../../lib/format';
import useAuth from '../../lib/useAuth';
import useFilters from '../../lib/useFilters';

export default function Index({ products, filters: initialFilters, categories, suppliers }) {
    const { can } = useAuth();
    const { filters, set, reset, active } = useFilters('/product/products', initialFilters);
    const [adjusting, setAdjusting] = useState(null);

    return (
        <AppLayout title="Products">
            <PageHeader
                title="Products"
                description="Search the catalog, check stock status, and record stock in or out."
                actions={can('create products') && <Button href="/product/products/create"><PlusIcon size={16} weight="bold" />Add product</Button>}
            />

            <div className="rounded-xl border border-line bg-surface">
                {/* Filters */}
                <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                    <SearchInput label="Search products" placeholder="Search name, SKU, or color" value={filters.search} onChange={(event) => set('search', event.target.value)} />
                    <FilterSelect id="category" label="Category" value={filters.category} onChange={(value) => set('category', value)}>
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </FilterSelect>
                    <FilterSelect id="supplier" label="Supplier" value={filters.supplier} onChange={(value) => set('supplier', value)}>
                        <option value="">All suppliers</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </FilterSelect>
                    <FilterSelect id="status" label="Stock status" value={filters.status} onChange={(value) => set('status', value)}>
                        <option value="">Any status</option>
                        <option value="in_stock">In stock</option>
                        <option value="low_stock">Low stock</option>
                        <option value="out_of_stock">Out of stock</option>
                    </FilterSelect>
                    <Button variant="ghost" onClick={reset} disabled={!active}>
                        Clear
                    </Button>
                </div>

                {products.data.length === 0 ? (
                    <EmptyState
                        title={active ? 'No products match these filters' : 'No products yet'}
                        description={active ? 'Try a different search or clear the filters.' : 'Add your first product to start tracking stock.'}
                        action={
                            active ? (
                                <Button variant="secondary" onClick={reset}>
                                    Clear filters
                                </Button>
                            ) : (
                                can('create products') && <Button href="/product/products/create"><PlusIcon size={16} weight="bold" />Add product</Button>
                            )
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px] text-left text-sm">
                            <thead className="bg-surface-2/60 text-xs text-ink-3">
                                <tr className="border-b border-line">
                                    <th className="px-4 py-2.5 font-medium">Product</th>
                                    <th className="px-4 py-2.5 font-medium">Category</th>
                                    <th className="px-4 py-2.5 font-medium">Supplier</th>
                                    <th className="px-4 py-2.5 font-medium">Size / color</th>
                                    <th className="px-4 py-2.5 text-right font-medium">Price</th>
                                    <th className="px-4 py-2.5 text-right font-medium">Stock</th>
                                    <th className="px-4 py-2.5 font-medium">Status</th>
                                    <th className="px-4 py-2.5">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {products.data.map((product) => (
                                    <tr key={product.id} className="hover:bg-surface-2/60">
                                        <td className="px-4 py-3">
                                            <Link href={`/product/products/${product.id}`} className="font-medium whitespace-nowrap text-ink hover:text-accent">
                                                {product.name}
                                            </Link>
                                            <p className="text-xs text-ink-3">{product.sku}</p>
                                        </td>
                                        <td className="px-4 py-3 text-ink-2">{product.category?.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-ink-2">{product.supplier?.name ?? <span className="text-ink-3">None</span>}</td>
                                        <td className="px-4 py-3 text-ink-2">
                                            <span className="flex items-center gap-2 whitespace-nowrap">
                                                <ColorSwatch color={product.color} />
                                                {[product.size, product.color].filter(Boolean).join(' / ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right tabular-nums text-ink-2">{formatPeso(product.price)}</td>
                                        <td className="px-4 py-3 text-right font-medium tabular-nums text-ink">{product.stock}</td>
                                        <td className="px-4 py-3">
                                            <StockBadge status={product.stock_status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                {can('adjust stock') && (
                                                    <Button variant="secondary" className="px-2.5 py-1.5" onClick={() => setAdjusting(product)}>
                                                        <ArrowsDownUpIcon size={16} />
                                                        Stock in/out
                                                    </Button>
                                                )}
                                                {can('edit products') && (
                                                    <Button
                                                        variant="ghost"
                                                        className="px-2.5 py-1.5"
                                                        href={`/product/products/${product.id}/edit`}
                                                        aria-label={`Edit ${product.name}`}
                                                        title="Edit"
                                                    >
                                                        <PencilSimpleIcon size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination paginator={products} noun="products" />
            </div>

            <StockAdjustModal product={adjusting} onClose={() => setAdjusting(null)} />
        </AppLayout>
    );
}

function FilterSelect({ id, label, value, onChange, children }) {
    return (
        <div>
            <label htmlFor={id} className="sr-only">
                {label}
            </label>
            <Select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
                {children}
            </Select>
        </div>
    );
}
