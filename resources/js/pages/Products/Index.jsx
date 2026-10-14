import { Link } from '@inertiajs/react';
import { ArrowsDownUpIcon, PencilSimpleIcon, PlusIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import Button from '../../components/Button';
import ColorSwatch from '../../components/ColorSwatch';
import EmptyState from '../../components/EmptyState';
import { Select } from '../../components/Form';
import PageHeader from '../../components/PageHeader';
import Pagination from '../../components/Pagination';
import SearchInput from '../../components/SearchInput';
import SortHeader from '../../components/SortHeader';
import StockAdjustModal from '../../components/StockAdjustModal';
import StockBadge from '../../components/StockBadge';
import AppLayout from '../../layouts/AppLayout';
import { formatPeso } from '../../lib/format';
import useAuth from '../../lib/useAuth';
import useFilters from '../../lib/useFilters';

export default function Index({ products, filters: initialFilters, categories, suppliers }) {
    const { can } = useAuth();
    const { filters, set, setMany, reset, active, loading } = useFilters('/product/products', initialFilters);
    const [adjusting, setAdjusting] = useState(null);

    const addButton = can('create products') && (
        <Button href="/product/products/create">
            <PlusIcon size={16} weight="bold" />
            Add product
        </Button>
    );

    const actions = (product, compact = false) => (
        <div className={`flex gap-1 ${compact ? '' : 'justify-end'}`}>
            {can('adjust stock') && (
                <Button
                    variant="secondary"
                    className="px-2.5 py-1.5"
                    onClick={() => setAdjusting(product)}
                    aria-label={`Stock in or out for ${product.name}`}
                    title="Stock in/out"
                >
                    <ArrowsDownUpIcon size={16} />
                    {/* Full label on phones (cards) and very wide screens; icon only in between. */}
                    <span className={compact ? '' : 'hidden 2xl:inline'}>Stock in/out</span>
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
    );

    return (
        <AppLayout title="Products">
            <PageHeader
                title="Products"
                description="Search the catalog, check stock status, and record stock in or out."
                actions={addButton}
            />

            <div className="rounded-xl border border-line bg-surface">
                {/* Filters */}
                <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                    <SearchInput
                        label="Search products"
                        placeholder="Search name, SKU, or color"
                        value={filters.search}
                        onChange={(event) => set('search', event.target.value)}
                    />
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

                <div aria-busy={loading} className={`transition-opacity duration-150 ${loading ? 'opacity-50' : ''}`}>
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
                                    addButton
                                )
                            }
                        />
                    ) : (
                        <>
                            {/* Phones and tablets: one card per product */}
                            <ul className="divide-y divide-line xl:hidden">
                                {products.data.map((product) => (
                                    <li key={product.id} className="grid gap-3 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <Link href={`/product/products/${product.id}`} className="block font-medium text-ink">
                                                    {product.name}
                                                </Link>
                                                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-3">
                                                    <ColorSwatch color={product.color} />
                                                    {[product.sku, product.category?.name, product.size, product.color].filter(Boolean).join(', ')}
                                                </p>
                                            </div>
                                            <StockBadge status={product.stock_status} />
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm text-ink-2">
                                                <span className="font-semibold tabular-nums text-ink">{product.stock}</span> in stock,{' '}
                                                {formatPeso(product.price)}
                                            </p>
                                            {actions(product, true)}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Wide screens: table */}
                            <div className="hidden overflow-x-auto xl:block">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-surface-2/60 text-xs text-ink-3">
                                        <tr className="border-b border-line">
                                            <SortHeader column="name" label="Product" filters={filters} onSort={setMany} />
                                            <th scope="col" className="px-4 py-2.5 font-medium">Category</th>
                                            <th scope="col" className="px-4 py-2.5 font-medium">Supplier</th>
                                            <SortHeader column="price" label="Price" filters={filters} onSort={setMany} align="right" />
                                            <SortHeader column="stock" label="Stock" filters={filters} onSort={setMany} align="right" />
                                            <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                                            <th scope="col" className="px-4 py-2.5">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-line">
                                        {products.data.map((product) => (
                                            <tr key={product.id} className="transition-colors hover:bg-surface-2/60">
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href={`/product/products/${product.id}`}
                                                        prefetch
                                                        className="font-medium whitespace-nowrap text-ink hover:text-accent"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <p className="mt-0.5 flex items-center gap-1.5 text-xs whitespace-nowrap text-ink-3">
                                                        <ColorSwatch color={product.color} />
                                                        {[product.sku, [product.size, product.color].filter(Boolean).join(' / ')].filter(Boolean).join(', ')}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-ink-2">{product.category?.name}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-ink-2">
                                                    {product.supplier?.name ?? <span className="text-ink-3">None</span>}
                                                </td>
                                                <td className="px-4 py-3 text-right tabular-nums text-ink-2">{formatPeso(product.price)}</td>
                                                <td className="px-4 py-3 text-right font-medium tabular-nums text-ink">{product.stock}</td>
                                                <td className="px-4 py-3">
                                                    <StockBadge status={product.stock_status} />
                                                </td>
                                                <td className="px-4 py-3">{actions(product)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

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
