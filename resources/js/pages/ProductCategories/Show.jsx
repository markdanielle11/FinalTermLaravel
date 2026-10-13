import { Link } from '@inertiajs/react';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import Panel from '../../components/Panel';
import StockBadge from '../../components/StockBadge';
import AppLayout from '../../layouts/AppLayout';
import { formatPeso } from '../../lib/format';
import useAuth from '../../lib/useAuth';

export default function Show({ category, products }) {
    const { can } = useAuth();

    return (
        <AppLayout title={category.name}>
            <div className="mb-3 text-sm">
                <Link href="/product-category/product-categories" className="text-ink-2 hover:text-ink">
                    Categories
                </Link>
                <span className="px-1.5 text-ink-3">/</span>
                <span className="text-ink">{category.name}</span>
            </div>

            <PageHeader
                title={category.name}
                description={category.description}
                actions={
                    can('edit categories') && (
                        <Button variant="secondary" href={`/product-category/product-categories/${category.id}/edit`}>
                            Edit
                        </Button>
                    )
                }
            />

            <Panel title={`Products in this category (${products.length})`} bodyClassName="">
                {products.length === 0 ? (
                    <EmptyState title="No products in this category" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] text-left text-sm">
                            <thead className="text-xs text-ink-3">
                                <tr className="border-b border-line">
                                    <th className="px-5 py-2.5 font-medium">Product</th>
                                    <th className="px-5 py-2.5 font-medium">Supplier</th>
                                    <th className="px-5 py-2.5 text-right font-medium">Price</th>
                                    <th className="px-5 py-2.5 text-right font-medium">Stock</th>
                                    <th className="px-5 py-2.5 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-5 py-2.5">
                                            <Link href={`/product/products/${product.id}`} className="font-medium text-ink hover:text-accent">
                                                {product.name}
                                            </Link>
                                            <p className="text-xs text-ink-3">{product.sku}</p>
                                        </td>
                                        <td className="px-5 py-2.5 text-ink-2">{product.supplier ?? 'None'}</td>
                                        <td className="px-5 py-2.5 text-right tabular-nums text-ink-2">{formatPeso(product.price)}</td>
                                        <td className="px-5 py-2.5 text-right tabular-nums text-ink">{product.stock}</td>
                                        <td className="px-5 py-2.5">
                                            <StockBadge status={product.stock_status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>
        </AppLayout>
    );
}
