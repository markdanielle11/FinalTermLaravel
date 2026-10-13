import { useForm } from '@inertiajs/react';
import CategoryForm from '../../components/CategoryForm';
import PageHeader from '../../components/PageHeader';
import AppLayout from '../../layouts/AppLayout';

export default function Create() {
    const form = useForm({ name: '', description: '' });

    const submit = (event) => {
        event.preventDefault();
        form.post('/product-category/product-categories');
    };

    return (
        <AppLayout title="Add category">
            <PageHeader title="Add category" />
            <CategoryForm form={form} onSubmit={submit} submitLabel="Save category" cancelHref="/product-category/product-categories" />
        </AppLayout>
    );
}
