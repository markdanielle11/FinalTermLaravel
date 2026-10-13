import { Link } from '@inertiajs/react';
import Button from '../../components/Button';
import ConfirmDelete from '../../components/ConfirmDelete';
import EmptyState from '../../components/EmptyState';
import { TextInput } from '../../components/Form';
import PageHeader from '../../components/PageHeader';
import Pagination from '../../components/Pagination';
import AppLayout from '../../layouts/AppLayout';
import { formatNumber } from '../../lib/format';
import useAuth from '../../lib/useAuth';
import useFilters from '../../lib/useFilters';

export default function Index({ categories, filters: initialFilters }) {
    const { can } = useAuth();
    const { filters, set, reset, active } = useFilters('/product-category/product-categories', initialFilters);

    return (
        <AppLayout title="Categories">
            <PageHeader
                title="Categories"
                description="Groups for the product catalog. A category can only be deleted when it has no products."
                actions={can('create categories') && <Button href="/product-category/product-categories/create">Add category</Button>}
            />

            <div className="rounded-xl border border-line bg-surface">
                <div className="border-b border-line p-4">
                    <label htmlFor="search" className="sr-only">
                        Search categories
                    </label>
                    <TextInput
                        id="search"
                        type="search"
                        placeholder="Search categories"
                        value={filters.search}
                        onChange={(event) => set('search', event.target.value)}
                        className="sm:max-w-xs"
                    />
                </div>

                {categories.data.length === 0 ? (
                    <EmptyState
                        title={active ? 'No categories match your search' : 'No categories yet'}
                        description={active ? 'Try another name.' : 'Create a category before adding products.'}
                        action={
                            active ? (
                                <Button variant="secondary" onClick={reset}>
                                    Clear search
                                </Button>
                            ) : (
                                can('create categories') && <Button href="/product-category/product-categories/create">Add category</Button>
                            )
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="text-xs text-ink-3">
                                <tr className="border-b border-line">
                                    <th className="px-4 py-2.5 font-medium">Name</th>
                                    <th className="px-4 py-2.5 font-medium">Description</th>
                                    <th className="px-4 py-2.5 text-right font-medium">Products</th>
                                    <th className="px-4 py-2.5 text-right font-medium">Units</th>
                                    <th className="px-4 py-2.5">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {categories.data.map((category) => (
                                    <tr key={category.id} className="hover:bg-surface-2/60">
                                        <td className="px-4 py-3">
                                            <Link href={`/product-category/product-categories/${category.id}`} className="font-medium text-ink hover:text-accent">
                                                {category.name}
                                            </Link>
                                        </td>
                                        <td className="max-w-sm px-4 py-3 text-ink-2">{category.description}</td>
                                        <td className="px-4 py-3 text-right tabular-nums text-ink-2">{category.products_count}</td>
                                        <td className="px-4 py-3 text-right tabular-nums text-ink-2">{formatNumber(category.units)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                {can('edit categories') && (
                                                    <Button variant="ghost" className="px-2.5 py-1.5" href={`/product-category/product-categories/${category.id}/edit`}>
                                                        Edit
                                                    </Button>
                                                )}
                                                {can('delete categories') && (
                                                    <ConfirmDelete
                                                        url={`/product-category/product-categories/${category.id}`}
                                                        title="Delete this category?"
                                                        message={
                                                            category.products_count > 0
                                                                ? `"${category.name}" still has ${category.products_count} product(s), so it cannot be deleted yet.`
                                                                : `"${category.name}" will be permanently deleted.`
                                                        }
                                                        className="px-2.5 py-1.5"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination paginator={categories} noun="categories" />
            </div>
        </AppLayout>
    );
}
