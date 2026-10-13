import { useForm } from '@inertiajs/react';
import CategoryForm from '../../components/CategoryForm';
import PageHeader from '../../components/PageHeader';
import AppLayout from '../../layouts/AppLayout';

export default function Edit({ category }) {
    const form = useForm({ name: category.name, description: category.description ?? '' });

    const submit = (event) => {
        event.preventDefault();
        form.put(`/product-category/product-categories/${category.id}`);
    };

    return (
        <AppLayout title={`Edit ${category.name}`}>
            <PageHeader title={`Edit ${category.name}`} />
            <CategoryForm form={form} onSubmit={submit} submitLabel="Save changes" cancelHref="/product-category/product-categories" />
        </AppLayout>
    );
}
