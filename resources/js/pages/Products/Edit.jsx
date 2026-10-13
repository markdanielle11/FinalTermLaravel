import { useForm } from '@inertiajs/react';
import PageHeader from '../../components/PageHeader';
import ProductForm from '../../components/ProductForm';
import AppLayout from '../../layouts/AppLayout';

export default function Edit({ product, categories, suppliers }) {
    const form = useForm({
        name: product.name,
        sku: product.sku ?? '',
        price: product.price,
        product_category_id: product.product_category_id,
        supplier_id: product.supplier_id ?? '',
        size: product.size ?? '',
        color: product.color ?? '',
        description: product.description ?? '',
        stock: product.stock,
        low_stock_threshold: product.low_stock_threshold,
    });

    const submit = (event) => {
        event.preventDefault();
        // stock is display-only here, so it is left out of the request.
        form.transform(({ stock, ...data }) => ({ ...data, sku: data.sku.trim().toUpperCase() }));
        form.put(`/product/products/${product.id}`);
    };

    return (
        <AppLayout title={`Edit ${product.name}`}>
            <PageHeader title={`Edit ${product.name}`} description="Fields marked * are required." />
            <div className="max-w-3xl">
                <ProductForm
                    form={form}
                    onSubmit={submit}
                    categories={categories}
                    suppliers={suppliers}
                    submitLabel="Save changes"
                    cancelHref={`/product/products/${product.id}`}
                />
            </div>
        </AppLayout>
    );
}
