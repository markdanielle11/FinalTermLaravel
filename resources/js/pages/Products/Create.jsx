import { useForm } from '@inertiajs/react';
import PageHeader from '../../components/PageHeader';
import ProductForm from '../../components/ProductForm';
import AppLayout from '../../layouts/AppLayout';

export default function Create({ categories, suppliers }) {
    const form = useForm({
        name: '',
        sku: '',
        price: '',
        product_category_id: '',
        supplier_id: '',
        size: '',
        color: '',
        description: '',
        stock: '0',
        low_stock_threshold: '10',
    });

    const submit = (event) => {
        event.preventDefault();
        form.transform((data) => ({ ...data, sku: data.sku.trim().toUpperCase() }));
        form.post('/product/products');
    };

    return (
        <AppLayout title="Add product">
            <PageHeader title="Add product" description="Fields marked * are required." />
            <div className="max-w-3xl">
                <ProductForm
                    form={form}
                    onSubmit={submit}
                    categories={categories}
                    suppliers={suppliers}
                    submitLabel="Save product"
                    cancelHref="/product/products"
                    isCreate
                />
            </div>
        </AppLayout>
    );
}
